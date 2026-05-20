/**
 * TeacherSubmissionDetailScreen
 * 
 * Shows detailed view of a student's quiz submission with all questions and answers.
 * Displays correct/incorrect answers and allows teachers to review student performance.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackScreenProps } from '@/types/navigation';
import { theme } from '@/styles';
import { getQuizWithQuestions } from '@/services/supabase/quizzes';
import { supabase } from '@/services/supabase/client';

type Props = RootStackScreenProps<'TeacherSubmissionDetail'>;

interface SubmissionDetail {
  id: string;
  student_id: string;
  quiz_id: string;
  answers: Array<{
    question_id: string;
    selected_options: string[];
  }>;
  submitted_at: string;
}

export default function TeacherSubmissionDetailScreen({ navigation, route }: Props) {
  const { submissionId, quizId, studentName, score } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [quiz, setQuiz] = useState<any>(null);

  useEffect(() => {
    loadSubmissionDetail();
  }, []);

  const loadSubmissionDetail = async () => {
    try {
      setLoading(true);

      // Load submission
      const { data: submissionData, error: submissionError } = await supabase
        .from('quiz_submissions')
        .select('*')
        .eq('id', submissionId)
        .single();

      if (submissionError) {
        console.error('Error loading submission:', submissionError);
        return;
      }

      setSubmission(submissionData);

      // Load quiz with questions and options
      const quizData = await getQuizWithQuestions(quizId);
      setQuiz(quizData);
    } catch (error) {
      console.error('Error loading submission detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAnswerStatus = (questionId: string) => {
    if (!submission || !quiz) return null;

    const answer = submission.answers.find((a: any) => a.question_id === questionId);
    if (!answer || !answer.selected_options || answer.selected_options.length === 0) {
      return { status: 'unanswered', selectedOptionId: null };
    }

    const question = quiz.questions.find((q: any) => q.id === questionId);
    if (!question) return null;

    const selectedOptionId = answer.selected_options[0];
    const selectedOption = question.options.find((opt: any) => opt.id === selectedOptionId);

    return {
      status: selectedOption?.is_correct ? 'correct' : 'incorrect',
      selectedOptionId,
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.teacher.main} />
          <Text style={styles.loadingText}>Cargando respuestas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!submission || !quiz) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No se pudo cargar la información</Text>
        </View>
      </SafeAreaView>
    );
  }

  const correctAnswers = quiz.questions.filter((q: any) => {
    const status = getAnswerStatus(q.id);
    return status?.status === 'correct';
  }).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Score Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Puntaje</Text>
            <Text style={styles.summaryValue}>{score} pts</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Correctas</Text>
            <Text style={[styles.summaryValue, { color: '#34A853' }]}>
              {correctAnswers}/{quiz.questions.length}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Fecha</Text>
            <Text style={styles.summaryValueSmall}>
              {formatDate(submission.submitted_at)}
            </Text>
          </View>
        </View>
      </View>

      {/* Questions and Answers */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {quiz.questions.map((question: any, index: number) => {
          const answerStatus = getAnswerStatus(question.id);
          const isCorrect = answerStatus?.status === 'correct';
          const isIncorrect = answerStatus?.status === 'incorrect';
          const isUnanswered = answerStatus?.status === 'unanswered';

          return (
            <View key={question.id} style={styles.questionCard}>
              {/* Question Header */}
              <View style={styles.questionHeader}>
                <View style={styles.questionNumberBadge}>
                  <Text style={styles.questionNumber}>{index + 1}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    isCorrect && styles.statusBadgeCorrect,
                    isIncorrect && styles.statusBadgeIncorrect,
                    isUnanswered && styles.statusBadgeUnanswered,
                  ]}
                >
                  <Ionicons
                    name={
                      isCorrect
                        ? 'checkmark-circle'
                        : isIncorrect
                        ? 'close-circle'
                        : 'help-circle'
                    }
                    size={16}
                    color={
                      isCorrect
                        ? '#34A853'
                        : isIncorrect
                        ? '#EA4335'
                        : '#999'
                    }
                  />
                  <Text
                    style={[
                      styles.statusText,
                      isCorrect && styles.statusTextCorrect,
                      isIncorrect && styles.statusTextIncorrect,
                      isUnanswered && styles.statusTextUnanswered,
                    ]}
                  >
                    {isCorrect
                      ? 'Correcta'
                      : isIncorrect
                      ? 'Incorrecta'
                      : 'Sin responder'}
                  </Text>
                </View>
              </View>

              {/* Question Text */}
              <Text style={styles.questionText}>{question.question_text}</Text>

              {/* Options */}
              <View style={styles.optionsContainer}>
                {question.options.map((option: any, optIndex: number) => {
                  const isSelected = answerStatus?.selectedOptionId === option.id;
                  const isCorrectOption = option.is_correct;
                  const optionLetter = String.fromCharCode(65 + optIndex);

                  return (
                    <View
                      key={option.id}
                      style={[
                        styles.optionCard,
                        isSelected && styles.optionCardSelected,
                        isSelected && isCorrectOption && styles.optionCardCorrect,
                        isSelected && !isCorrectOption && styles.optionCardIncorrect,
                        !isSelected && isCorrectOption && styles.optionCardCorrectAnswer,
                      ]}
                    >
                      <View
                        style={[
                          styles.optionBubble,
                          isSelected && styles.optionBubbleSelected,
                          isSelected && isCorrectOption && styles.optionBubbleCorrect,
                          isSelected && !isCorrectOption && styles.optionBubbleIncorrect,
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionLetter,
                            isSelected && styles.optionLetterSelected,
                          ]}
                        >
                          {optionLetter}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {option.option_text}
                      </Text>
                      {isSelected && (
                        <Ionicons
                          name={isCorrectOption ? 'checkmark-circle' : 'close-circle'}
                          size={20}
                          color={isCorrectOption ? '#34A853' : '#EA4335'}
                        />
                      )}
                      {!isSelected && isCorrectOption && (
                        <View style={styles.correctAnswerBadge}>
                          <Text style={styles.correctAnswerText}>Correcta</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  // Summary Card
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '600',
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  summaryValueSmall: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Question Card
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  questionNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F0FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.teacher.main,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusBadgeCorrect: {
    backgroundColor: '#E6F4EA',
  },
  statusBadgeIncorrect: {
    backgroundColor: '#FCE8E6',
  },
  statusBadgeUnanswered: {
    backgroundColor: '#F5F5F5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusTextCorrect: {
    color: '#34A853',
  },
  statusTextIncorrect: {
    color: '#EA4335',
  },
  statusTextUnanswered: {
    color: '#999',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    lineHeight: 24,
    marginBottom: 16,
  },

  // Options
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    backgroundColor: '#fff',
  },
  optionCardCorrect: {
    borderColor: '#34A853',
    backgroundColor: '#E6F4EA',
  },
  optionCardIncorrect: {
    borderColor: '#EA4335',
    backgroundColor: '#FCE8E6',
  },
  optionCardCorrectAnswer: {
    borderColor: '#34A853',
    borderStyle: 'dashed',
  },
  optionBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionBubbleSelected: {
    backgroundColor: '#CBD5E0',
  },
  optionBubbleCorrect: {
    backgroundColor: '#34A853',
  },
  optionBubbleIncorrect: {
    backgroundColor: '#EA4335',
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
  },
  optionLetterSelected: {
    color: '#fff',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  correctAnswerBadge: {
    backgroundColor: '#34A853',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  correctAnswerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
});
