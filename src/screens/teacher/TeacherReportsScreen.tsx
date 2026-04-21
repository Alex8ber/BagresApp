/**
 * TeacherReportsScreen
 * 
 * Screen for reviewing and managing student test scores.
 * Shows quiz submissions from students with their answers and scores.
 * 
 * Requirements: 1.9, 5.3, 5.9, 10.14, 11.1, 11.9
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackScreenProps } from '@/types/navigation';
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/styles';
import { getTeacherQuizzes } from '@/services/supabase/quizzes';
import { getQuizSubmissions, calculateSubmissionScore } from '@/services/supabase/students';
import type { Teacher } from '@/types/models';

// ============================================================================
// Types
// ============================================================================

interface QuizSubmission {
  id: string;
  student_id: string;
  quiz_id: string;
  answers: Array<{
    question_id: string;
    selected_options: string[];
  }>;
  submitted_at: string;
  students: {
    full_name: string;
  };
}

interface QuizReport {
  id: string;
  title: string;
  submissionCount: number;
  totalQuestions: number;
  submissions: QuizSubmission[];
  submissionScores: Record<string, { score: number; correctAnswers: number; totalQuestions: number }>;
}

type Props = RootStackScreenProps<'TeacherReports'>;

// ============================================================================
// Component
// ============================================================================

export default function TeacherReportsScreen({ navigation, route }: Props) {
  const { profile } = useAuth();
  const teacherProfile = profile as Teacher | null;
  
  const [loading, setLoading] = useState(true);
  const [quizReports, setQuizReports] = useState<QuizReport[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizReport | null>(null);

  useEffect(() => {
    loadReports();
  }, [teacherProfile]);

  const loadReports = async () => {
    if (!teacherProfile?.id) {
      return;
    }

    try {
      setLoading(true);

      // Get all quizzes for this teacher
      const quizzes = await getTeacherQuizzes(teacherProfile.id);

      // Get submissions for each quiz and calculate scores
      const reportsPromises = quizzes.map(async (quiz) => {
        const submissions = await getQuizSubmissions(quiz.id);
        
        // Calculate scores for all submissions
        const scores: Record<string, any> = {};
        for (const submission of submissions) {
          const scoreData = await calculateSubmissionScore(submission, quiz.id);
          scores[submission.id] = scoreData;
        }
        
        return {
          id: quiz.id,
          title: quiz.title,
          submissionCount: submissions.length,
          totalQuestions: 0,
          submissions,
          submissionScores: scores,
        };
      });

      const reports = await Promise.all(reportsPromises);
      setQuizReports(reports);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderQuizCard = ({ item }: { item: QuizReport }) => {
    return (
      <TouchableOpacity
        style={styles.quizCard}
        onPress={() => setSelectedQuiz(item)}
        activeOpacity={0.8}
      >
        <View style={styles.quizCardHeader}>
          <View style={styles.quizIconContainer}>
            <Ionicons name="document-text" size={24} color={theme.colors.teacher.main} />
          </View>
          <View style={styles.quizCardContent}>
            <Text style={styles.quizTitle}>{item.title}</Text>
            <Text style={styles.quizSubtitle}>
              {item.submissionCount} {item.submissionCount === 1 ? 'respuesta' : 'respuestas'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderSubmissionCard = ({ item }: { item: QuizSubmission }) => {
    // Get calculated score from the quiz report
    const scoreData = selectedQuiz?.submissionScores[item.id];
    const score = scoreData?.score || 0;
    const correctAnswers = scoreData?.correctAnswers || 0;
    const totalQuestions = scoreData?.totalQuestions || item.answers.length;

    return (
      <View style={styles.submissionCard}>
        <View style={styles.submissionHeader}>
          <View style={styles.studentIcon}>
            <Text style={styles.studentInitial}>
              {item.students?.full_name?.charAt(0) || '?'}
            </Text>
          </View>
          <View style={styles.submissionContent}>
            <Text style={styles.studentName}>{item.students?.full_name || 'Estudiante'}</Text>
            <Text style={styles.submissionDate}>{formatDate(item.submitted_at)}</Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score}</Text>
            <Text style={styles.scoreLabel}>pts</Text>
          </View>
        </View>

        <View style={styles.submissionStats}>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={16} color="#34A853" />
            <Text style={styles.statText}>{correctAnswers} correctas</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="help-circle" size={16} color="#999" />
            <Text style={styles.statText}>{totalQuestions} preguntas</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.viewDetailsButton}
          onPress={() => {
            navigation.navigate('TeacherSubmissionDetail', {
              submissionId: item.id,
              quizId: selectedQuiz.id,
              studentName: item.students?.full_name || 'Estudiante',
              score,
            });
          }}
        >
          <Text style={styles.viewDetailsText}>Ver respuestas detalladas</Text>
          <Ionicons name="arrow-forward" size={16} color={theme.colors.teacher.main} />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.teacher.main} />
          <Text style={styles.loadingText}>Cargando reportes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (selectedQuiz) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedQuiz(null)}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{selectedQuiz.title}</Text>
            <Text style={styles.headerSubtitle}>
              {selectedQuiz.submissionCount} {selectedQuiz.submissionCount === 1 ? 'respuesta' : 'respuestas'}
            </Text>
          </View>
        </View>

        {selectedQuiz.submissions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay respuestas aún</Text>
            <Text style={styles.emptySubtext}>
              Los estudiantes aún no han completado este quiz
            </Text>
          </View>
        ) : (
          <FlatList
            data={selectedQuiz.submissions}
            keyExtractor={(item) => item.id}
            renderItem={renderSubmissionCard}
            contentContainerStyle={styles.submissionsList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header - Only show when no quiz is selected */}
      {!selectedQuiz && (
        <View style={styles.mainHeader}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButtonContainer}
          >
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.mainHeaderTitle}>Reportes</Text>
          <View style={styles.headerSpacer} />
        </View>
      )}

      <View style={styles.infoBanner}>
        <Ionicons name="information-circle-outline" size={24} color="#4285F4" />
        <Text style={styles.bannerText}>
          Revisa las respuestas de tus estudiantes en los quizzes de tus clases.
        </Text>
      </View>

      {quizReports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bar-chart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No hay quizzes aún</Text>
          <Text style={styles.emptySubtext}>
            Crea un quiz para ver las respuestas de tus estudiantes
          </Text>
        </View>
      ) : (
        <FlatList
          data={quizReports}
          keyExtractor={(item) => item.id}
          renderItem={renderQuizCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#F5F7FA' 
  },
  
  // Main Header (for reports list view)
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.teacher.main,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  backButtonContainer: {
    padding: 8,
  },
  mainHeaderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
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

  // Header (for quiz detail view)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },

  // Info Banner
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#E8F0FE',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  bannerText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#1A73E8',
    fontWeight: '500',
    lineHeight: 20,
  },

  // List Container
  listContainer: { 
    padding: 20, 
    paddingBottom: 40 
  },

  // Quiz Card
  quizCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quizCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F0FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quizCardContent: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  quizSubtitle: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },

  // Submission Card
  submissionsList: {
    padding: 20,
    paddingBottom: 40,
  },
  submissionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  submissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3E5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  studentInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#9C27B0',
  },
  submissionContent: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  submissionDate: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  scoreBadge: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  scoreLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '500',
    marginTop: 2,
  },
  submissionStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F0FE',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.teacher.main,
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
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
