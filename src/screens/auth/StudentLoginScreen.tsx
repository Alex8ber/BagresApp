/**
 * StudentLoginScreen
 * 
 * Login screen for students with username and class code authentication.
 * Reuses LoginForm component with student-specific configuration.
 * 
 * Requirements: 2.3, 2.6, 5.3, 6.7, 8.1, 8.2, 11.8
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
import { validateRequired } from '@/utils/validation';
import { theme } from '@/styles/theme';
import type { RootStackScreenProps } from '@/types/navigation';

// ============================================================================
// Types
// ============================================================================

type Props = RootStackScreenProps<'StudentLogin'>;

interface StudentLoginFormData {
  username: string;
  classCode: string;
}

interface StudentLoginFormErrors {
  username?: string;
  classCode?: string;
}

// ============================================================================
// Component
// ============================================================================

export default function StudentLoginScreen({ navigation }: Props) {
  const { signIn, loading } = useAuth();
  const [error, setError] = useState<string | undefined>();

  const { values, errors, handleChange, handleSubmit } = useForm<StudentLoginFormData>({
    initialValues: {
      username: '',
      classCode: '',
    },
    validate: (values) => {
      const errors: StudentLoginFormErrors = {};
      
      const usernameError = validateRequired(values.username, 'Name / Username');
      if (usernameError) {
        errors.username = usernameError;
      }
      
      const classCodeError = validateRequired(values.classCode, 'Class Code');
      if (classCodeError) {
        errors.classCode = classCodeError;
      }
      
      return errors;
    },
    onSubmit: async (data) => {
      try {
        setError(undefined);
        // For student login, we use username as email placeholder
        await signIn(data.username, data.classCode, 'student');
        // Navigate to student dashboard after successful login
        // TODO: Add student dashboard navigation when implemented
        console.log('Student logged in successfully');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed');
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
            <Text style={styles.title}>Hi there, student</Text>
            <Text style={styles.subtitle}>
              Enter your details to join a class
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Name / Username"
              placeholder="e.g. John Doe"
              value={values.username}
              onChangeText={handleChange('username')}
              error={errors.username}
              autoCapitalize="words"
              editable={!loading}
              focusColor={theme.colors.student.main}
            />

            <Input
              label="Class Code"
              placeholder="6 characters (e.g. AB12CD)"
              value={values.classCode}
              onChangeText={handleChange('classCode')}
              error={errors.classCode}
              maxLength={6}
              autoCapitalize="characters"
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
              Login
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
    justifyContent: 'center',
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
    marginBottom: 16,
  },

  errorInput: {
    marginBottom: 0,
  },

  submitButton: {
    marginTop: 16,
  },
});
