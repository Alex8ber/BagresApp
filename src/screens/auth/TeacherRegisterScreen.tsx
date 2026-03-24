/**
 * TeacherRegisterScreen
 * 
 * Registration screen for teachers with full validation.
 * Collects teacher information and creates a new account.
 * 
 * Requirements: 2.3, 2.9, 5.6, 6.6, 8.1, 8.2, 8.4, 11.9
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
import type { TeacherRegisterFormData, TeacherRegisterFormErrors } from '@/types/forms';

// ============================================================================
// Types
// ============================================================================

type Props = RootStackScreenProps<'TeacherRegister'>;

// ============================================================================
// Component
// ============================================================================

export default function TeacherRegisterScreen({ navigation }: Props) {
  const { signUp, loading } = useAuth();
  const [error, setError] = useState<string | undefined>();

  const { values, errors, handleChange, handleSubmit } = useForm<TeacherRegisterFormData>({
    initialValues: {
      fullName: '',
      email: '',
      school: '',
      password: '',
      confirmPassword: '',
    },
    validate: (values) => {
      const errors: TeacherRegisterFormErrors = {};
      
      const fullNameError = validateRequired(values.fullName, 'Full Name');
      if (fullNameError) {
        errors.fullName = fullNameError;
      }
      
      const emailError = validateEmail(values.email);
      if (emailError) {
        errors.email = emailError;
      }
      
      const schoolError = validateRequired(values.school, 'School');
      if (schoolError) {
        errors.school = schoolError;
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
        await signUp(data.email, data.password, 'teacher', {
          fullName: data.fullName,
          school: data.school,
        });
        // Navigate to verification screen
        navigation.navigate('TeacherVerification', { email: data.email });
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
            <Text style={styles.emoji}>👨‍🏫</Text>
            <Text style={styles.title}>Teacher Register</Text>
            <Text style={styles.subtitle}>
              Create an account to manage classes
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="e.g. Jane Smith"
              value={values.fullName}
              onChangeText={handleChange('fullName')}
              error={errors.fullName}
              autoCapitalize="words"
              editable={!loading}
            />

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
              label="School"
              placeholder="e.g. Springfield High School"
              value={values.school}
              onChangeText={handleChange('school')}
              error={errors.school}
              autoCapitalize="words"
              editable={!loading}
            />

            <Input
              label="Password"
              placeholder="Create your password"
              value={values.password}
              onChangeText={handleChange('password')}
              error={errors.password}
              secureTextEntry
              editable={!loading}
            />

            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              error={errors.confirmPassword}
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
              style={[styles.submitButton, { backgroundColor: theme.colors.teacher.main }]}
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
