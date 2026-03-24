/**
 * AuthContext
 * 
 * Provides authentication state and actions throughout the application.
 * Manages user authentication, profile data, and role-based access.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 10.8
 * 
 * @example
 * ```tsx
 * // Wrap your app with AuthProvider
 * function App() {
 *   return (
 *     <AuthProvider>
 *       <Navigation />
 *     </AuthProvider>
 *   );
 * }
 * 
 * // Use the hook in any component
 * function LoginScreen() {
 *   const { signIn, loading, error } = useAuth();
 *   
 *   const handleLogin = async () => {
 *     await signIn(email, password, 'teacher');
 *   };
 * }
 * ```
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import type { Teacher, Student } from '@/types/models';
import type { TeacherInsert, StudentInsert } from '@/types/database';
import * as authService from '@/services/supabase/auth';
import { transformTeacher, transformStudent } from '@/utils/transformers';

/**
 * User role type
 */
export type UserRole = 'teacher' | 'student' | null;

/**
 * Authentication context state
 */
export interface AuthContextState {
  /** Currently authenticated user */
  user: User | null;
  /** User profile (Teacher or Student) */
  profile: Teacher | Student | null;
  /** User role */
  role: UserRole;
  /** Whether auth state is loading */
  loading: boolean;
  /** Authentication error message */
  error: string | null;
}

/**
 * Authentication context actions
 */
export interface AuthContextActions {
  /** Sign in with email and password */
  signIn: (email: string, password: string, role: UserRole) => Promise<void>;
  /** Sign up a new user */
  signUp: (email: string, password: string, role: UserRole, profileData: any) => Promise<void>;
  /** Sign out the current user */
  signOut: () => Promise<void>;
  /** Refresh the user profile */
  refreshProfile: () => Promise<void>;
}

/**
 * Complete authentication context value
 */
export type AuthContextValue = AuthContextState & AuthContextActions;

/**
 * Authentication context
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * AuthProvider Props
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider Component
 * 
 * Provides authentication state and actions to the component tree.
 * Automatically loads the current user on mount.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Teacher | Student | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load user profile based on role
   */
  const loadProfile = useCallback(async (userId: string, userRole: UserRole) => {
    if (!userRole) {
      setProfile(null);
      return;
    }

    try {
      if (userRole === 'teacher') {
        const teacherProfile = await authService.getTeacherProfile(userId);
        if (teacherProfile) {
          setProfile(transformTeacher(teacherProfile));
          setRole('teacher');
        }
      } else if (userRole === 'student') {
        const studentProfile = await authService.getStudentProfile(userId);
        if (studentProfile) {
          setProfile(transformStudent(studentProfile));
          setRole('student');
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      // Don't set error here, profile loading is optional
    }
  }, []);

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const currentUser = await authService.getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser);
          
          // Try to load teacher profile first, then student
          const teacherProfile = await authService.getTeacherProfile(currentUser.id);
          if (teacherProfile) {
            setProfile(transformTeacher(teacherProfile));
            setRole('teacher');
          } else {
            const studentProfile = await authService.getStudentProfile(currentUser.id);
            if (studentProfile) {
              setProfile(transformStudent(studentProfile));
              setRole('student');
            }
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        // Don't set error for initialization failures
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Sign in with email and password
   */
  const signIn = useCallback(async (email: string, password: string, userRole: UserRole) => {
    try {
      setLoading(true);
      setError(null);

      // Check if we're in development mode without backend
      const isDevelopmentMode = !process.env.EXPO_PUBLIC_SUPABASE_URL || 
                                process.env.EXPO_PUBLIC_SUPABASE_URL === 'your-project-url.supabase.co';

      if (isDevelopmentMode) {
        // Mock login for development
        console.log('🔧 Development mode: Using mock authentication');
        
        const mockUser: User = {
          id: 'mock-user-id-' + userRole,
          email: email,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as User;

        setUser(mockUser);

        // Create mock profile
        if (userRole === 'teacher') {
          const mockTeacher: Teacher = {
            id: mockUser.id,
            email: email,
            fullName: 'Mock Teacher',
            school: 'Development School',
            verified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setProfile(mockTeacher);
          setRole('teacher');
        } else if (userRole === 'student') {
          const mockStudent: Student = {
            id: mockUser.id,
            email: email,
            fullName: 'Mock Student',
            grade: '10th Grade',
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setProfile(mockStudent);
          setRole('student');
        }

        setLoading(false);
        return;
      }

      // Real authentication
      const authenticatedUser = await authService.signIn(email, password);
      setUser(authenticatedUser);

      // Load profile based on role
      await loadProfile(authenticatedUser.id, userRole);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadProfile]);

  /**
   * Sign up a new user
   */
  const signUp = useCallback(async (
    email: string,
    password: string,
    userRole: UserRole,
    profileData: any
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Create auth user
      const newUser = await authService.signUp(email, password);
      setUser(newUser);

      // Create profile based on role
      if (userRole === 'teacher') {
        const teacherData: TeacherInsert = {
          id: newUser.id,
          email: newUser.email!,
          full_name: profileData.fullName,
          school: profileData.school,
          verified: false,
        };
        const teacherProfile = await authService.createTeacherProfile(newUser.id, teacherData);
        setProfile(transformTeacher(teacherProfile));
        setRole('teacher');
      } else if (userRole === 'student') {
        const studentData: StudentInsert = {
          id: newUser.id,
          email: newUser.email!,
          full_name: profileData.fullName,
          grade: profileData.grade,
        };
        const studentProfile = await authService.createStudentProfile(newUser.id, studentData);
        setProfile(transformStudent(studentProfile));
        setRole('student');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign up';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Sign out the current user
   */
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await authService.signOut();
      
      setUser(null);
      setProfile(null);
      setRole(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh the user profile
   */
  const refreshProfile = useCallback(async () => {
    if (!user || !role) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await loadProfile(user.id, role);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh profile';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, role, loadProfile]);

  const value: AuthContextValue = {
    user,
    profile,
    role,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access authentication context
 * 
 * Must be used within an AuthProvider component.
 * Throws an error if used outside the provider.
 * 
 * @returns Authentication context value
 * @throws {Error} If used outside AuthProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, signIn, loading } = useAuth();
 *   
 *   if (loading) return <LoadingSpinner />;
 *   if (!user) return <LoginPrompt />;
 *   
 *   return <Dashboard user={user} />;
 * }
 * ```
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Wrap your component tree with <AuthProvider>.'
    );
  }

  return context;
}
