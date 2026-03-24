/**
 * Context Hooks Property-Based Tests
 * 
 * Property 2: Context Hook Provider Validation
 * Validates Requirement 6.7
 * 
 * Property: For any custom hook that consumes a React Context, when the hook
 * is called outside of its corresponding Provider component, the hook SHALL
 * throw an Error with a descriptive message indicating which Provider is missing.
 * 
 * Rationale: Using a hook outside its provider is a programming error that must
 * be detected immediately with a clear message. This prevents subtle bugs and
 * facilitates debugging.
 * 
 * Test Strategy: For each context hook (useAuth, useTeacher), attempt to call
 * it outside the provider and verify that it throws an Error with a message
 * that mentions the provider name.
 */

import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { useAuth, AuthProvider } from '../AuthContext';
import { useTeacher, TeacherProvider } from '../TeacherContext';

// Mock Supabase client before any imports that use it
jest.mock('@/services/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
  },
}));

// Mock auth service
jest.mock('@/services/supabase/auth', () => ({
  getCurrentUser: jest.fn().mockResolvedValue(null),
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  getTeacherProfile: jest.fn().mockResolvedValue(null),
  getStudentProfile: jest.fn().mockResolvedValue(null),
  createTeacherProfile: jest.fn(),
  createStudentProfile: jest.fn(),
}));

// Mock classes service
jest.mock('@/services/supabase/classes', () => ({
  getClasses: jest.fn().mockResolvedValue([]),
  createClass: jest.fn(),
  updateClass: jest.fn(),
  deleteClass: jest.fn(),
}));

/**
 * Type definition for a context hook test case
 */
interface ContextHookTestCase {
  hookName: string;
  hook: () => any;
  Provider: React.ComponentType<{ children: React.ReactNode }>;
  expectedProviderName: string;
}

/**
 * All context hooks in the application that must validate provider usage
 */
const contextHooks: ContextHookTestCase[] = [
  {
    hookName: 'useAuth',
    hook: useAuth,
    Provider: AuthProvider,
    expectedProviderName: 'AuthProvider',
  },
  {
    hookName: 'useTeacher',
    hook: useTeacher,
    Provider: TeacherProvider,
    expectedProviderName: 'TeacherProvider',
  },
];

