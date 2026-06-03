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
  fullName: string;
  classCode: string;
}

interface StudentLoginFormErrors {
  fullName?: string;
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
      fullName: '',
      classCode: '',
    },
    validate: (values) => {
      const errors: StudentLoginFormErrors = {};
      
      const nameError = validateRequired(values.fullName, 'Nombre');
      if (nameError) {
        errors.fullName = nameError;
      }
      
      const classCodeError = validateRequired(values.classCode, 'Código de clase');
      if (classCodeError) {
        errors.classCode = classCodeError;
      } else if (values.classCode.length !== 6) {
        errors.classCode = 'El código debe tener 6 caracteres';
      }
      
      return errors;
    },
    onSubmit: async (data) => {
      try {
        setError(undefined);
        // For student login, pass full name and class code
        await signIn(data.fullName, data.classCode, 'student');
        // Navigation is handled by auth state change
      } catch (err) {
        // Extract user-friendly error message
        let errorMessage = 'Error al unirse a la clase';
        
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        
        // Show specific error for invalid class code
        if (errorMessage.includes('inválido') || errorMessage.includes('invalid')) {
          errorMessage = 'Código de clase inválido. Verifica con tu profesor.';
        } else if (errorMessage.includes('nombre') || errorMessage.includes('name')) {
          errorMessage = 'Por favor verifica tu nombre e intenta de nuevo.';
        }
        
        setError(errorMessage);
        // Don't re-throw the error to prevent navigation away from this screen
      }
    },
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
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
              <Text style={styles.title}>¡Únete a tu clase!</Text>
              <Text style={styles.subtitle}>
                Ingresa tu nombre y el código{'\n'}que te dio tu profesor
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Text style={styles.label}>Tu nombre</Text>
              <Input
                placeholder="Ej: Juan Pérez"
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                error={errors.fullName}
                autoCapitalize="words"
                editable={!loading}
                leftIcon={<Ionicons name="person-outline" size={20} color={theme.colors.text.tertiary} />}
                focusColor={theme.colors.student.main}
              />

              <Text style={styles.label}>Código de clase</Text>
              <Input
                placeholder="ABC123"
                value={values.classCode}
                onChangeText={(text) => handleChange('classCode')(text.toUpperCase())}
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

              <TouchableOpacity
                style={[styles.button, styles.loginButton, styles.studentLoginButton]}
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={loading}
              >
                {loading ? (
                  <Text style={styles.loginButtonText}>Cargando...</Text>
                ) : (
                  <Text style={styles.loginButtonText}>Unirme</Text>
                )}
              </TouchableOpacity>

              {/* Back Button */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                disabled={loading}
              >
                <Ionicons name="arrow-back" size={20} color={theme.colors.student.main} />
                <Text style={styles.backButtonText}>Volver</Text>
              </TouchableOpacity>
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
    backgroundColor: '#F0F9F4',
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

  button: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  loginButton: {
    backgroundColor: '#fff',
  },

  studentLoginButton: {
    backgroundColor: theme.colors.student.main,
  },

  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
    gap: 8,
  },

  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.student.main,
  },
});
