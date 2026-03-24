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
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

export default function StudentRegisterScreen({ navigation }: Props) {
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
          <View style={styles.container}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Ionicons name="school" size={48} color={theme.colors.student.main} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Registro de{'\n'}Estudiante</Text>
              <Text style={styles.subtitle}>
                Completa tus datos para unirte{'\n'}a una clase
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Text style={styles.label}>Nombre completo</Text>
              <Input
                placeholder="Ej. Juan Pérez"
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                error={errors.fullName}
                autoCapitalize="words"
                editable={!loading}
                leftIcon={<Ionicons name="person-outline" size={20} color={theme.colors.text.tertiary} />}
                focusColor={theme.colors.student.main}
              />

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
                focusColor={theme.colors.student.main}
              />

              <Text style={styles.label}>Grado</Text>
              <Input
                placeholder="Ej. 10mo Grado"
                value={values.grade}
                onChangeText={handleChange('grade')}
                error={errors.grade}
                editable={!loading}
                leftIcon={<Ionicons name="ribbon-outline" size={20} color={theme.colors.text.tertiary} />}
                focusColor={theme.colors.student.main}
              />

              <Text style={styles.label}>Contraseña</Text>
              <Input
                placeholder="Mínimo 8 caracteres"
                value={values.password}
                onChangeText={handleChange('password')}
                error={errors.password}
                secureTextEntry
                editable={!loading}
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.tertiary} />}
                focusColor={theme.colors.student.main}
              />

              <Text style={styles.label}>Confirmar contraseña</Text>
              <Input
                placeholder="Repite tu contraseña"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                error={errors.confirmPassword}
                secureTextEntry
                editable={!loading}
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.tertiary} />}
                focusColor={theme.colors.student.main}
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
                Crear Cuenta
              </Button>

              <View style={styles.loginPrompt}>
                <Text style={styles.loginPromptText}>¿Ya tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.replace('StudentLogin')}>
                  <Text style={styles.loginLink}>Inicia sesión aquí</Text>
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
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },

  header: {
    marginBottom: 32,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 12,
    lineHeight: 34,
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
    color: theme.colors.student.main,
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
    backgroundColor: theme.colors.student.main,
    borderRadius: 28,
    height: 56,
    shadowColor: theme.colors.student.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },

  loginPromptText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },

  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.student.main,
  },
});
