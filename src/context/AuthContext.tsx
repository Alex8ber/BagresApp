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
import type { Teacher, Student, Admin } from '@/types/models';
import type { TeacherInsert, StudentInsert } from '@/types/database';
import * as authService from '@/services/supabase/auth';
import { transformTeacher, transformStudent, transformAdmin } from '@/utils/transformers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STUDENT_PROFILE_KEY = '@bagres_student_session';

/**
 * User role type
 */
export type UserRole = 'teacher' | 'student' | 'admin' | null;

/**
 * Authentication context state
 */
export interface AuthContextState {
  /** Currently authenticated user */
  user: User | null;
  /** User profile (Teacher, Student, or Admin) */
  profile: Teacher | Student | Admin | null;
  /** User role */
  role: UserRole;
  /** Whether auth state is loading (initial load or during operations) */
  loading: boolean;
  /** Authentication error message */
  error: string | null;
}

/**
 * Authentication context actions
 */
export interface AuthContextActions {
  /** Sign in with email and password (teachers) or join class with code (students) */
  signIn: (emailOrName: string, passwordOrCode: string, role: UserRole) => Promise<void>;
  /** Sign up a new user */
  signUp: (email: string, password: string, role: UserRole, profileData: any) => Promise<void>;
  /** Sign out the current user */
  signOut: () => Promise<void>;
  /** Refresh the user profile */
  refreshProfile: () => Promise<void>;
  /** Temporarily bypass admin login */
  mockSignInAdmin: () => void;
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
  const [profile, setProfile] = useState<Teacher | Student | Admin | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initializing, setInitializing] = useState<boolean>(true);
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
      } else if (userRole === 'admin') {
        const adminProfile = await authService.getAdminProfile(userId);
        if (adminProfile) {
          setProfile(transformAdmin(adminProfile));
          setRole('admin');
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

        // 1. Check for persisted student session
        const savedStudentStr = await AsyncStorage.getItem(STUDENT_PROFILE_KEY);
        if (savedStudentStr) {
          try {
            const savedStudent = JSON.parse(savedStudentStr);
            setProfile(savedStudent);
            setRole('student');
            setUser(null);
            
            // Background refresh
            authService.getStudentProfile(savedStudent.id).then(freshProfile => {
              if (freshProfile) {
                const transformed = transformStudent(freshProfile);
                setProfile(transformed);
                AsyncStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(transformed)).catch(console.error);
              }
            }).catch(console.error);
            
            return;
          } catch (e) {
            console.error('Failed to parse saved student session:', e);
            await AsyncStorage.removeItem(STUDENT_PROFILE_KEY);
          }
        }

        // 2. Check for teacher/admin session (Supabase Auth)
        const currentUser = await authService.getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser);
          
          // Check if user is an admin first
          const adminProfile = await authService.getAdminProfile(currentUser.id);
          if (adminProfile) {
            setProfile(transformAdmin(adminProfile));
            setRole('admin');
          } else {
            // Check if teacher
            const teacherProfile = await authService.getTeacherProfile(currentUser.id);
            if (teacherProfile) {
              setProfile(transformTeacher(teacherProfile));
              setRole('teacher');
            }
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        // Clear any partial state on error
        setUser(null);
        setProfile(null);
        setRole(null);
        // Don't set error for initialization failures - just log it
      } finally {
        setLoading(false);
        setInitializing(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Sign in with email and password (teachers) or join class with code (students)
   */
  const signIn = useCallback(async (emailOrName: string, passwordOrCode: string, userRole: UserRole) => {
    try {
      setLoading(true); // Internal loading state for button
      setError(null);

      // Real authentication - different flow for students vs teachers
      if (userRole === 'student') {
        // Students join a class with name + class code (NO auth account needed)
        const { student } = await authService.joinClassWithCode(
          emailOrName, // This is the student's full name
          passwordOrCode // This is the class code
        );

        // Students don't have a User object (no auth account)
        // We store their profile directly and use a mock user object for navigation
        setUser(null); // Students don't have auth accounts
        const transformedStudent = transformStudent(student);
        setProfile(transformedStudent);
        setRole('student');
        await AsyncStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(transformedStudent));
      } else {
        // Teachers use email/password authentication
        const authenticatedUser = await authService.signIn(emailOrName, passwordOrCode);
        setUser(authenticatedUser);

        // Load profile based on role
        await loadProfile(authenticatedUser.id, userRole);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      
      // Don't modify user/profile/role state on error - keep them as null
      // This prevents unwanted navigation
      
      // Re-throw the error so the calling component can handle it
      throw err;
    } finally {
      setLoading(false); // Only affects button loading, not navigator
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
          class_id: profileData.classId, // Will be set when joining a class
          full_name: profileData.fullName,
        };
        const studentProfile = await authService.createStudentProfile(newUser.id, studentData);
        const transformedStudent = transformStudent(studentProfile);
        setProfile(transformedStudent);
        setRole('student');
        await AsyncStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(transformedStudent));
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

      // Clear state first to trigger navigation immediately
      const currentRole = role;
      
      setUser(null);
      setProfile(null);
      setRole(null);
      
      // Only call Supabase signOut for teachers and admins (students don't have auth sessions)
      if (currentRole === 'teacher' || currentRole === 'admin') {
        await authService.signOut();
      } else if (currentRole === 'student') {
        await AsyncStorage.removeItem(STUDENT_PROFILE_KEY);
      }
    } catch (err) {
      console.error('Sign out error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
      // Even if signOut fails, keep state cleared
    } finally {
      setLoading(false);
    }
  }, [role]);

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

  const mockSignInAdmin = useCallback(() => {
    setRole('admin');
    setProfile({
      id: 'mock-admin-id',
      email: 'admin@bagres.app',
      fullName: 'Super Admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }, []);

  const value: AuthContextValue = {
    user,
    profile,
    role,
    loading: initializing || loading, // Combine both loading states
    error,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    mockSignInAdmin,
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
