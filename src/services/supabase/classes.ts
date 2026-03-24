import { supabase } from './client';
import type {
  Class,
  ClassInsert,
  ClassUpdate,
  Student,
} from '@/types/database';
import { DatabaseError, NetworkError } from '@/types/errors';

/**
 * Get all classes for a specific teacher
 * 
 * @param teacherId - The teacher's user ID
 * @returns Array of classes belonging to the teacher
 * @throws {DatabaseError} If database operation fails
 * @throws {NetworkError} If network request fails
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
 * 
 * @param classData - The class data to insert
 * @returns The created class
 * @throws {DatabaseError} If database operation fails
 * @throws {NetworkError} If network request fails
 */
export async function createClass(classData: ClassInsert): Promise<Class> {
  try {
    // Type assertion needed due to Supabase TypeScript limitations
    const { data, error } = await supabase
      .from('classes')
      .insert(classData as any)
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
 * Update an existing class
 * 
 * @param classId - The class ID to update
 * @param updates - Partial class data to update
 * @returns The updated class
 * @throws {DatabaseError} If database operation fails
 * @throws {NetworkError} If network request fails
 */
export async function updateClass(
  classId: string,
  updates: ClassUpdate
): Promise<Class> {
  try {
    const { data, error } = await supabase
      .from('classes')
      // @ts-expect-error - Supabase TypeScript limitations with update types
      .update(updates as any)
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
 * 
 * @param classId - The class ID to delete
 * @throws {DatabaseError} If database operation fails
 * @throws {NetworkError} If network request fails
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
 * Get all students enrolled in a specific class
 * 
 * Note: This assumes a class_students junction table exists.
 * Adjust the query based on your actual database schema.
 * 
 * @param classId - The class ID
 * @returns Array of students enrolled in the class
 * @throws {DatabaseError} If database operation fails
 * @throws {NetworkError} If network request fails
 */
export async function getClassStudents(classId: string): Promise<Student[]> {
  try {
    // This query assumes a class_students junction table
    // Adjust based on your actual schema
    const { data, error } = await supabase
      .from('class_students')
      .select('student_id, students(*)')
      .eq('class_id', classId);

    if (error) {
      throw new DatabaseError(error.message);
    }

    // Extract student objects from the join result
    const students = data?.map((item: any) => item.students).filter(Boolean) || [];
    return students;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch class students');
  }
}

/**
 * Add a student to a class
 * 
 * Note: This assumes a class_students junction table exists.
 * Adjust based on your actual database schema.
 * 
 * @param classId - The class ID
 * @param studentId - The student ID to add
 * @throws {DatabaseError} If database operation fails
 * @throws {NetworkError} If network request fails
 */
export async function addStudentToClass(
  classId: string,
  studentId: string
): Promise<void> {
  try {
    // This assumes a class_students junction table
    // Adjust based on your actual schema
    // Type assertion needed due to Supabase TypeScript limitations
    const { error } = await supabase
      .from('class_students')
      .insert({
        class_id: classId,
        student_id: studentId,
      } as any);

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
