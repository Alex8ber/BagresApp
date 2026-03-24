/**
 * Utilities Barrel Export
 * 
 * Central export point for all utility modules.
 * Import utilities from this file for cleaner imports.
 * 
 * Requirements: 8.6, 9.13
 * 
 * @example
 * ```tsx
 * import { validateEmail, formatDate, isTeacher } from '@/utils';
 * ```
 */

// Validation utilities
export {
  emailRegex,
  passwordMinLength,
  validateEmail,
  validatePassword,
  validateRequired,
  validateConfirmPassword,
  isNonEmptyString,
  isValidEmail,
} from './validation';

// Formatting utilities
export {
  formatDate,
  formatRelativeTime,
  formatNumber,
  formatPercentage,
  truncateText,
  capitalize,
  toTitleCase,
  formatFileSize,
} from './formatting';

// Type guards
export {
  isDefined,
  isString,
  isNumber,
  isBoolean,
  isArray,
  isObject,
  isDate,
  isTeacher,
  isStudent,
  isClass,
  isSupabaseUser,
  isError,
  isNonEmptyArray,
} from './guards';

// Data transformers
export {
  transformTeacher,
  transformStudent,
  transformClass,
} from './transformers';
