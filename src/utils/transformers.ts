/**
 * Data Transformers
 * 
 * Functions to transform database types (snake_case, string timestamps)
 * to domain models (camelCase, Date objects) and vice versa.
 * 
 * These transformers bridge the gap between the database layer and
 * the application layer, providing a clean separation of concerns.
 */

import type {
  Teacher as DbTeacher,
  Student as DbStudent,
  Class as DbClass,
} from '@/types/database';
import type {
  Teacher,
  Student,
  Class,
} from '@/types/models';

/**
 * Transform database teacher to domain model
 * 
 * Converts snake_case fields to camelCase and string timestamps to Date objects.
 * 
 * @param dbTeacher - Teacher record from database
 * @returns Domain model teacher
 * 
 * @example
 * ```tsx
 * const dbTeacher = await supabase.from('teachers').select('*').single();
 * const teacher = transformTeacher(dbTeacher.data);
 * // teacher.fullName instead of teacher.full_name
 * // teacher.createdAt is a Date object
 * ```
 */
export function transformTeacher(dbTeacher: DbTeacher): Teacher {
  return {
    id: dbTeacher.id,
    email: dbTeacher.email,
    fullName: dbTeacher.full_name,
    school: dbTeacher.school,
    verified: dbTeacher.verified,
    subjects: [], // Load from relationship if needed
    createdAt: new Date(dbTeacher.created_at),
    updatedAt: new Date(dbTeacher.updated_at),
  };
}

/**
 * Transform database student to domain model
 * 
 * Converts snake_case fields to camelCase and string timestamps to Date objects.
 * 
 * @param dbStudent - Student record from database
 * @returns Domain model student
 * 
 * @example
 * ```tsx
 * const dbStudent = await supabase.from('students').select('*').single();
 * const student = transformStudent(dbStudent.data);
 * // student.fullName instead of student.full_name
 * // student.createdAt is a Date object
 * ```
 */
export function transformStudent(dbStudent: DbStudent): Student {
  return {
    id: dbStudent.id,
    email: dbStudent.email,
    fullName: dbStudent.full_name,
    grade: dbStudent.grade,
    enrolledClasses: [], // Load from relationship if needed
    createdAt: new Date(dbStudent.created_at),
    updatedAt: new Date(dbStudent.updated_at),
  };
}

/**
 * Transform database class to domain model
 * 
 * Converts snake_case fields to camelCase and string timestamps to Date objects.
 * 
 * @param dbClass - Class record from database
 * @returns Domain model class
 * 
 * @example
 * ```tsx
 * const dbClass = await supabase.from('classes').select('*').single();
 * const classModel = transformClass(dbClass.data);
 * // classModel.teacherId instead of dbClass.teacher_id
 * // classModel.createdAt is a Date object
 * ```
 */
export function transformClass(dbClass: DbClass): Class {
  return {
    id: dbClass.id,
    teacherId: dbClass.teacher_id,
    name: dbClass.name,
    subject: dbClass.subject,
    grade: dbClass.grade,
    description: dbClass.description,
    studentCount: 0, // Calculate from relationship if needed
    createdAt: new Date(dbClass.created_at),
    updatedAt: new Date(dbClass.updated_at),
  };
}
