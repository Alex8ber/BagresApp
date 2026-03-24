/**
 * Services Barrel Export
 * 
 * Central export point for all service modules.
 * Import services from this file for cleaner imports.
 * 
 * @example
 * ```tsx
 * import { supabase, signIn, getClasses } from '@/services';
 * ```
 */

// Supabase client
export { supabase } from './supabase/client';

// Authentication services
export {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  createTeacherProfile,
  createStudentProfile,
  getTeacherProfile,
  getStudentProfile,
} from './supabase/auth';

// Classes services
export {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  getClassStudents,
  addStudentToClass,
} from './supabase/classes';

// Students services
export {
  getStudents,
  getStudentsByClass,
  updateStudent,
} from './supabase/students';
