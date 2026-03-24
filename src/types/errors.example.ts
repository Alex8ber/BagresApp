/**
 * Example Usage of Custom Error Classes
 * 
 * This file demonstrates how to use the custom error classes
 * throughout the application for consistent error handling.
 * 
 * NOTE: This is an example file for documentation purposes.
 * The useState import is commented out since this is not a real component.
 */

import {
  AppError,
  ValidationError,
  AuthenticationError,
  NetworkError,
  DatabaseError,
} from './errors';

// import { useState } from 'react'; // Uncomment when using in actual components

// Example 1: Validation Error in a form
export function validateEmail(email: string): void {
  if (!email.trim()) {
    throw new ValidationError('Email is required', 'email');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format', 'email');
  }
}

// Example 2: Authentication Error in a service
export async function signIn(email: string, password: string): Promise<void> {
  // Simulated authentication check
  if (!email || !password) {
    throw new AuthenticationError('Email and password are required');
  }
  
  // If credentials are invalid
  throw new AuthenticationError('Invalid credentials');
}

// Example 3: Network Error in an API call
export async function fetchData(url: string): Promise<any> {
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    throw new NetworkError('Failed to fetch data from server');
  }
}

// Example 4: Database Error in Supabase operation
export async function queryDatabase(query: string): Promise<any> {
  try {
    // Simulated database query
    throw new Error('Connection failed');
  } catch (error) {
    throw new DatabaseError('Failed to execute query', query);
  }
}

// Example 5: Catching specific error types
export async function handleUserLogin(email: string, password: string): Promise<void> {
  try {
    validateEmail(email);
    await signIn(email, password);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error(`Validation error in field ${error.field}: ${error.message}`);
      // Show field-specific error to user
    } else if (error instanceof AuthenticationError) {
      console.error(`Authentication failed: ${error.message}`);
      // Show authentication error to user
    } else if (error instanceof NetworkError) {
      console.error(`Network error: ${error.message}`);
      // Show connectivity message to user
    } else if (error instanceof AppError) {
      console.error(`Application error [${error.code}]: ${error.message}`);
      // Show generic error to user
    } else {
      console.error('Unexpected error:', error);
      // Show generic error to user
    }
  }
}

// Example 6: Error handling in a React hook (example only)
export function useAuthExample() {
  // const [error, setError] = useState<string | null>(null); // Uncomment in real component
  const setError = (_msg: string | null) => {}; // Placeholder for example
  
  const handleLogin = async (email: string, password: string) => {
    setError(null);
    
    try {
      await signIn(email, password);
    } catch (err) {
      if (err instanceof AuthenticationError) {
        setError(err.message);
      } else if (err instanceof NetworkError) {
        setError('Unable to connect. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };
  
  return { handleLogin, error: null };
}

// Example 7: Type guards for error handling
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

// Example 8: Using type guards
export function handleError(error: unknown): string {
  if (isValidationError(error)) {
    return `Validation failed: ${error.message}`;
  }
  
  if (isAppError(error)) {
    return `Error [${error.code}]: ${error.message}`;
  }
  
  return 'An unexpected error occurred';
}
