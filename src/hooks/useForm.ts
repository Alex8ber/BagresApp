/**
 * useForm Hook
 * 
 * Generic form management hook with validation, error handling, and submission.
 * Provides a complete form state management solution with TypeScript support.
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.9, 4.10
 * 
 * @example
 * ```tsx
 * const { values, errors, handleChange, handleSubmit } = useForm({
 *   initialValues: { email: '', password: '' },
 *   validate: (values) => {
 *     const errors: Partial<Record<keyof typeof values, string>> = {};
 *     if (!values.email) errors.email = 'Email is required';
 *     return errors;
 *   },
 *   onSubmit: async (values) => {
 *     await signIn(values.email, values.password);
 *   },
 * });
 * ```
 */

import { useState, useCallback } from 'react';

/**
 * Options for configuring the useForm hook
 */
export interface UseFormOptions<T> {
  /** Initial values for the form fields */
  initialValues: T;
  /** Optional validation function that returns errors for each field */
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  /** Function called when form is submitted with valid data */
  onSubmit: (values: T) => void | Promise<void>;
}

/**
 * Return type of the useForm hook
 */
export interface UseFormReturn<T> {
  /** Current form values */
  values: T;
  /** Current validation errors for each field */
  errors: Partial<Record<keyof T, string>>;
  /** Fields that have been touched (blurred) */
  touched: Partial<Record<keyof T, boolean>>;
  /** Whether the form is currently submitting */
  isSubmitting: boolean;
  /** Handle field value changes */
  handleChange: (field: keyof T) => (value: any) => void;
  /** Handle field blur events */
  handleBlur: (field: keyof T) => () => void;
  /** Handle form submission */
  handleSubmit: () => Promise<void>;
  /** Manually set a field value */
  setFieldValue: (field: keyof T, value: any) => void;
  /** Manually set a field error */
  setFieldError: (field: keyof T, error: string) => void;
  /** Reset form to initial values */
  resetForm: () => void;
}

/**
 * Generic form management hook
 * 
 * Manages form state, validation, errors, touched fields, and submission.
 * Provides a complete solution for form handling with TypeScript support.
 * 
 * @param options - Configuration options for the form
 * @returns Form state and handlers
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle field value changes
   */
  const handleChange = useCallback((field: keyof T) => {
    return (value: any) => {
      setValues((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error for this field when user starts typing
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    };
  }, [errors]);

  /**
   * Handle field blur events
   */
  const handleBlur = useCallback((field: keyof T) => {
    return () => {
      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }));

      // Validate this field on blur if validation function exists
      if (validate) {
        const validationErrors = validate(values);
        if (validationErrors[field]) {
          setErrors((prev) => ({
            ...prev,
            [field]: validationErrors[field],
          }));
        }
      }
    };
  }, [validate, values]);

  /**
   * Manually set a field value
   */
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  /**
   * Manually set a field error
   */
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Partial<Record<keyof T, boolean>>);
    setTouched(allTouched);

    // Validate all fields
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);

      // Don't submit if there are validation errors
      if (Object.keys(validationErrors).length > 0) {
        return;
      }
    }

    // Submit the form
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      // Error handling is done by the onSubmit function
      // This catch prevents unhandled promise rejections
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
  };
}
