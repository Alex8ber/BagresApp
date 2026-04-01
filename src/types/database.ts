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
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Teacher Insert Type
 * 
 * Type for inserting a new teacher record.
 * ID is optional since it can be auto-generated or manually set.
 * avatar_url is optional since it can be added later.
 */
export type TeacherInsert = Omit<Teacher, 'created_at' | 'updated_at' | 'avatar_url'> & {
  id?: string;
  avatar_url?: string | null;
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
 * Students don't have auth accounts - they join classes with name + class code.
 */
export interface Student {
  id: string;
  class_id: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

/**
 * Student Insert Type
 * 
 * Type for inserting a new student record.
 * ID is optional since it can be auto-generated.
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
  class_code: string;
  class_image_url: string | null;
  class_icon: string;
  created_at: string;
  updated_at: string;
}

/**
 * Class Insert Type
 * 
 * Type for inserting a new class record.
 * ID is optional since it can be auto-generated.
 */
export type ClassInsert = Omit<Class, 'id' | 'created_at' | 'updated_at'> & {
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
      class_materials: {
        Row: ClassMaterial;
        Insert: ClassMaterialInsert;
        Update: ClassMaterialUpdate;
      };
      quizzes: {
        Row: Quiz;
        Insert: QuizInsert;
        Update: QuizUpdate;
      };
      quiz_questions: {
        Row: QuizQuestion;
        Insert: QuizQuestionInsert;
        Update: QuizQuestionUpdate;
      };
      quiz_options: {
        Row: QuizOption;
        Insert: QuizOptionInsert;
        Update: Partial<QuizOption>;
      };
    };
  };
}

/**
 * Class Material Entity
 * 
 * Represents educational materials for classes.
 */
export interface ClassMaterial {
  id: string;
  class_id: string;
  title: string;
  description: string | null;
  material_type: 'pdf' | 'video' | 'document' | 'link' | 'image';
  file_url: string | null;
  available_from: string | null;
  available_until: string | null;
  created_at: string;
  updated_at: string;
}

export type ClassMaterialInsert = Omit<ClassMaterial, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type ClassMaterialUpdate = Partial<Omit<ClassMaterial, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Quiz Entity
 * 
 * Represents quizzes/tests for classes.
 */
export interface Quiz {
  id: string;
  class_id: string;
  title: string;
  description: string | null;
  duration_minutes: number | null;
  passing_score: number;
  available_from: string | null;
  available_until: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type QuizInsert = Omit<Quiz, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type QuizUpdate = Partial<Omit<Quiz, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Quiz Question Entity
 * 
 * Represents questions in quizzes.
 */
export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: 'single_choice' | 'multiple_choice' | 'open_ended';
  points: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type QuizQuestionInsert = Omit<QuizQuestion, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type QuizQuestionUpdate = Partial<Omit<QuizQuestion, 'id' | 'created_at' | 'updated_at'>>;

/**
 * Quiz Option Entity
 * 
 * Represents answer options for quiz questions.
 */
export interface QuizOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  order_index: number;
  created_at: string;
}

export type QuizOptionInsert = Omit<QuizOption, 'id' | 'created_at'> & {
  id?: string;
};

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
