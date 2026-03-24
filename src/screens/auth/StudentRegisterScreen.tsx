/**
 * StudentRegisterScreen
 * 
 * Registration screen for students with validation.
 * Collects student information and creates a new account.
 * 
 * Requirements: 2.3, 2.9, 5.6, 6.7, 8.1, 8.2, 8.4, 11.9
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from '@/hooks/useForm';
import {
  validateEmail,
  validatePassword,
  validateRequired,
  validateConfirmPassword,
} from '@/utils/validation';
import { theme } from '@/styles/theme';
import type { RootStackScreenProps } from '@/types/navigation';
import type { StudentRegisterFormData, StudentRegisterFormErrors } from '@/types/forms';

// ============================================================================
// Types
// ============================================================================

type Props = RootStackScreenProps<'StudentRegister'>;

// ============================================================================
// Component
// ============================================================================

export default function StudentRegisterScreen(_props: Props) {
  const { signUp, loading } = useAuth();
  const [error, setError] = useState<string | undefined>();

  const { values, errors, handleChange, handleSubmit } = useForm<StudentRegisterFormData>({
    initialValues: {
      fullName: '',
      email: '',
      grade: '',
      password: '',
      confirmPassword: '',
    },
    validate: (values) => {
      const errors: StudentRegisterFormErrors = {};
      
      const fullNameError = validateRequired(values.fullName, 'Full Name');
      if (fullNameError) {
        errors.fullName = fullNameError;
      }
      
      const emailError = validateEmail(values.email);
      if (emailError) {
        errors.email = emailError;
      }
      
      const gradeError = validateRequired(values.grade, 'Grade');
      if (gradeError) {
        errors.grade = gradeError;
      }
      
      const passwordError = validatePassword(values.password);
      if (passwordError) {
        errors.password = passwordError;
      }
      
      const confirmPasswordError = validateConfirmPassword(
        values.password,
        values.confirmPassword
      );
      if (confirmPasswordError) {
        errors.confirmPassword = confirmPasswordError;
      }
      
      return errors;
    },
    onSubmit: async (data) => {
      try {
        setError(undefined);
        await signUp(data.email, data.password, 'student', {
          fullName: data.fullName,
          grade: data.grade,
        });
        // Navigation is handled by auth state change
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Registration failed');
      }
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.emoji}>👨‍🎓</Text>
            <Text style={styles.title}>Student Register</Text>
            <Text style={styles.subtitle}>
              Create an account to join a class
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="e.g. John Doe"
              value={values.fullName}
              onChangeText={handleChange('fullName')}
              error={errors.fullName}
              autoCapitalize="words"
              editable={!loading}
              focusColor={theme.colors.student.main}
            />

            <Input
              label="Email Address"
              placeholder="e.g. student@school.edu"
              value={values.email}
              onChangeText={handleChange('email')}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
              focusColor={theme.colors.student.main}
            />

            <Input
              label="Grade"
              placeholder="e.g. 10th Grade"
              value={values.grade}
              onChangeText={handleChange('grade')}
              error={errors.grade}
              editable={!loading}
              focusColor={theme.colors.student.main}
            />

            <Input
              label="Password"
              placeholder="Create a password"
              value={values.password}
              onChangeText={handleChange('password')}
              error={errors.password}
              secureTextEntry
              editable={!loading}
              focusColor={theme.colors.student.main}
            />

            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              error={errors.confirmPassword}
              secureTextEntry
              editable={!loading}
              focusColor={theme.colors.student.main}
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
              style={[styles.submitButton, { backgroundColor: theme.colors.student.main }]}
            >
              Register
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 48,
  },

  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 16,
  },

  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },

  form: {
    width: '100%',
    maxWidth: 400,
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
