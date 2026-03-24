/**
 * Property-Based Tests for Async Hooks
 * 
 * Property 1: Async Hook State Management
 * Validates: Requirements 4.5
 * 
 * Verifies that hooks performing asynchronous operations with Supabase
 * always expose `loading` and `error` state properties that accurately
 * reflect the current state of the async operation.
 * 
 * Test Strategy:
 * - Generate different scenarios of async operations (success, error, timeout)
 * - Verify that hooks always expose loading: boolean and error: string | null
 * - Verify that loading is true during operation and false after completion
 * - Verify that error is null on success and contains message on failure
 */

import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useTeacherClasses } from '../useTeacherClasses';
import * as classesService from '@/services/supabase/classes';
import type { Class } from '@/types/database';
import type { User } from '@supabase/supabase-js';

// Mock the Supabase client
jest.mock('@/services/supabase/client', () => ({
  supabase: {
    auth: {},
    from: jest.fn(),
  },
}));

// Mock the services
jest.mock('@/services/supabase/classes');

// Mock useAuth hook since AuthContext doesn't exist yet (task 7.1)
jest.mock('../useAuth', () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from '../useAuth';

// Mock user for AuthContext
const mockUser: User = {
  id: 'test-user-id',
  email: 'teacher@test.com',
  aud: 'authenticated',
  role: 'authenticated',
  created_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
};

const mockProfile = {
  id: 'test-user-id',
  email: 'teacher@test.com',
  full_name: 'Test Teacher',
  school: 'Test School',
  verified: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Helper to configure useAuth mock
 */
const configureAuthMock = (user: User | null = mockUser) => {
  (useAuth as jest.Mock).mockReturnValue({
    user,
    profile: user ? mockProfile : null,
    role: user ? 'teacher' : null,
    loading: false,
    error: null,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    refreshProfile: jest.fn(),
  });
};

describe('Property 1: Async Hook State Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    configureAuthMock(); // Configure default auth mock
  });

  /**
   * Property Test 1.1: Loading state is true during async operation
   * 
   * For any async hook operation, loading MUST be true while the operation
   * is in progress and false after completion (success or failure).
   */
  describe('Loading State Lifecycle', () => {
    it('should set loading=true during initial fetch and loading=false after success', async () => {
      // Arrange: Mock successful async operation
      const mockClasses: Class[] = [
        {
          id: 'class-1',
          teacher_id: 'test-user-id',
          name: 'Math 101',
          subject: 'Mathematics',
          grade: '10th',
          description: 'Test class',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      (classesService.getClasses as jest.Mock).mockResolvedValue(mockClasses);

      // Act: Render hook
      const { result } = renderHook(() => useTeacherClasses());

      // Assert: Initially loading should be true
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe(null);

      // Wait for async operation to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Assert: After completion, loading should be false and no error
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.classes).toEqual(mockClasses);
    });

    it('should set loading=true during operation and loading=false after error', async () => {
      // Arrange: Mock failed async operation
      const errorMessage = 'Network error';
      (classesService.getClasses as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      // Act: Render hook
      const { result } = renderHook(() => useTeacherClasses());

      // Assert: Initially loading should be true
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe(null);

      // Wait for async operation to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Assert: After error, loading should be false and error should be set
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.classes).toEqual([]);
    });

    it('should set loading=true during refetch and loading=false after completion', async () => {
      // Arrange: Mock successful operations
      const mockClasses: Class[] = [];
      (classesService.getClasses as jest.Mock).mockResolvedValue(mockClasses);

      const { result } = renderHook(() => useTeacherClasses());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Act: Trigger refetch wrapped in act
      await act(async () => {
        await result.current.refetch();
      });

      // Assert: Loading should be false after refetch completes
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  /**
   * Property Test 1.2: Error state is null on success and contains message on failure
   * 
   * For any async hook operation, error MUST be null when the operation succeeds
   * and MUST contain a descriptive error message when the operation fails.
   */
  describe('Error State Management', () => {
    it('should set error=null on successful operation', async () => {
      // Arrange: Mock successful operation
      const mockClasses: Class[] = [];
      (classesService.getClasses as jest.Mock).mockResolvedValue(mockClasses);

      // Act: Render hook
      const { result } = renderHook(() => useTeacherClasses());

      // Wait for completion
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Assert: Error should be null on success
      expect(result.current.error).toBe(null);
    });

    it('should set error with message on failed operation', async () => {
      // Arrange: Mock failed operation with specific error
      const errorMessage = 'Database connection failed';
      (classesService.getClasses as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      // Act: Render hook
      const { result } = renderHook(() => useTeacherClasses());

      // Wait for completion
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Assert: Error should contain the error message
      expect(result.current.error).toBe(errorMessage);
      expect(typeof result.current.error).toBe('string');
    });

    it('should clear previous error on successful retry', async () => {
      // Arrange: First call fails, second call succeeds
      const mockClasses: Class[] = [];
      (classesService.getClasses as jest.Mock)
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce(mockClasses);

      const { result } = renderHook(() => useTeacherClasses());

      // Wait for first call to fail
      await waitFor(() => {
        expect(result.current.error).toBe('First error');
      });

      // Act: Retry with refetch wrapped in act
      await act(async () => {
        await result.current.refetch();
      });

      // Assert: Error should be cleared after successful retry
      await waitFor(() => {
        expect(result.current.error).toBe(null);
      });
      expect(result.current.loading).toBe(false);
    });
  });

  /**
   * Property Test 1.3: Hook always exposes loading and error properties
   * 
   * For any async hook, the return object MUST always contain
   * loading: boolean and error: string | null properties.
   */
  describe('State Properties Always Present', () => {
    it('should always expose loading and error properties', async () => {
      // Arrange: Mock any operation
      (classesService.getClasses as jest.Mock).mockResolvedValue([]);

      // Act: Render hook
      const { result } = renderHook(() => useTeacherClasses());

      // Assert: Properties should exist immediately
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
      expect(typeof result.current.loading).toBe('boolean');
      expect(result.current.error === null || typeof result.current.error === 'string').toBe(true);

      // Wait for completion
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Assert: Properties should still exist after completion
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
      expect(typeof result.current.loading).toBe('boolean');
      expect(result.current.error === null || typeof result.current.error === 'string').toBe(true);
    });

    it('should maintain correct types for loading and error throughout lifecycle', async () => {
      // Arrange: Mock operation that will fail
      (classesService.getClasses as jest.Mock).mockRejectedValue(
        new Error('Test error')
      );

      // Act: Render hook
      const { result } = renderHook(() => useTeacherClasses());

      // Assert: Check types during loading
      expect(typeof result.current.loading).toBe('boolean');
      expect(result.current.error === null || typeof result.current.error === 'string').toBe(true);

      // Wait for error
      await waitFor(() => {
        expect(result.current.error).not.toBe(null);
      });

      // Assert: Check types after error
      expect(typeof result.current.loading).toBe('boolean');
      expect(typeof result.current.error).toBe('string');
    });
  });

  /**
   * Property Test 1.4: CRUD operations maintain loading and error states
   * 
   * For any CRUD operation (create, update, delete), the hook MUST
   * maintain proper loading and error states.
   */
  describe('CRUD Operations State Management', () => {
    it('should handle error state during createClass operation', async () => {
      // Arrange: Initial load succeeds, create fails
      (classesService.getClasses as jest.Mock).mockResolvedValue([]);
      (classesService.createClass as jest.Mock).mockRejectedValue(
        new Error('Failed to create class')
      );

      const { result } = renderHook(() => useTeacherClasses());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Act: Attempt to create class wrapped in act
      await act(async () => {
        try {
          await result.current.createClass({
            teacher_id: 'test-user-id',
            name: 'New Class',
            subject: 'Math',
            grade: '10th',
            description: null,
          });
        } catch (err) {
          // Expected to throw
        }
      });

      // Assert: Error should be set
      await waitFor(() => {
        expect(result.current.error).toBe('Failed to create class');
      });
      expect(result.current.loading).toBe(false);
    });

    it('should clear error on successful operation after previous error', async () => {
      // Arrange: Initial load succeeds
      const mockClass: Class = {
        id: 'class-1',
        teacher_id: 'test-user-id',
        name: 'Math 101',
        subject: 'Mathematics',
        grade: '10th',
        description: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      (classesService.getClasses as jest.Mock).mockResolvedValue([]);
      (classesService.createClass as jest.Mock)
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce(mockClass);

      const { result } = renderHook(() => useTeacherClasses());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Act: First create fails
      await act(async () => {
        try {
          await result.current.createClass({
            teacher_id: 'test-user-id',
            name: 'New Class',
            subject: 'Math',
            grade: '10th',
            description: null,
          });
        } catch (err) {
          // Expected
        }
      });

      await waitFor(() => {
        expect(result.current.error).toBe('First error');
      });

      // Act: Second create succeeds
      await act(async () => {
        await result.current.createClass({
          teacher_id: 'test-user-id',
          name: 'New Class',
          subject: 'Math',
          grade: '10th',
          description: null,
        });
      });

      // Assert: Error should be cleared
      await waitFor(() => {
        expect(result.current.error).toBe(null);
      });
    });
  });

  /**
   * Property Test 1.5: No user scenario
   * 
   * When no user is authenticated, the hook should handle gracefully
   * with proper loading and error states.
   */
  describe('No User Scenario', () => {
    it('should handle no user with proper loading and error states', async () => {
      // Arrange: No authenticated user
      configureAuthMock(null);

      const { result } = renderHook(() => useTeacherClasses());

      // Wait for hook to settle
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Assert: Should have proper states
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.classes).toEqual([]);
    });
  });
});
