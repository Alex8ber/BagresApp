/**
 * QuizEditorScreen
 * 
 * Main interface for adding, editing, deleting, and reordering quiz questions.
 * Supports three question types: single choice, multiple choice, and open-ended.
 */

import React, { useEffect, useReducer, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/shared/Button';
import { QuestionCard, QuestionWithOptions, QuizOption } from '@/components/shared/QuestionCard';
import { theme } from '@/styles/theme';
import type { RootStackScreenProps } from '@/types/navigation';
import type { Quiz } from '@/types/database';
import {
  getQuizWithQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createOption,
  updateOption,
  deleteOption,
  updateQuestionOrder,
} from '@/services/supabase/quizzes';

type Props = RootStackScreenProps<'QuizEditor'>;

// ============================================================================
// State Management with useReducer
// ============================================================================

type QuestionAction =
  | { type: 'SET_QUESTIONS'; payload: QuestionWithOptions[] }
  | { type: 'ADD_QUESTION'; payload: QuestionWithOptions }
  | { type: 'UPDATE_QUESTION'; payload: { id: string; updates: Partial<QuestionWithOptions> } }
  | { type: 'DELETE_QUESTION'; payload: string }
  | { type: 'REORDER_QUESTIONS'; payload: QuestionWithOptions[] }
  | { type: 'ADD_OPTION'; payload: { questionId: string; option: QuizOption } }
  | { type: 'UPDATE_OPTION'; payload: { questionId: string; optionId: string; updates: Partial<QuizOption> } }
  | { type: 'DELETE_OPTION'; payload: { questionId: string; optionId: string } };

function questionReducer(
  state: QuestionWithOptions[],
  action: QuestionAction
): QuestionWithOptions[] {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return action.payload;
    
    case 'ADD_QUESTION':
      return [...state, action.payload];
    
    case 'UPDATE_QUESTION':
      return state.map(q =>
        q.id === action.payload.id
          ? { ...q, ...action.payload.updates }
          : q
      );
    
    case 'DELETE_QUESTION':
      return state.filter(q => q.id !== action.payload);
    
    case 'REORDER_QUESTIONS':
      return action.payload;
    
    case 'ADD_OPTION':
      return state.map(q =>
        q.id === action.payload.questionId
          ? { ...q, options: [...q.options, action.payload.option] }
          : q
      );
    
    case 'UPDATE_OPTION':
      return state.map(q =>
        q.id === action.payload.questionId
          ? {
              ...q,
              options: q.options.map(opt =>
                opt.id === action.payload.optionId
                  ? { ...opt, ...action.payload.updates }
                  : opt
              ),
            }
          : q
      );
    
    case 'DELETE_OPTION':
      return state.map(q =>
        q.id === action.payload.questionId
          ? { ...q, options: q.options.filter(opt => opt.id !== action.payload.optionId) }
          : q
      );
    
    default:
      return state;
  }
}

// ============================================================================
// Component
// ============================================================================

