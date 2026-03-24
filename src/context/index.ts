/**
 * Context Barrel Export
 * 
 * Centralized export for all context providers and hooks.
 * 
 * Requirements: 9.13
 * 
 * @example
 * ```tsx
 * import { AuthProvider, useAuth, TeacherProvider, useTeacher } from '@/context';
 * ```
 */

export {
  AuthProvider,
  useAuth,
  type AuthContextState,
  type AuthContextActions,
  type AuthContextValue,
  type UserRole,
} from './AuthContext';

export {
  TeacherProvider,
  useTeacher,
  type TeacherContextState,
  type TeacherContextActions,
  type TeacherContextValue,
} from './TeacherContext';
