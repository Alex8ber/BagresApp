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
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
        // Navigation is handled by auth state change
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed');
      }
    },
  });

  const handleGoToRegister = () => {
    navigation.replace('StudentRegister');
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
              <Text style={styles.iconEmoji}>👨‍🎓</Text>
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Hola, estudiante</Text>
              <Text style={styles.subtitle}>
                Ingresa tus datos para unirte{'\n'}a una clase
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Text style={styles.label}>Nombre / Usuario</Text>
              <Input
                placeholder="Ej. Juan Pérez"
                value={values.username}
                onChangeText={handleChange('username')}
                error={errors.username}
                autoCapitalize="words"
                editable={!loading}
                leftIcon={<Ionicons name="person-outline" size={20} color={theme.colors.text.tertiary} />}
                focusColor={theme.colors.student.main}
              />

              <Text style={styles.label}>Código de Clase</Text>
              <Input
                placeholder="6 caracteres (Ej. AB12CD)"
                value={values.classCode}
                onChangeText={handleChange('classCode')}
                error={errors.classCode}
                maxLength={6}
                autoCapitalize="characters"
                editable={!loading}
                leftIcon={<Ionicons name="key-outline" size={20} color={theme.colors.text.tertiary} />}
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
                Iniciar Sesión
              </Button>

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
    backgroundColor: '#E8F5E9',
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
    color: theme.colors.student.main,
  },
});
