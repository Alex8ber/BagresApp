/**
 * Type Definitions Index
 * 
 * Central export point for all TypeScript type definitions.
 * Import types from this file for consistency across the app.
 */

// Navigation types
export * from './navigation';

// Database types (raw Supabase types with snake_case)
export type {
  Teacher as DbTeacher,
  TeacherInsert,
  TeacherUpdate,
  Student as DbStudent,
  StudentInsert,
  StudentUpdate,
  Class as DbClass,
  ClassInsert,
  ClassUpdate,
  Database,
  TypedSupabaseClient,
} from './database';

// Form types
export * from './forms';

// Domain model types (application types with camelCase)
export type {
  BaseUser,
  Teacher,
  Student,
  Class,
  ClassWithTeacher,
  ClassWithStudents,
  Test,
  TestSubmission,
} from './models';

// Error types
export {
  AppError,
  ValidationError,
  AuthenticationError,
  NetworkError,
  DatabaseError,
} from './errors';
