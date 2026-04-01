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
  updateTeacherProfile,
} from './supabase/auth';

// Storage services
export {
  uploadAvatar,
  deleteAvatar,
  uploadClassImage,
  deleteClassImage,
  uploadMaterialFile,
  deleteMaterialFile,
} from './supabase/storage';

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
  joinClassWithCode,
  getStudentById,
} from './supabase/students';

// Materials services
export {
  getClassMaterials,
  getTeacherMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from './supabase/materials';

// Quizzes services
export {
  getClassQuizzes,
  getTeacherQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizQuestions,
  createQuestion,
  getQuestionOptions,
  createOption,
  updateOption,
  deleteOption,
  getQuizWithQuestions,
  updateQuestionOrder,
  deleteQuestion,
  updateQuestion,
} from './supabase/quizzes';

// Auto-submit services
export {
  submitQuiz,
  isQuizAvailable,
} from './autoSubmit';

// Export types
export type {
  QuestionWithOptions,
  QuizWithQuestions,
} from './supabase/quizzes';

export type {
  QuizSubmission,
} from './autoSubmit';
