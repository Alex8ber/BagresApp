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

/**
 * Join a class with a class code
 * Creates a student record and returns the class information
 * 
 * @param fullName - Student's full name
 * @param classCode - The 6-digit class code
 * @returns The created student and class information
 * @throws {AuthenticationError} If class code is invalid
 * @throws {DatabaseError} If database operation fails
 * @throws {NetworkError} If network request fails
 */
export async function joinClassWithCode(
  fullName: string,
  classCode: string
): Promise<{ student: Student; classId: string; className: string }> {
  try {
    // First, find the class by code
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('id, name')
      .eq('class_code', classCode.toUpperCase())
      .single();

    if (classError || !classData) {
      const error = new Error('Código de clase inválido. Verifica con tu profesor.');
      error.name = 'AuthenticationError';
      throw error;
    }

    // Create the student record
    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert({
        class_id: classData.id,
        full_name: fullName.trim(),
      } as any)
      .select()
      .single();

    if (studentError) {
      throw new DatabaseError(studentError.message);
    }

    if (!student) {
      throw new DatabaseError('No se pudo crear el estudiante');
    }

    return {
      student,
      classId: classData.id,
      className: classData.name,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthenticationError') {
      throw error;
    }
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Error al unirse a la clase');
  }
}

/**
 * Get a student by ID
 * 
 * @param studentId - The student ID
 * @returns The student or null if not found
 * @throws {DatabaseError} If database operation fails
 * @throws {NetworkError} If network request fails
 */
export async function getStudentById(studentId: string): Promise<Student | null> {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new DatabaseError(error.message);
    }

    return data;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch student');
  }
}
