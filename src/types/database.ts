import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Teacher Entity
 * 
 * Represents a teacher user in the system.
 */
export interface Teacher {
  id: string;
  email: string;
  full_name: string;
  school: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Teacher Insert Type
 * 
 * Type for inserting a new teacher record.
 * ID is optional since it can be auto-generated or manually set.
 */
export type TeacherInsert = Omit<Teacher, 'created_at' | 'updated_at'> & {
  id?: string;
};

/**
 * Teacher Update Type
 * 
 * Type for updating an existing teacher record.
 * All fields are optional for partial updates.
 */
export type TeacherUpdate = Partial<Omit<Teacher, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Student Entity
 * 
 * Represents a student user in the system.
 */
export interface Student {
  id: string;
  email: string;
  full_name: string;
  grade: string;
  created_at: string;
  updated_at: string;
}

/**
 * Student Insert Type
 * 
 * Type for inserting a new student record.
 * ID is optional since it can be auto-generated or manually set.
 */
export type StudentInsert = Omit<Student, 'created_at' | 'updated_at'> & {
  id?: string;
};

/**
 * Student Update Type
 * 
 * Type for updating an existing student record.
 * All fields are optional for partial updates.
 */
export type StudentUpdate = Partial<Omit<Student, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Class Entity
 * 
 * Represents a class/course in the system.
 */
export interface Class {
  id: string;
  teacher_id: string;
  name: string;
  subject: string;
  grade: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Class Insert Type
 * 
 * Type for inserting a new class record.
 * ID is optional since it can be auto-generated.
 */
export type ClassInsert = Omit<Class, 'created_at' | 'updated_at'> & {
  id?: string;
};

/**
 * Class Update Type
 * 
 * Type for updating an existing class record.
 * All fields are optional for partial updates.
 */
export type ClassUpdate = Partial<Omit<Class, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Supabase Database Schema
 * 
 * Defines the complete database structure for type-safe Supabase operations.
 * This interface maps to the actual Supabase database schema.
 * 
 * @example
 * ```tsx
 * const { data, error } = await supabase
 *   .from('teachers')
 *   .select('*')
 *   .single();
 * // data is typed as Teacher
 * ```
 */
export interface Database {
  public: {
    Tables: {
      teachers: {
        Row: Teacher;
        Insert: TeacherInsert;
        Update: TeacherUpdate;
      };
      students: {
        Row: Student;
        Insert: StudentInsert;
        Update: StudentUpdate;
      };
      classes: {
        Row: Class;
        Insert: ClassInsert;
        Update: ClassUpdate;
      };
    };
  };
}

/**
 * Typed Supabase Client
 * 
 * A Supabase client instance with full TypeScript support for the database schema.
 * Use this type when passing the Supabase client as a parameter or storing it.
 * 
 * @example
 * ```tsx
 * const supabase: TypedSupabaseClient = createClient<Database>(url, key);
 * 
 * // All operations are now type-safe
 * const { data } = await supabase
 *   .from('teachers')
 *   .insert({ email: 'test@example.com', ... }); // Insert type is enforced
 * ```
 */
export type TypedSupabaseClient = SupabaseClient<Database>;
