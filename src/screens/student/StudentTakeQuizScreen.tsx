/**
 * StudentTakeQuizScreen
 * 
 * Screen for students to take a quiz, answer questions, and submit.
 * Includes timer, question navigation, and auto-submit on timeout.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/styles';
import type { RootStackScreenProps } from '@/types/navigation';
import { getQuizWithQuestions } from '@/services/supabase/quizzes';
import type { QuizWithQuestions } from '@/services/supabase/quizzes';
import { getQuizSubmission, submitQuiz as saveQuizSubmission, calculateSubmissionScore } from '@/services/supabase/students';
import { supabase } from '@/services/supabase/client';

type Props = RootStackScreenProps<'StudentTakeQuiz'>;

interface Answer {
  questionId: string;
  selectedOptionId: string;
}

export default function StudentTakeQuizScreen({ navigation, route }: Props) {
  const { quizId } = route.params;
  const { profile } = useAuth();
  
  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadQuiz();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (quiz && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [quiz, timeRemaining]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      
      // Check if student already completed this quiz
      if (profile?.id) {
        const existingSubmission = await getQuizSubmission(profile.id, quizId);
        
        if (existingSubmission) {
          // Calculate score from submission
          const { score, correctAnswers, totalQuestions } = await calculateSubmissionScore(existingSubmission, quizId);
          
          // Get quiz data for title and passing score
          const quizData = await getQuizWithQuestions(quizId);
          
          // Quiz already completed, redirect to results
          navigation.replace('StudentQuizResults', {
            quizId: quizData.id,
            quizTitle: quizData.title,
            score,
            correctAnswers,
            totalQuestions,
            passed: score >= (quizData.passing_score || 70),
            passingScore: quizData.passing_score || 70,
          });
          return;
        }
      }
      
      const quizData = await getQuizWithQuestions(quizId);
      setQuiz(quizData);
      
      // Set timer (convert minutes to seconds)
      if (quizData.duration_minutes) {
        setTimeRemaining(quizData.duration_minutes * 60);
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      Alert.alert('Error', 'No se pudo cargar el quiz');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId);
      if (existing) {
        return prev.map((a) =>
          a.questionId === questionId ? { ...a, selectedOptionId: optionId } : a
        );
      }
      return [...prev, { questionId, selectedOptionId: optionId }];
    });
  };

  const getSelectedOption = (questionId: string): string | undefined => {
    return answers.find((a) => a.questionId === questionId)?.selectedOptionId;
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAutoSubmit = () => {
    Alert.alert(
      'Tiempo agotado',
      'El tiempo del quiz ha terminado. Se enviarán tus respuestas automáticamente.',
      [{ text: 'OK', onPress: () => submitQuiz() }]
    );
  };

  const handleSubmit = () => {
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }
    
    if (!quiz) {
      return;
    }

    // Submit directly without confirmation
    submitQuiz();
  };

  const submitQuiz = async () => {
    if (!quiz || !profile) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate score
      let correctAnswers = 0;
      const totalQuestions = quiz.questions.length;

      quiz.questions.forEach((question) => {
        const answer = answers.find((a) => a.questionId === question.id);
        if (answer) {
          const selectedOption = question.options.find(
            (opt) => opt.id === answer.selectedOptionId
          );
          if (selectedOption?.is_correct) {
            correctAnswers++;
          }
        }
      });

      const score = Math.round((correctAnswers / totalQuestions) * 100);
      const passed = score >= (quiz.passing_score || 70);

      // Save submission to database
      try {
        await saveQuizSubmission(
          profile.id,
          quiz.id,
          answers
        );

        // Notify teacher about quiz completion
        try {
          const { notifyTeacherQuizCompleted } = await import('@/services/supabase/notifications');
          
          // Get teacher ID from quiz
          const { data: quizData } = await supabase
            .from('quizzes')
            .select('teacher_id')
            .eq('id', quiz.id)
            .single();

          if (quizData?.teacher_id) {
            await notifyTeacherQuizCompleted(
              quizData.teacher_id,
              profile.full_name || 'Un estudiante',
              quiz.title,
              score,
              quiz.id
            );
          }
        } catch (notifError) {
          console.error('Error sending notification:', notifError);
          // Don't block submission if notification fails
        }
      } catch (dbError) {
        console.error('Error saving submission:', dbError);
        // Continue to results even if save fails
      }

      // Navigate to results screen
      navigation.replace('StudentQuizResults', {
        quizId: quiz.id,
        quizTitle: quiz.title,
        score,
        correctAnswers,
        totalQuestions,
        passed,
        passingScore: quiz.passing_score || 70,
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setIsSubmitting(false);
      Alert.alert('Error', 'No se pudo enviar el quiz. Por favor intenta de nuevo.');
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.student.main} />
          <Text style={styles.loadingText}>Cargando quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Este quiz no tiene preguntas</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.timerContainer}>
            <Ionicons name="time-outline" size={20} color="#fff" />
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Pregunta {currentQuestionIndex + 1} de {quiz.questions.length}
          </Text>
        </View>
      </View>

      {/* Question */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>Pregunta {currentQuestionIndex + 1}</Text>
          <Text style={styles.questionText}>{currentQuestion.question_text}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = getSelectedOption(currentQuestion.id) === option.id;
            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D

            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                onPress={() => handleSelectOption(currentQuestion.id, option.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.optionBubble, isSelected && styles.optionBubbleSelected]}>
                  <Text style={[styles.optionLetter, isSelected && styles.optionLetterSelected]}>
                    {optionLetter}
                  </Text>
                </View>
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {option.option_text}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.student.main} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={currentQuestionIndex === 0 ? '#ccc' : theme.colors.student.main}
          />
          <Text
            style={[
              styles.navButtonText,
              currentQuestionIndex === 0 && styles.navButtonTextDisabled,
            ]}
          >
            Anterior
          </Text>
        </TouchableOpacity>

        {isLastQuestion ? (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Enviar Quiz</Text>
                <Ionicons name="checkmark" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.navButton} onPress={handleNext}>
            <Text style={styles.navButtonText}>Siguiente</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.student.main} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: theme.colors.student.main,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: theme.colors.student.main,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  timerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
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
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.student.main,
    marginBottom: 12,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: theme.colors.student.main,
    backgroundColor: '#E8F5E9',
  },
  optionBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionBubbleSelected: {
    backgroundColor: theme.colors.student.main,
  },
  optionLetter: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },
  optionLetterSelected: {
    color: '#fff',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
  optionTextSelected: {
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  navigation: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    gap: 8,
  },
  navButtonDisabled: {
    backgroundColor: '#F5F5F5',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.student.main,
  },
  navButtonTextDisabled: {
    color: '#ccc',
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: theme.colors.student.main,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
