/**
 * Type Guards
 * 
 * Runtime type checking functions that provide TypeScript type narrowing.
 * These guards validate types at runtime and help TypeScript understand
 * the type of a value after the check.
 * 
 * Requirements: 8.4, 8.9
 */

import type { Teacher, Student, Class } from '@/types/models';
import type { User } from '@supabase/supabase-js';

/**
 * Type guard to check if a value is defined (not null or undefined)
 * 
 * @param value - Value to check
 * @returns True if value is not null or undefined
 * 
 * @example
 * ```tsx
 * const maybeUser: User | null = await getUser();
 * if (isDefined(maybeUser)) {
 *   // TypeScript knows maybeUser is User here
 *   console.log(maybeUser.email);
 * }
 * ```
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Type guard to check if a value is a string
 * 
 * @param value - Value to check
 * @returns True if value is a string
 * 
 * @example
 * ```tsx
 * if (isString(input)) {
 *   // TypeScript knows input is string here
 *   console.log(input.toUpperCase());
 * }
 * ```
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard to check if a value is a number
 * 
 * @param value - Value to check
 * @returns True if value is a number (and not NaN)
 * 
 * @example
 * ```tsx
 * if (isNumber(input)) {
 *   // TypeScript knows input is number here
 *   console.log(input.toFixed(2));
 * }
 * ```
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Type guard to check if a value is a boolean
 * 
 * @param value - Value to check
 * @returns True if value is a boolean
 * 
 * @example
 * ```tsx
 * if (isBoolean(input)) {
 *   // TypeScript knows input is boolean here
 *   console.log(input ? 'yes' : 'no');
 * }
 * ```
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Type guard to check if a value is an array
 * 
 * @param value - Value to check
 * @returns True if value is an array
 * 
 * @example
 * ```tsx
 * if (isArray(input)) {
 *   // TypeScript knows input is unknown[] here
 *   console.log(input.length);
 * }
 * ```
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Type guard to check if a value is an object (not null, not array)
 * 
 * @param value - Value to check
 * @returns True if value is a plain object
 * 
 * @example
 * ```tsx
 * if (isObject(input)) {
 *   // TypeScript knows input is Record<string, unknown> here
 *   console.log(Object.keys(input));
 * }
 * ```
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard to check if a value is a Date object
 * 
 * @param value - Value to check
 * @returns True if value is a Date object
 * 
 * @example
 * ```tsx
 * if (isDate(input)) {
 *   // TypeScript knows input is Date here
 *   console.log(input.toISOString());
 * }
 * ```
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Type guard to check if a value is a Teacher
 * 
 * @param value - Value to check
 * @returns True if value has the shape of a Teacher
 * 
 * @example
 * ```tsx
 * if (isTeacher(profile)) {
 *   // TypeScript knows profile is Teacher here
 *   console.log(profile.school);
 * }
 * ```
 */
export function isTeacher(value: unknown): value is Teacher {
  if (!isObject(value)) return false;
  
  return (
    isString(value.id) &&
    isString(value.email) &&
    isString(value.fullName) &&
    isString(value.school) &&
    isBoolean(value.verified) &&
    isArray(value.subjects) &&
    isDate(value.createdAt) &&
    isDate(value.updatedAt)
  );
}

/**
 * Type guard to check if a value is a Student
 * 
 * @param value - Value to check
 * @returns True if value has the shape of a Student
 * 
 * @example
 * ```tsx
 * if (isStudent(profile)) {
 *   // TypeScript knows profile is Student here
 *   console.log(profile.grade);
 * }
 * ```
 */
export function isStudent(value: unknown): value is Student {
  if (!isObject(value)) return false;
  
  return (
    isString(value.id) &&
    isString(value.email) &&
    isString(value.fullName) &&
    isString(value.grade) &&
    isArray(value.enrolledClasses) &&
    isDate(value.createdAt) &&
    isDate(value.updatedAt)
  );
}

/**
 * Type guard to check if a value is a Class
 * 
 * @param value - Value to check
 * @returns True if value has the shape of a Class
 * 
 * @example
 * ```tsx
 * if (isClass(data)) {
 *   // TypeScript knows data is Class here
 *   console.log(data.subject);
 * }
 * ```
 */
export function isClass(value: unknown): value is Class {
  if (!isObject(value)) return false;
  
  return (
    isString(value.id) &&
    isString(value.teacherId) &&
    isString(value.name) &&
    isString(value.subject) &&
    isString(value.grade) &&
    (value.description === null || isString(value.description)) &&
    isNumber(value.studentCount) &&
    isDate(value.createdAt) &&
    isDate(value.updatedAt)
  );
}

/**
 * Type guard to check if a value is a Supabase User
 * 
 * @param value - Value to check
 * @returns True if value has the shape of a Supabase User
 * 
 * @example
 * ```tsx
 * if (isSupabaseUser(data)) {
 *   // TypeScript knows data is User here
 *   console.log(data.email);
 * }
 * ```
 */
export function isSupabaseUser(value: unknown): value is User {
  if (!isObject(value)) return false;
  
  return (
    isString(value.id) &&
    isString(value.aud) &&
    (value.email === undefined || isString(value.email)) &&
    isString(value.created_at)
  );
}

/**
 * Type guard to check if an error is an Error object
 * 
 * @param value - Value to check
 * @returns True if value is an Error
 * 
 * @example
 * ```tsx
 * try {
 *   // some code
 * } catch (err) {
 *   if (isError(err)) {
 *     // TypeScript knows err is Error here
 *     console.error(err.message);
 *   }
 * }
 * ```
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Type guard to check if a value is a non-empty array
 * 
 * @param value - Value to check
 * @returns True if value is an array with at least one element
 * 
 * @example
 * ```tsx
 * if (isNonEmptyArray(classes)) {
 *   // TypeScript knows classes has at least one element
 *   const firstClass = classes[0]; // Safe access
 * }
 * ```
 */
export function isNonEmptyArray<T>(value: T[]): value is [T, ...T[]] {
  return Array.isArray(value) && value.length > 0;
}