export default function QuizEditorScreen({ navigation, route }: Props) {
  const { quizId, className } = route.params;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, dispatch] = useReducer(questionReducer, []);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Debounce timers for text updates
  const debounceTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // ============================================================================
  // Debounce helper
  // ============================================================================
  
  const debounce = useCallback((key: string, callback: () => void, delay: number = 500) => {
    // Clear existing timer for this key
    if (debounceTimers.current[key]) {
      clearTimeout(debounceTimers.current[key]);
    }
    
    // Set new timer
    debounceTimers.current[key] = setTimeout(() => {
      callback();
      delete debounceTimers.current[key];
    }, delay);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  // ============================================================================
  // Sub-task 5.2: Fetch quiz and questions on mount
  // ============================================================================
  
  useEffect(() => {
    fetchQuizAndQuestions();
  }, [quizId]);

  const fetchQuizAndQuestions = async () => {
    try {
      setLoading(true);
      setError(undefined);
      
      const data = await getQuizWithQuestions(quizId);
      setQuiz(data);
      dispatch({ type: 'SET_QUESTIONS', payload: data.questions });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el cuestionario';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // Sub-task 5.3: Add question functionality
  // ============================================================================
  
  const handleAddQuestion = async () => {
    try {
      const newOrderIndex = questions.length;
      
      const newQuestion = await createQuestion({
        quiz_id: quizId,
        question_text: '',
        question_type: 'single_choice',
        points: 1,
        order_index: newOrderIndex,
      });

      dispatch({
        type: 'ADD_QUESTION',
        payload: { ...newQuestion, options: [] },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al agregar pregunta';
      Alert.alert('Error', errorMessage);
    }
  };

  // ============================================================================
  // Sub-task 5.4: Edit and delete question functionality
  // ============================================================================
  
  const handleDeleteQuestion = async (questionId: string) => {
    Alert.alert(
      'Eliminar Pregunta',
      '¿Estás seguro de que deseas eliminar esta pregunta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteQuestion(questionId);
              dispatch({ type: 'DELETE_QUESTION', payload: questionId });
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : 'Error al eliminar pregunta';
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ]
    );
  };

  const handleUpdateQuestionText = (questionId: string, text: string) => {
    // Update UI immediately
    dispatch({
      type: 'UPDATE_QUESTION',
      payload: { id: questionId, updates: { question_text: text } },
    });

    // Debounce database update
    debounce(`question-text-${questionId}`, async () => {
      try {
        await updateQuestion(questionId, { question_text: text });
      } catch (err) {
        // Error updating question text
      }
    });
  };

  const handleUpdateQuestionType = async (
    questionId: string,
    type: 'single_choice' | 'multiple_choice' | 'open_ended'
  ) => {
    try {
      await updateQuestion(questionId, { question_type: type });
      dispatch({
        type: 'UPDATE_QUESTION',
        payload: { id: questionId, updates: { question_type: type } },
      });
    } catch (err) {
      // Error updating question type
    }
  };

  const handleUpdatePoints = async (questionId: string, points: number) => {
    try {
      await updateQuestion(questionId, { points });
      dispatch({
        type: 'UPDATE_QUESTION',
        payload: { id: questionId, updates: { points } },
      });
    } catch (err) {
      // Error updating points
    }
  };

  const handleUpdateExplanation = (questionId: string, text: string) => {
    // Update UI immediately
    dispatch({
      type: 'UPDATE_QUESTION',
      payload: { id: questionId, updates: { explanation: text } },
    });

    // Debounce database update
    debounce(`question-explanation-${questionId}`, async () => {
      try {
        await updateQuestion(questionId, { explanation: text });
      } catch (err) {
        // Error updating explanation
      }
    });
  };

  // ============================================================================
  // Sub-task 5.5: Drag-to-reorder functionality
  // ============================================================================
  
  const handleReorder = async (questionId: string, direction: 'up' | 'down') => {
    const currentIndex = questions.findIndex(q => q.id === questionId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= questions.length) return;

    // Create new array with swapped positions
    const newQuestions = [...questions];
    [newQuestions[currentIndex], newQuestions[newIndex]] = 
      [newQuestions[newIndex], newQuestions[currentIndex]];

    // Update order_index for both questions
    const updates = newQuestions.map((q, index) => ({
      ...q,
      order_index: index,
    }));

    dispatch({ type: 'REORDER_QUESTIONS', payload: updates });

    try {
      await updateQuestionOrder(
        updates.map(q => ({ id: q.id, order_index: q.order_index }))
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al reordenar preguntas';
      Alert.alert('Error', errorMessage);
      // Revert on error
      dispatch({ type: 'SET_QUESTIONS', payload: questions });
    }
  };

  // ============================================================================
  // Sub-task 5.6: Option management
  // ============================================================================
  
  const handleAddOption = async (questionId: string) => {
    try {
      const question = questions.find(q => q.id === questionId);
      if (!question) return;

      const newOrderIndex = question.options.length;
      
      const newOption = await createOption({
        question_id: questionId,
        option_text: '',
        is_correct: false,
        order_index: newOrderIndex,
      });

      dispatch({
        type: 'ADD_OPTION',
        payload: { questionId, option: newOption },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al agregar opción';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleDeleteOption = async (optionId: string) => {
    try {
      // Find which question this option belongs to
      const question = questions.find(q => q.options.some(opt => opt.id === optionId));
      if (!question) return;

      await deleteOption(optionId);
      dispatch({
        type: 'DELETE_OPTION',
        payload: { questionId: question.id, optionId },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar opción';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleToggleCorrect = async (optionId: string) => {
    try {
      // Find which question and option
      const question = questions.find(q => q.options.some(opt => opt.id === optionId));
      if (!question) return;

      const option = question.options.find(opt => opt.id === optionId);
      if (!option) return;

      const newIsCorrect = !option.is_correct;

      // For single_choice, uncheck all other options
      if (question.question_type === 'single_choice' && newIsCorrect) {
        // Update all options to false first
        for (const opt of question.options) {
          if (opt.id !== optionId && opt.is_correct) {
            await updateOption(opt.id, { is_correct: false });
            dispatch({
              type: 'UPDATE_OPTION',
              payload: {
                questionId: question.id,
                optionId: opt.id,
                updates: { is_correct: false },
              },
            });
          }
        }
      }

      // Update the clicked option
      await updateOption(optionId, { is_correct: newIsCorrect });
      dispatch({
        type: 'UPDATE_OPTION',
        payload: {
          questionId: question.id,
          optionId,
          updates: { is_correct: newIsCorrect },
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar opción';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleUpdateOptionText = (optionId: string, text: string) => {
    const question = questions.find(q => q.options.some(opt => opt.id === optionId));
    if (!question) return;

    // Update UI immediately
    dispatch({
      type: 'UPDATE_OPTION',
      payload: {
        questionId: question.id,
        optionId,
        updates: { option_text: text },
      },
    });

    // Debounce database update
    debounce(`option-text-${optionId}`, async () => {
      try {
        await updateOption(optionId, { option_text: text });
      } catch (err) {
        // Error updating option text
      }
    });
  };

  // ============================================================================
  // Sub-task 5.7: Client-side validation
  // ============================================================================
  
  const validateQuestions = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (questions.length === 0) {
      errors.push('Debes agregar al menos una pregunta');
      return { valid: false, errors };
    }

    questions.forEach((question, index) => {
      const questionNum = index + 1;

      // Validate question text
      if (!question.question_text.trim()) {
        errors.push(`Pregunta ${questionNum}: El texto de la pregunta es requerido`);
      }

      // Validate points
      if (question.points <= 0) {
        errors.push(`Pregunta ${questionNum}: Los puntos deben ser mayores a 0`);
      }

      // Validate options for choice questions
      if (question.question_type === 'single_choice' || question.question_type === 'multiple_choice') {
        if (question.options.length < 2) {
          errors.push(`Pregunta ${questionNum}: Debe tener al menos 2 opciones`);
        }

        const correctCount = question.options.filter(opt => opt.is_correct).length;

        if (question.question_type === 'single_choice' && correctCount !== 1) {
          errors.push(`Pregunta ${questionNum}: Debe tener exactamente una respuesta correcta`);
        }

        if (question.question_type === 'multiple_choice' && correctCount < 1) {
          errors.push(`Pregunta ${questionNum}: Debe tener al menos una respuesta correcta`);
        }

        // Check for empty option text
        question.options.forEach((opt, optIndex) => {
          if (!opt.option_text.trim()) {
            errors.push(`Pregunta ${questionNum}, Opción ${optIndex + 1}: El texto es requerido`);
          }
        });
      }

      // Validate open-ended questions have no options
      if (question.question_type === 'open_ended' && question.options.length > 0) {
        errors.push(`Pregunta ${questionNum}: Las preguntas abiertas no deben tener opciones`);
      }
    });

    return { valid: errors.length === 0, errors };
  };

  // ============================================================================
  // Sub-task 5.9: Save functionality
  // ============================================================================
  
  const handleSave = async () => {
    // Wait for any pending debounced updates to complete
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const validation = validateQuestions();
    
    if (!validation.valid) {
      Alert.alert(
        'Errores de Validación',
        validation.errors.join('\n\n'),
        [
          {
            text: 'Guardar de Todos Modos',
            onPress: () => {
              navigation.goBack();
            },
          },
          {
            text: 'Seguir Editando',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    // If validation passes, just go back
    navigation.goBack();
  };

  // ============================================================================
  // Render
  // ============================================================================

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.teacher.main} />
          <Text style={styles.loadingText}>Cargando cuestionario...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !quiz) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={theme.colors.error.main} />
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Button
            variant="primary"
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
          >
            Volver
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quiz Header */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.classLabel}>Clase: {className}</Text>
            <Text style={styles.quizTitle}>{quiz?.title}</Text>
          </View>
        </View>

        {/* Questions List */}
        <View style={styles.questionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Preguntas ({questions.length})</Text>
          </View>

          {questions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={64} color={theme.colors.text.tertiary} />
              <Text style={styles.emptyTitle}>No hay preguntas</Text>
              <Text style={styles.emptyText}>
                Agrega preguntas para comenzar a construir tu cuestionario
              </Text>
            </View>
          ) : (
            questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                editable={true}
                onDelete={handleDeleteQuestion}
                onReorder={(direction) => handleReorder(question.id, direction)}
                onAddOption={handleAddOption}
                onDeleteOption={handleDeleteOption}
                onToggleCorrect={handleToggleCorrect}
                onUpdateQuestionText={handleUpdateQuestionText}
                onUpdateQuestionType={handleUpdateQuestionType}
                onUpdatePoints={handleUpdatePoints}
                onUpdateExplanation={handleUpdateExplanation}
                onUpdateOptionText={handleUpdateOptionText}
                showReorderButtons={true}
              />
            ))
          )}

          {/* Add Question Button */}
          <TouchableOpacity
            style={styles.addQuestionButton}
            onPress={handleAddQuestion}
            activeOpacity={theme.opacity.pressed}
          >
            <Ionicons name="add-circle" size={24} color={theme.colors.teacher.main} />
            <Text style={styles.addQuestionText}>Agregar Pregunta</Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <Button
          variant="primary"
          size="large"
          fullWidth
          onPress={handleSave}
          loading={saving}
          style={styles.saveButton}
        >
          Guardar y Volver
        </Button>

        <Button
          variant="secondary"
          size="large"
          fullWidth
          onPress={() => navigation.goBack()}
          disabled={saving}
          style={styles.cancelButton}
        >
          Cancelar
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// Styles
// ============================================================================

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
  errorButton: {
    marginTop: 24,
  },
  header: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.teacher.main,
  },
  headerInfo: {
    gap: 4,
  },
  classLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.teacher.main,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  questionsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
  addQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.teacher.main,
    borderStyle: 'dashed',
    backgroundColor: '#F5F7FA',
    gap: 8,
  },
  addQuestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.teacher.main,
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: theme.colors.teacher.main,
  },
  cancelButton: {
    marginTop: 12,
  },
});
