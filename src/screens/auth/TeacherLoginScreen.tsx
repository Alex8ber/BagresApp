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
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from '@/hooks/useForm';
import { validateEmail, validateRequired } from '@/utils/validation';
import { theme } from '@/styles/theme';
import type { RootStackScreenProps } from '@/types/navigation';

// ============================================================================
// Types
// ============================================================================

type Props = RootStackScreenProps<'TeacherLogin'>;

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

// ============================================================================
// Component
// ============================================================================

export default function TeacherLoginScreen({ navigation }: Props) {
  const { signIn, loading } = useAuth();
  const [error, setError] = useState<string | undefined>();

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
    onSubmit: async (data) => {
      try {
        setError(undefined);
        await signIn(data.email, data.password, 'teacher');
        // Navigation is handled by auth state change
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed');
      }
    },
  });

  const handleForgotPassword = () => {
    // TODO: Implement forgot password flow
  };

  const handleGoToRegister = () => {
    navigation.replace('TeacherRegister');
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
          <View style={styles.container}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.iconEmoji}>👨‍🏫</Text>
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Bienvenido de vuelta</Text>
              <Text style={styles.subtitle}>
                Ingresa tus datos para gestionar{'\n'}tus clases
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Text style={styles.label}>Correo electrónico</Text>
              <Input
                placeholder="tu@email.com"
                value={values.email}
                onChangeText={handleChange('email')}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                leftIcon={<Ionicons name="mail-outline" size={20} color={theme.colors.text.tertiary} />}
                focusColor={theme.colors.teacher.main}
              />

              <Text style={styles.label}>Contraseña</Text>
              <Input
                placeholder="Ingresa tu contraseña"
                value={values.password}
                onChangeText={handleChange('password')}
                error={errors.password}
                secureTextEntry
                editable={!loading}
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.tertiary} />}
                focusColor={theme.colors.teacher.main}
              />

              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
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
                Iniciar Sesión
              </Button>

              {/* Forgot Password */}
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={handleForgotPassword}
                disabled={loading}
              >
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              {/* Register Link */}
              <View style={styles.registerPrompt}>
                <Text style={styles.registerPromptText}>¿No tienes una cuenta? </Text>
                <TouchableOpacity onPress={handleGoToRegister} disabled={loading}>
                  <Text style={styles.registerLink}>Regístrate aquí</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    backgroundColor: '#F5F5F5',
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'center',
  },

  container: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },

  iconEmoji: {
    fontSize: 40,
  },

  header: {
    marginBottom: 32,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 15,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },

  form: {
    width: '100%',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.teacher.main,
    marginBottom: 8,
    marginTop: 4,
  },

  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },

  errorText: {
    color: '#C62828',
    fontSize: 14,
    textAlign: 'center',
  },

  submitButton: {
    marginTop: 24,
    backgroundColor: theme.colors.teacher.main,
    borderRadius: 28,
    height: 56,
    shadowColor: theme.colors.teacher.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },

  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.teacher.main,
  },

  registerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },

  registerPromptText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },

  registerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.teacher.main,
  },
});
