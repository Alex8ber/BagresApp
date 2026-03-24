/**
 * Hooks Barrel Export
 * 
 * Central export point for all custom hooks.
 * Import hooks from this file for cleaner imports.
 * 
 * Requirements: 9.13
 * 
 * @example
 * ```tsx
 * import { useAuth, useForm, useTeacherClasses } from '@/hooks';
 * ```
 */

// Form management hook
export { useForm } from './useForm';
export type { UseFormOptions, UseFormReturn } from './useForm';

// Authentication hook
export { useAuth } from './useAuth';
export type { UserRole, AuthContextState, AuthContextActions, AuthContextValue } from './useAuth';

// Teacher classes hook
export { useTeacherClasses } from './useTeacherClasses';
export type { UseTeacherClassesReturn } from './useTeacherClasses';
