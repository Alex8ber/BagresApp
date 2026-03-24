/**
 * TeacherContext
 * 
 * Provides teacher-specific state and actions throughout the application.
 * Manages classes data and operations for authenticated teachers.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9
 * 
 * @example
 * ```tsx
 * // Wrap your teacher dashboard with TeacherProvider
 * function TeacherDashboard() {
 *   return (
 *     <TeacherProvider>
 *       <TeacherMainScreen />
 *     </TeacherProvider>
 *   );
 * }
 * 
 * // Use the hook in any component
 * function ClassesList() {
 *   const { classes, loading, addClass } = useTeacher();
 *   
 *   return (
 *     <View>
 *       {classes.map(cls => <ClassCard key={cls.id} class={cls} />)}
 *     </View>
 *   );
 * }
 * ```
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Class } from '@/types/database';
import * as classesService from '@/services/supabase/classes';
import { useAuth } from './AuthContext';

/**
 * Teacher context state
 */
export interface TeacherContextState {
  /** List of classes belonging to the teacher */
  classes: Class[];
  /** Whether classes are being loaded */
  loading: boolean;
  /** Error message if any operation fails */
  error: string | null;
}

/**
 * Teacher context actions
 */
export interface TeacherContextActions {
  /** Add a new class to the state */
  addClass: (newClass: Class) => void;
  /** Update an existing class in the state */
  updateClass: (classId: string, updates: Partial<Class>) => void;
  /** Delete a class from the state */
  deleteClass: (classId: string) => void;
  /** Refresh classes from the server */
  refreshClasses: () => Promise<void>;
}

/**
 * Complete teacher context value
 */
export type TeacherContextValue = TeacherContextState & TeacherContextActions;

/**
 * Teacher context
 */
const TeacherContext = createContext<TeacherContextValue | undefined>(undefined);

/**
 * TeacherProvider Props
 */
interface TeacherProviderProps {
  children: React.ReactNode;
}

/**
 * TeacherProvider Component
 * 
 * Provides teacher-specific state and actions to the component tree.
 * Automatically loads classes when a teacher is authenticated.
 */
export function TeacherProvider({ children }: TeacherProviderProps) {
  const { user, role } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load classes for the authenticated teacher
   */
  const loadClasses = useCallback(async (teacherId: string) => {
    try {
      setLoading(true);
      setError(null);

      const fetchedClasses = await classesService.getClasses(teacherId);
      setClasses(fetchedClasses);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load classes';
      setError(errorMessage);
      console.error('Failed to load classes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load classes when user changes
   */
  useEffect(() => {
    if (user && role === 'teacher') {
      loadClasses(user.id);
    } else {
      // Clear classes if not a teacher or not authenticated
      setClasses([]);
    }
  }, [user, role, loadClasses]);

  /**
   * Add a new class to the state
   */
  const addClass = useCallback((newClass: Class) => {
    setClasses((prevClasses) => [newClass, ...prevClasses]);
  }, []);

  /**
   * Update an existing class in the state
   */
  const updateClass = useCallback((classId: string, updates: Partial<Class>) => {
    setClasses((prevClasses) =>
      prevClasses.map((cls) =>
        cls.id === classId ? { ...cls, ...updates } : cls
      )
    );
  }, []);

  /**
   * Delete a class from the state
   */
  const deleteClass = useCallback((classId: string) => {
    setClasses((prevClasses) => prevClasses.filter((cls) => cls.id !== classId));
  }, []);

  /**
   * Refresh classes from the server
   */
  const refreshClasses = useCallback(async () => {
    if (!user || role !== 'teacher') {
      return;
    }

    await loadClasses(user.id);
  }, [user, role, loadClasses]);

  const value: TeacherContextValue = {
    classes,
    loading,
    error,
    addClass,
    updateClass,
    deleteClass,
    refreshClasses,
  };

  return <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>;
}

/**
 * Hook to access teacher context
 * 
 * Must be used within a TeacherProvider component.
 * Throws an error if used outside the provider.
 * 
 * @returns Teacher context value
 * @throws {Error} If used outside TeacherProvider
 * 
 * @example
 * ```tsx
 * function ClassesList() {
 *   const { classes, loading, error, refreshClasses } = useTeacher();
 *   
 *   if (loading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage message={error} />;
 *   
 *   return (
 *     <View>
 *       {classes.map(cls => <ClassCard key={cls.id} class={cls} />)}
 *       <Button onPress={refreshClasses}>Refresh</Button>
 *     </View>
 *   );
 * }
 * ```
 */
export function useTeacher(): TeacherContextValue {
  const context = useContext(TeacherContext);

  if (context === undefined) {
    throw new Error(
      'useTeacher must be used within a TeacherProvider. ' +
      'Wrap your component tree with <TeacherProvider>.'
    );
  }

  return context;
}
