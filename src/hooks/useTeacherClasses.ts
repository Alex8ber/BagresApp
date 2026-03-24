/**
 * useTeacherClasses Hook
 * 
 * Custom hook for managing teacher's classes with CRUD operations.
 * Handles loading states, errors, and integrates with Supabase classes service.
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.5, 4.6, 4.9, 4.10
 * 
 * @example
 * ```tsx
 * function TeacherClassesScreen() {
 *   const { classes, loading, error, createClass, deleteClass } = useTeacherClasses();
 *   
 *   if (loading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage message={error} />;
 *   
 *   return <ClassList classes={classes} onDelete={deleteClass} />;
 * }
 * ```
 */

import { useState, useEffect, useCallback } from 'react';
import type { Class, ClassInsert, ClassUpdate } from '@/types/database';
import {
  getClasses,
  createClass as createClassService,
  updateClass as updateClassService,
  deleteClass as deleteClassService,
} from '@/services';
import { useAuth } from './useAuth';

/**
 * Return type of the useTeacherClasses hook
 */
export interface UseTeacherClassesReturn {
  /** Array of classes belonging to the teacher */
  classes: Class[];
  /** Whether classes are being loaded */
  loading: boolean;
  /** Error message if operation failed */
  error: string | null;
  /** Refetch classes from the server */
  refetch: () => Promise<void>;
  /** Create a new class */
  createClass: (data: ClassInsert) => Promise<Class>;
  /** Update an existing class */
  updateClass: (classId: string, updates: ClassUpdate) => Promise<void>;
  /** Delete a class */
  deleteClass: (classId: string) => Promise<void>;
}

/**
 * Hook for managing teacher's classes
 * 
 * Provides CRUD operations for classes with automatic loading and error handling.
 * Fetches classes on mount and provides methods to create, update, and delete classes.
 * 
 * @returns Classes state and CRUD operations
 * 
 * @example
 * ```tsx
 * const { classes, loading, createClass } = useTeacherClasses();
 * 
 * const handleCreateClass = async () => {
 *   try {
 *     const newClass = await createClass({
 *       teacher_id: teacherId,
 *       name: 'Math 101',
 *       subject: 'Mathematics',
 *       grade: '10th',
 *       description: 'Advanced mathematics course',
 *     });
 *     console.log('Created:', newClass);
 *   } catch (err) {
 *     console.error('Failed to create class');
 *   }
 * };
 * ```
 */
export function useTeacherClasses(): UseTeacherClassesReturn {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch classes from the server
   */
  const fetchClasses = useCallback(async () => {
    if (!user) {
      setClasses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchedClasses = await getClasses(user.id);
      setClasses(fetchedClasses);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch classes';
      setError(errorMessage);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Refetch classes (public API)
   */
  const refetch = useCallback(async () => {
    await fetchClasses();
  }, [fetchClasses]);

  /**
   * Create a new class
   */
  const createClass = useCallback(async (data: ClassInsert): Promise<Class> => {
    setError(null);

    try {
      const newClass = await createClassService(data);
      setClasses((prev) => [newClass, ...prev]);
      return newClass;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create class';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Update an existing class
   */
  const updateClass = useCallback(async (classId: string, updates: ClassUpdate): Promise<void> => {
    setError(null);

    try {
      const updatedClass = await updateClassService(classId, updates);
      setClasses((prev) =>
        prev.map((cls) => (cls.id === classId ? updatedClass : cls))
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update class';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Delete a class
   */
  const deleteClass = useCallback(async (classId: string): Promise<void> => {
    setError(null);

    try {
      await deleteClassService(classId);
      setClasses((prev) => prev.filter((cls) => cls.id !== classId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete class';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Fetch classes on mount and when user changes
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return {
    classes,
    loading,
    error,
    refetch,
    createClass,
    updateClass,
    deleteClass,
  };
}
