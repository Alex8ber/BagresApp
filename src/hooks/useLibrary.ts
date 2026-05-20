import { useState, useEffect, useCallback } from 'react';
import type { ClassMaterial, Quiz } from '@/types/database';
import { getTeacherMaterials, getTeacherQuizzes } from '@/services';

interface UseLibraryReturn {
  materials: ClassMaterial[];
  quizzes: Quiz[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch teacher's library (materials and quizzes)
 * 
 * @param teacherId - The teacher's user ID
 * @returns Library data with loading and error states
 */
export function useLibrary(teacherId: string | undefined): UseLibraryReturn {
  const [materials, setMaterials] = useState<ClassMaterial[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLibrary = useCallback(async () => {
    if (!teacherId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [materialsData, quizzesData] = await Promise.all([
        getTeacherMaterials(teacherId),
        getTeacherQuizzes(teacherId),
      ]);

      setMaterials(materialsData);
      setQuizzes(quizzesData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch library'));
      console.error('Error fetching library:', err);
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  return {
    materials,
    quizzes,
    loading,
    error,
    refetch: fetchLibrary,
  };
}
