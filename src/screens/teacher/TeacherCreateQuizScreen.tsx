/**
 * TeacherCreateQuizScreen
 * 
 * Screen for creating quizzes/tests for a specific class.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { useForm } from '@/hooks/useForm';
import { validateRequired } from '@/utils/validation';
import { theme } from '@/styles/theme';
import type { RootStackScreenProps } from '@/types/navigation';
import { createQuiz } from '@/services';

type Props = RootStackScreenProps<'TeacherCreateQuiz'>;

interface QuizFormData {
  title: string;
  description: string;
  duration_minutes: string;
  passing_score: string;
}

interface QuizFormErrors {
  title?: string;
  duration_minutes?: string;
  passing_score?: string;
}

export default function TeacherCreateQuizScreen({ navigation, route }: Props) {
  const { classId, className } = route.params;
  const [error, setError] = useState<string | undefined>();

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm<QuizFormData>({
    initialValues: {
      title: '',
      description: '',
      duration_minutes: '30',
      passing_score: '70',
    },
    validate: (values) => {
      const errors: QuizFormErrors = {};
      
      const titleError = validateRequired(values.title, 'Título');
      if (titleError) {
        errors.title = titleError;
      }
      
      const duration = parseInt(values.duration_minutes);
      if (isNaN(duration) || duration < 1) {
        errors.duration_minutes = 'Duración debe ser mayor a 0';
      }
      
      const score = parseInt(values.passing_score);
      if (isNaN(score) || score < 0 || score > 100) {
        errors.passing_score = 'Calificación debe estar entre 0 y 100';
      }
      
      return errors;
    },
    onSubmit: async (data) => {
      try {
        setError(undefined);

        const newQuiz = await createQuiz({
          class_id: classId,
          title: data.title,
          description: data.description || null,
          duration_minutes: parseInt(data.duration_minutes),
          passing_score: parseInt(data.passing_score),
          available_from: null,
          available_until: null,
          is_published: false,
        });

        // Navigate to QuizEditor to add questions
        navigation.replace('QuizEditor', {
          quizId: newQuiz.id,
          classId: classId,
          className: className,
        });
      } catch (err) {
        console.error('[TeacherCreateQuizScreen] Error creating quiz:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error al crear el cuestionario';
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
      }
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Class Info */}
        <View style={styles.classInfo}>
          <Text style={styles.classLabel}>Clase seleccionada</Text>
          <Text style={styles.className}>{className}</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Información del Cuestionario</Text>

          <Text style={styles.label}>Título *</Text>
          <Input
            placeholder="Ej: Examen de Matemáticas - Unidad 1"
            value={values.title}
            onChangeText={handleChange('title')}
            error={errors.title}
            editable={!isSubmitting}
            focusColor={theme.colors.teacher.main}
          />

          <Text style={styles.label}>Descripción</Text>
          <Input
            placeholder="Describe el contenido del cuestionario..."
            value={values.description}
            onChangeText={handleChange('description')}
            editable={!isSubmitting}
            multiline
            numberOfLines={3}
            focusColor={theme.colors.teacher.main}
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Duración (minutos) *</Text>
              <Input
                placeholder="30"
                value={values.duration_minutes}
                onChangeText={handleChange('duration_minutes')}
                error={errors.duration_minutes}
                editable={!isSubmitting}
                keyboardType="number-pad"
                focusColor={theme.colors.teacher.main}
              />
            </View>

            <View style={styles.halfWidth}>
              <Text style={styles.label}>Calificación mínima (%) *</Text>
              <Input
                placeholder="70"
                value={values.passing_score}
                onChangeText={handleChange('passing_score')}
                error={errors.passing_score}
                editable={!isSubmitting}
                keyboardType="number-pad"
                focusColor={theme.colors.teacher.main}
              />
            </View>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color={theme.colors.teacher.main} />
            <Text style={styles.infoText}>
              El cuestionario se creará como borrador. Podrás agregar preguntas y publicarlo después.
            </Text>
          </View>

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
            loading={isSubmitting}
            style={styles.submitButton}
          >
            Crear Cuestionario
          </Button>

          <Button
            variant="secondary"
            size="large"
            fullWidth
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
            style={styles.cancelButton}
          >
            Cancelar
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  classInfo: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.teacher.main,
  },
  classLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.teacher.main,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  className: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 8,
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: theme.colors.teacher.main,
  },
  cancelButton: {
    marginTop: 12,
  },
});
