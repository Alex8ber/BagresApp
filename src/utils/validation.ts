/**
 * Validation Utilities
 * 
 * Functions for validating form inputs and user data.
 * These utilities provide consistent validation across the application.
 * 
 * Requirements: 8.1, 8.2, 8.4, 8.10
 */

// Validation constants
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordMinLength = 8;

/**
 * Validate email format
 * 
 * @param email - Email address to validate
 * @returns Error message if invalid, undefined if valid
 * 
 * @example
 * ```tsx
 * const error = validateEmail('user@example.com');
 * if (error) {
 *   console.error(error); // undefined - valid email
 * }
 * ```
 */
export function validateEmail(email: string): string | undefined {
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  return undefined;
}

/**
 * Validate password strength
 * 
 * @param password - Password to validate
 * @returns Error message if invalid, undefined if valid
 * 
 * @example
 * ```tsx
 * const error = validatePassword('short');
 * if (error) {
 *   console.error(error); // "Password must be at least 8 characters"
 * }
 * ```
 */
export function validatePassword(password: string): string | undefined {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < passwordMinLength) {
    return `Password must be at least ${passwordMinLength} characters`;
  }
  return undefined;
}

/**
 * Validate required field
 * 
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message
 * @returns Error message if invalid, undefined if valid
 * 
 * @example
 * ```tsx
 * const error = validateRequired('', 'Full Name');
 * if (error) {
 *   console.error(error); // "Full Name is required"
 * }
 * ```
 */
export function validateRequired(value: string, fieldName: string): string | undefined {
  if (!value.trim()) {
    return `${fieldName} is required`;
  }
  return undefined;
}

/**
 * Validate password confirmation matches
 * 
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns Error message if passwords don't match, undefined if they match
 * 
 * @example
 * ```tsx
 * const error = validateConfirmPassword('password123', 'password456');
 * if (error) {
 *   console.error(error); // "Passwords do not match"
 * }
 * ```
 */
export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string | undefined {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return undefined;
}

/**
 * Type guard to check if a value is a non-empty string
 * 
 * @param value - Value to check
 * @returns True if value is a non-empty string
 * 
 * @example
 * ```tsx
 * if (isNonEmptyString(userInput)) {
 *   // TypeScript knows userInput is a string here
 *   console.log(userInput.toUpperCase());
 * }
 * ```
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Type guard to check if a value is a valid email
 * 
 * @param value - Value to check
 * @returns True if value is a valid email string
 * 
 * @example
 * ```tsx
 * if (isValidEmail(userInput)) {
 *   // TypeScript knows userInput is a string and valid email
 *   await sendEmail(userInput);
 * }
 * ```
 */
export function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && emailRegex.test(value);
}
