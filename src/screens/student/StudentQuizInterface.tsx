/**
 * StudentQuizInterface
 * 
 * Interface for students to take quizzes with countdown timer and auto-submit.
 * Displays questions based on type (radio/checkbox/text) and manages answer state.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 8.1, 8.2, 8.4, 8.5, 1.4
 * 
 * **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 1.4**
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/styles';
import type { RootStackScreenProps } from '@/types/navigation';
import { getQuizWithQuestions, type QuizWithQuestions } from '@/services/supabase/quizzes';
import { submitQuiz as submitQuizService } from '@/services/autoSubmit';
import { useAuth } from '@/context/AuthContext';

type Props = RootStackScreenProps<'StudentQuiz'>;

interface Answer {
  questionId: string;
  questionType: 'single_choice' | 'multiple_choice' | 'open_ended';
  selectedOptions?: string[]; // option IDs for choice questions
  textAnswer?: string; // for open-ended questions
}

/**
 * StudentQuizInterface Component
 * 
 * Allows students to take quizzes with timer and auto-submit functionality.
 */
export default function StudentQuizInterface({ route, navigation }: Props) {
  const { quizId } = route.params;
  const { user } = useAuth();

  // State
  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null);
  const [answers, setAnswers] = useState<Map<string, Answer>>(new Map());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0); // in seconds
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  // Fetch quiz and questions on mount
  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  // Timer countdown with auto-submit
  useEffect(() => {
    if (timeRemaining <= 0 || submitted || !quiz) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto-submit when time expires
          autoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, submitted, quiz]);

  /**
   * Fetch quiz and filter by availability
   * Sub-task 10.2
   */
  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError(undefined);

      const quizData = await getQuizWithQuestions(quizId);

      // Check if quiz is available (published and within time window)
      const now = new Date();
      const availableFrom = quizData.available_from ? new Date(quizData.available_from) : null;
      const availableUntil = quizData.available_until ? new Date(quizData.available_until) : null;

      if (!quizData.is_published) {
        setError('Este cuestionario no está disponible');
        return;
      }

      if (availableFrom && now < availableFrom) {
        setError('Este cuestionario aún no está disponible');
        return;
      }

      if (availableUntil && now > availableUntil) {
        setError('Este cuestionario ya no está disponible');
        return;
      }

      setQuiz(quizData);

      // Initialize timer if duration is set
      if (quizData.duration_minutes) {
        setTimeRemaining(quizData.duration_minutes * 60);
      }
    } catch (err) {
      setError('Error al cargar el cuestionario');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle answer change for a question
   * Sub-task 10.7
   */
  const handleAnswerChange = (
    questionId: string,
    questionType: 'single_choice' | 'multiple_choice' | 'open_ended',
    value: string | string[]
  ) => {
    if (submitted) return; // Prevent changes after submission

    const newAnswers = new Map(answers);

    if (questionType === 'single_choice') {
      newAnswers.set(questionId, {
        questionId,
        questionType,
        selectedOptions: [value as string],
      });
    } else if (questionType === 'multiple_choice') {
      const currentAnswer = newAnswers.get(questionId);
      const currentSelected = currentAnswer?.selectedOptions || [];
      const optionId = value as string;

      // Toggle option
      const newSelected = currentSelected.includes(optionId)
        ? currentSelected.filter(id => id !== optionId)
        : [...currentSelected, optionId];

      newAnswers.set(questionId, {
        questionId,
        questionType,
        selectedOptions: newSelected,
      });
    } else if (questionType === 'open_ended') {
      newAnswers.set(questionId, {
        questionId,
        questionType,
        textAnswer: value as string,
      });
    }

    setAnswers(newAnswers);
  };

  /**
   * Manual submit functionality
   * Sub-task 10.8
   */
  const handleSubmit = () => {
    Alert.alert(
      'Enviar Cuestionario',
      '¿Estás seguro de que quieres enviar tus respuestas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: () => submitQuiz(false),
        },
      ]
    );
  };

  /**
   * Auto-submit when timer expires
   */
  const autoSubmit = () => {
    submitQuiz(true);
  };

  /**
   * Submit quiz answers
   */
  const submitQuiz = async (autoSubmitted: boolean) => {
    if (!user) {
      Alert.alert('Error', 'No se pudo identificar al usuario');
      return;
    }

    try {
      setSubmitted(true);

      // Prepare answers array
      const answersArray = Array.from(answers.values()).map(answer => ({
        question_id: answer.questionId,
        selected_options: answer.selectedOptions,
        text_answer: answer.textAnswer,
      }));

      // Submit using the autoSubmit service
      await submitQuizService({
        quiz_id: quizId,
        student_id: user.id,
        answers: answersArray,
        submitted_at: new Date().toISOString(),
        auto_submitted: autoSubmitted,
      });

      // Show success message
      Alert.alert(
        autoSubmitted ? 'Tiempo Agotado' : 'Cuestionario Enviado',
        autoSubmitted
          ? 'Tiempo agotado - Cuestionario enviado automáticamente'
          : 'Tus respuestas han sido enviadas correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err) {
      Alert.alert('Error', 'No se pudo enviar el cuestionario. Intenta de nuevo.');
      setSubmitted(false);
    }
  };

  /**
   * Format time remaining as MM:SS
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Navigate to next question
   */
  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  /**
   * Navigate to previous question
   */
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.student.main} />
          <Text style={styles.loadingText}>Cargando cuestionario...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !quiz) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={64} color={theme.colors.error.main} />
          <Text style={styles.errorText}>{error || 'Cuestionario no encontrado'}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = answers.get(currentQuestion.id);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with timer */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={submitted}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{quiz.title}</Text>
          {quiz.duration_minutes && (
            <View style={[
              styles.timerBadge,
              timeRemaining < 60 && styles.timerBadgeWarning
            ]}>
              <Ionicons
                name="time"
                size={16}
                color={timeRemaining < 60 ? theme.colors.error.main : '#fff'}
              />
              <Text style={[
                styles.timerText,
                timeRemaining < 60 && styles.timerTextWarning
              ]}>
                {formatTime(timeRemaining)}
              </Text>
            </View>
          )}
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Question progress */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Pregunta {currentQuestionIndex + 1} de {quiz.questions.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }
            ]}
          />
        </View>
      </View>

      {/* Question content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionText}>{currentQuestion.question_text}</Text>
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsText}>{currentQuestion.points} pts</Text>
            </View>
          </View>

          {/* Render question based on type - Sub-task 10.5 */}
          {currentQuestion.question_type === 'single_choice' && (
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option) => {
                const isSelected = currentAnswer?.selectedOptions?.includes(option.id);
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => handleAnswerChange(currentQuestion.id, 'single_choice', option.id)}
                    disabled={submitted}
                  >
                    <View style={[styles.radio, isSelected && styles.radioSelected]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {option.option_text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {currentQuestion.question_type === 'multiple_choice' && (
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option) => {
                const isSelected = currentAnswer?.selectedOptions?.includes(option.id);
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => handleAnswerChange(currentQuestion.id, 'multiple_choice', option.id)}
                    disabled={submitted}
                  >
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
                    </View>
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {option.option_text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {currentQuestion.question_type === 'open_ended' && (
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Escribe tu respuesta aquí..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={6}
                value={currentAnswer?.textAnswer || ''}
                onChangeText={(text) => handleAnswerChange(currentQuestion.id, 'open_ended', text)}
                editable={!submitted}
                textAlignVertical="top"
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.footer}>
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
            onPress={handlePrevious}
            disabled={currentQuestionIndex === 0 || submitted}
          >
            <Ionicons name="chevron-back" size={20} color={currentQuestionIndex === 0 ? '#999' : theme.colors.student.main} />
            <Text style={[styles.navButtonText, currentQuestionIndex === 0 && styles.navButtonTextDisabled]}>
              Anterior
            </Text>
          </TouchableOpacity>

          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleNext}
              disabled={submitted}
            >
              <Text style={styles.navButtonText}>Siguiente</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.student.main} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.submitButton, submitted && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={submitted}
            >
              <Text style={styles.submitButtonText}>
                {submitted ? 'Enviado' : 'Enviar Cuestionario'}
              </Text>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  centerContainer: {
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

  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },

  backButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: theme.colors.student.main,
    borderRadius: 8,
  },

  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },

  // Header
  header: {
    backgroundColor: theme.colors.student.main,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },

  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },

  timerBadgeWarning: {
    backgroundColor: '#fff',
  },

  timerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },

  timerTextWarning: {
    color: theme.colors.error.main,
  },

  // Progress
  progressContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },

  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.student.main,
    borderRadius: 3,
  },

  // Content
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },

  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    ...theme.shadows.md,
  },

  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  questionText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    lineHeight: 26,
    marginRight: 12,
  },

  pointsBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },

  pointsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F57C00',
  },

  // Options
  optionsContainer: {
    gap: 12,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  optionSelected: {
    backgroundColor: '#E6F4EA',
    borderColor: theme.colors.student.main,
  },

  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E0',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioSelected: {
    borderColor: theme.colors.student.main,
  },

  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.student.main,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E0',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxSelected: {
    backgroundColor: theme.colors.student.main,
    borderColor: theme.colors.student.main,
  },

  optionText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },

  optionTextSelected: {
    fontWeight: '600',
    color: theme.colors.student.dark,
  },

  // Text input
  textInputContainer: {
    marginTop: 8,
  },

  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text.primary,
    minHeight: 120,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },

  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
  },

  navButtonDisabled: {
    opacity: 0.4,
  },

  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.student.main,
  },

  navButtonTextDisabled: {
    color: '#999',
  },

  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.student.main,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },

  submitButtonDisabled: {
    backgroundColor: '#CBD5E0',
  },

  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
