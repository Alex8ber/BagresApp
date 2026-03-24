/**
 * TeacherLoginScreen
 * 
 * Login screen for teachers with email and password authentication.
 * Uses LoginForm component and integrates with useAuth hook.
 * 
 * Requirements: 2.3, 2.6, 5.3, 6.6, 8.1, 8.2, 11.8
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
  TouchableOpacity,
} from 'react-native';
import { LoginForm } from '@/components/screens/TeacherLogin';
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/styles/theme';
import type { RootStackScreenProps } from '@/types/navigation';
import type { LoginFormData } from '@/types/forms';

// ============================================================================
// Types
// ============================================================================

type Props = RootStackScreenProps<'TeacherLogin'>;

// ============================================================================
// Component
// ============================================================================

export default function TeacherLoginScreen({ navigation }: Props) {
  const { signIn, loading } = useAuth();
  const [error, setError] = useState<string | undefined>();

  const handleLogin = async (data: LoginFormData) => {
    try {
      setError(undefined);
      await signIn(data.email, data.password, 'teacher');
      // Navigate to dashboard after successful login
      navigation.replace('TeacherDashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password flow
  };

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
          <View style={styles.contentContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.emoji}>👨‍🏫</Text>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>
                Enter your details to manage your classes
              </Text>
            </View>

            {/* Login Form */}
            <LoginForm
              onSubmit={handleLogin}
              loading={loading}
              error={error}
            />

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
              disabled={loading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
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

  contentContainer: {
    width: '100%',
    maxWidth: 400,
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

  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 8,
  },

  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.teacher.main,
  },
});
