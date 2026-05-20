/**
 * Classes Services
 * 
 * Services for class-related operations including student counts and material counts
 */

import { supabase } from './client';
import { DatabaseError, NetworkError } from '@/types/errors';
import type { Class } from '@/types/database';

/**
 * Get all classes for a teacher
 */
export async function getClasses(teacherId: string): Promise<Class[]> {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new DatabaseError(error.message);
    }

    return data || [];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch classes');
  }
}

/**
 * Create a new class
 */
export async function createClass(classData: any): Promise<Class> {
  try {
    const { data, error } = await supabase
      .from('classes')
      .insert(classData)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(error.message);
    }

    if (!data) {
      throw new DatabaseError('No class data returned');
    }

    return data;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to create class');
  }
}

/**
 * Update a class
 */
export async function updateClass(classId: string, updates: any): Promise<Class> {
  try {
    const { data, error } = await supabase
      .from('classes')
      .update(updates)
      .eq('id', classId)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(error.message);
    }

    if (!data) {
      throw new DatabaseError('No class data returned');
    }

    return data;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to update class');
  }
}

/**
 * Delete a class
 */
export async function deleteClass(classId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', classId);

    if (error) {
      throw new DatabaseError(error.message);
    }
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to delete class');
  }
}

/**
 * Add student to class
 */
export async function addStudentToClass(classId: string, studentId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('class_students')
      .insert({
        class_id: classId,
        student_id: studentId,
      });

    if (error) {
      throw new DatabaseError(error.message);
    }
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to add student to class');
  }
}

/**
 * Get student count for a class
 */
export async function getClassStudentCount(classId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('class_students')
      .select('*', { count: 'exact', head: true })
      .eq('class_id', classId);

    if (error) {
      throw new DatabaseError(error.message);
    }

    return count || 0;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch student count');
  }
}

/**
 * Get material count for a class
 */
export async function getClassMaterialCount(classId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('class_materials')
      .select('*', { count: 'exact', head: true })
      .eq('class_id', classId);

    if (error) {
      // If table doesn't exist or other error, return 0
      console.warn('Materials table error:', error.message);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.warn('Failed to fetch material count:', error);
    return 0;
  }
}

/**
 * Get quiz count for a class
 */
export async function getClassQuizCount(classId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('quizzes')
      .select('*', { count: 'exact', head: true })
      .eq('class_id', classId);

    if (error) {
      // If table doesn't exist or other error, return 0
      console.warn('Quizzes table error:', error.message);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.warn('Failed to fetch quiz count:', error);
    return 0;
  }
}

/**
 * Get all stats for a class (students, materials, quizzes)
 */
export async function getClassStats(classId: string) {
  try {
    // Run all queries in parallel, but handle each error independently
    const [studentCount, materialCount, quizCount] = await Promise.allSettled([
      getClassStudentCount(classId),
      getClassMaterialCount(classId),
      getClassQuizCount(classId),
    ]);

    return {
      students: studentCount.status === 'fulfilled' ? studentCount.value : 0,
      materials: materialCount.status === 'fulfilled' ? materialCount.value : 0,
      quizzes: quizCount.status === 'fulfilled' ? quizCount.value : 0,
    };
  } catch (error) {
    console.error('Error fetching class stats:', error);
    return {
      students: 0,
      materials: 0,
      quizzes: 0,
    };
  }
}

/**
 * Get students in a class with their details
 */
export async function getClassStudents(classId: string) {
  try {
    const { data, error } = await supabase
      .from('class_students')
      .select(`
        student_id,
        enrolled_at,
        students (
          id,
          full_name
        )
      `)
      .eq('class_id', classId)
      .order('enrolled_at', { ascending: false });

    if (error) {
      throw new DatabaseError(error.message);
    }

    return data || [];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch class students');
  }
}