describe('Property 2: Context Hook Provider Validation', () => {
  describe('Universal Property: All context hooks must throw descriptive errors outside providers', () => {
    /**
     * Property Test: For ANY context hook, calling it outside its provider
     * SHALL throw an Error with a descriptive message
     */
    contextHooks.forEach(({ hookName, hook, Provider, expectedProviderName }) => {
      describe(`${hookName}`, () => {
        it('should throw an Error when used outside its provider', () => {
          // Suppress console.error for this test since we expect an error
          const originalError = console.error;
          console.error = jest.fn();

          try {
            // Attempt to render hook WITHOUT provider
            expect(() => {
              renderHook(() => hook());
            }).toThrow(Error);
          } finally {
            console.error = originalError;
          }
        });

        it('should throw an error message that mentions the provider name', () => {
          // Suppress console.error for this test since we expect an error
          const originalError = console.error;
          console.error = jest.fn();

          try {
            // Attempt to render hook WITHOUT provider and capture error
            expect(() => {
              renderHook(() => hook());
            }).toThrow(new RegExp(expectedProviderName, 'i'));
          } finally {
            console.error = originalError;
          }
        });

        it('should throw an error message that is descriptive and actionable', () => {
          // Suppress console.error for this test since we expect an error
          const originalError = console.error;
          console.error = jest.fn();

          try {
            // Attempt to render hook WITHOUT provider
            let errorMessage = '';
            try {
              renderHook(() => hook());
            } catch (error) {
              errorMessage = error instanceof Error ? error.message : String(error);
            }

            // Verify error message contains key information:
            // 1. The hook name
            // 2. The provider name
            // 3. Actionable guidance (e.g., "must be used within", "wrap")
            expect(errorMessage).toMatch(new RegExp(hookName, 'i'));
            expect(errorMessage).toMatch(new RegExp(expectedProviderName, 'i'));
            expect(errorMessage).toMatch(/must be used within|wrap/i);
          } finally {
            console.error = originalError;
          }
        });

        it('should NOT throw when used inside its provider', () => {
          // TeacherProvider requires AuthProvider, so wrap it appropriately
          const wrapper = ({ children }: { children: React.ReactNode }) => {
            if (hookName === 'useTeacher') {
              return (
                <AuthProvider>
                  <Provider>{children}</Provider>
                </AuthProvider>
              );
            }
            return <Provider>{children}</Provider>;
          };

          expect(() => {
            renderHook(() => hook(), { wrapper });
          }).not.toThrow();
        });
      });
    });
  });

  describe('Property Validation: Error message quality', () => {
    it('should ensure all context hooks have consistent error message format', () => {
      const errorMessages: string[] = [];

      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      try {
        // Collect error messages from all hooks
        contextHooks.forEach(({ hook }) => {
          try {
            renderHook(() => hook());
          } catch (error) {
            if (error instanceof Error) {
              errorMessages.push(error.message);
            }
          }
        });

        // Verify all error messages follow a consistent pattern
        errorMessages.forEach((message) => {
          // Each message should contain:
          // 1. Hook name (use*)
          // 2. Provider name (*Provider)
          // 3. Actionable guidance
          expect(message).toMatch(/use\w+/); // Hook name pattern
          expect(message).toMatch(/\w+Provider/); // Provider name pattern
          expect(message).toMatch(/must be used within|wrap/i); // Guidance
        });

        // Verify we collected messages from all hooks
        expect(errorMessages.length).toBe(contextHooks.length);
      } finally {
        console.error = originalError;
      }
    });
  });

  describe('Property Validation: Error type correctness', () => {
    it('should throw Error instances (not strings or other types)', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      try {
        contextHooks.forEach(({ hookName, hook }) => {
          let caughtError: any = null;

          try {
            renderHook(() => hook());
          } catch (error) {
            caughtError = error;
          }

          // Verify the thrown value is an Error instance
          expect(caughtError).toBeInstanceOf(Error);
          expect(typeof caughtError?.message).toBe('string');
          expect(caughtError?.message.length).toBeGreaterThan(0);
        });
      } finally {
        console.error = originalError;
      }
    });
  });

  describe('Counterexample: Hooks work correctly inside providers', () => {
    /**
     * This test demonstrates that the property holds in the positive case:
     * hooks DO work when used correctly inside their providers
     */
    it('should allow all hooks to be called successfully inside their providers', () => {
      contextHooks.forEach(({ hookName, hook, Provider }) => {
        // TeacherProvider requires AuthProvider, so wrap it appropriately
        const wrapper = ({ children }: { children: React.ReactNode }) => {
          if (hookName === 'useTeacher') {
            return (
              <AuthProvider>
                <Provider>{children}</Provider>
              </AuthProvider>
            );
          }
          return <Provider>{children}</Provider>;
        };

        const { result } = renderHook(() => hook(), { wrapper });

        // Verify hook returns a value (not undefined)
        expect(result.current).toBeDefined();
        
        // Verify hook returns an object with expected properties
        expect(typeof result.current).toBe('object');
        expect(result.current).not.toBeNull();
      });
    });
  });
});

/**
 * Additional Property Tests: Nested Providers
 * 
 * These tests verify that hooks work correctly when providers are nested,
 * which is a common pattern in React applications.
 */
describe('Property Extension: Nested Provider Scenarios', () => {
  it('should work when TeacherProvider is nested inside AuthProvider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>
        <TeacherProvider>{children}</TeacherProvider>
      </AuthProvider>
    );

    // Both hooks should work in this nested setup
    expect(() => {
      renderHook(() => useAuth(), { wrapper });
    }).not.toThrow();

    expect(() => {
      renderHook(() => useTeacher(), { wrapper });
    }).not.toThrow();
  });

  it('should throw when TeacherProvider is used without AuthProvider', () => {
    // TeacherProvider depends on AuthProvider, so it should fail
    // when AuthProvider is missing
    const originalError = console.error;
    console.error = jest.fn();

    try {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <TeacherProvider>{children}</TeacherProvider>
      );

      // This should throw because TeacherProvider uses useAuth internally
      expect(() => {
        renderHook(() => useTeacher(), { wrapper });
      }).toThrow();
    } finally {
      console.error = originalError;
    }
  });
});
