/**
 * Custom Error Classes for BagresApp
 * 
 * This module defines custom error types for structured error handling
 * throughout the application. Each error class extends the base AppError
 * and provides specific context for different error scenarios.
 */

/**
 * Base application error class
 * All custom errors in the application extend from this class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Validation error for form inputs and data validation
 * Used when user input or data doesn't meet validation requirements
 */
export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

/**
 * Authentication error for login and authorization failures
 * Used when authentication is required or credentials are invalid
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

/**
 * Network error for connection and request failures
 * Used when network requests fail or connectivity issues occur
 */
export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed') {
    super(message, 'NETWORK_ERROR', 503);
    this.name = 'NetworkError';
  }
}

/**
 * Database error for Supabase and data operation failures
 * Used when database queries or operations fail
 */
export class DatabaseError extends AppError {
  constructor(message: string, public query?: string) {
    super(message, 'DATABASE_ERROR', 500);
    this.name = 'DatabaseError';
  }
}
