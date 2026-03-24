/**
 * LoginForm Component
 * 
 * Reusable login form with email and password fields.
 * Handles validation and submission for both teacher and student login.
 * 
 * Requirements: 2.3, 2.6, 5.3, 8.1, 8.2, 11.8
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { useForm } from '@/hooks/useForm';
import { validateEmail, validateRequired } from '@/utils/validation';
import { theme } from '@/styles/theme';
import type { LoginFormData, LoginFormErrors } from '@/types/forms';

// ============================================================================
// Types
// ============================================================================

export interface LoginFormProps {
  /** Handler called when form is submitted with valid data */
  onSubmit: (data: LoginFormData) => void | Promise<void>;
  /** Whether the form is in a loading state */
  loading?: boolean;
  /** Optional error message to display */
  error?: string;
}

// ============================================================================
// Component
// ============================================================================

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
  error,
}) => {
  const { values, errors, handleChange, handleSubmit } = useForm<LoginFormData>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors: LoginFormErrors = {};
      
      const emailError = validateEmail(values.email);
      if (emailError) {
        errors.email = emailError;
      }
      
      const passwordError = validateRequired(values.password, 'Password');
      if (passwordError) {
        errors.password = passwordError;
      }
      
      return errors;
    },
    onSubmit,
  });

  return (
    <View style={styles.container}>
      <Input
        label="Email Address"
        placeholder="e.g. teacher@school.edu"
        value={values.email}
        onChangeText={handleChange('email')}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
      />

      <Input
        label="Password"
        placeholder="Enter your password"
        value={values.password}
        onChangeText={handleChange('password')}
        error={errors.password}
        secureTextEntry
        editable={!loading}
      />

      {error && (
        <View style={styles.errorContainer}>
          <Input
            error={error}
            editable={false}
            containerStyle={styles.errorInput}
          />
        </View>
      )}

      <Button
        variant="primary"
        size="large"
        fullWidth
        onPress={handleSubmit}
        loading={loading}
        style={styles.submitButton}
      >
        Login
      </Button>
    </View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  errorContainer: {
    marginBottom: theme.spacing.base,
  },

  errorInput: {
    marginBottom: 0,
  },

  submitButton: {
    marginTop: theme.spacing.base,
  },
});

export default LoginForm;
