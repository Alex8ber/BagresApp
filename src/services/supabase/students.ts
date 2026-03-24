import { supabase } from './client';
import type { Student, StudentUpdate } from '@/types/database';
import { DatabaseError, NetworkError } from '@/types/errors';

/**
 * Get all students
 * 
 * @returns Array of all students
 * @throws {DatabaseError} If database operation fails
 * @throws {NetworkError} If network request fails
 */
export async function getStudents(): Promise<Student[]> {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) {
      throw new DatabaseError(error.message);
    }

    return data || [];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch students');
  }
}

/**
 * Get all students enrolled in a specific class
 * 
 * Note: This assumes a class_students junction table exists.
 * Adjust the query based on your actual database schema.
 * 
 * @param classId - The class ID
 * @returns Array of students in the class
 * @throws {DatabaseError} If database operation fails
 * @throws {NetworkError} If network request fails
 */
export async function getStudentsByClass(classId: string): Promise<Student[]> {
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
    throw new NetworkError('Failed to fetch students by class');
  }
}

/**
 * Update a student's information
 * 
 * @param studentId - The student ID to update
 * @param updates - Partial student data to update
 * @returns The updated student
 * @throws {DatabaseError} If database operation fails
 * @throws {NetworkError} If network request fails
 */
export async function updateStudent(
  studentId: string,
  updates: StudentUpdate
): Promise<Student> {
  try {
    const { data, error } = await supabase
      .from('students')
      // @ts-expect-error - Supabase TypeScript limitations with update types
      .update(updates as any)
      .eq('id', studentId)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(error.message);
    }

    if (!data) {
      throw new DatabaseError('No student data returned');
    }

    return data;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to update student');
  }
}
