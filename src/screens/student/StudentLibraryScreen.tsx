/**
 * StudentLibraryScreen
 * 
 * Library screen for students showing available quizzes and study materials.
 * Displays tests to take and class materials uploaded by teachers.
 * 
 * Requirements: 2.3, 2.6, 5.3, 6.7, 8.1, 8.2, 11.8
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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/styles';
import * as studentService from '@/services/supabase/students';
import { calculateSubmissionScore } from '@/services/supabase/students';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * StudentLibraryScreen Component
 * 
 * Shows quizzes and study materials in a kid-friendly interface.
 */
export default function StudentLibraryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'quizzes' | 'materials'>('quizzes');
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionScores, setSubmissionScores] = useState<Record<string, { score: number; correctAnswers: number; totalQuestions: number }>>({});

  useEffect(() => {
    loadLibraryData();
  }, [profile]);

  const loadLibraryData = async () => {
    if (!profile?.id) {
      return;
    }

    try {
      setLoading(true);

      // Get student's class
      const studentClass = await studentService.getStudentClass(profile.id);
      setClassData(studentClass);

      if (studentClass?.class_id) {
        // Get quizzes, materials, and submissions
        const [quizzesData, materialsData, submissionsData] = await Promise.all([
          studentService.getStudentQuizzes(studentClass.class_id),
          studentService.getStudentMaterials(studentClass.class_id),
          studentService.getStudentSubmissions(profile.id),
        ]);

        setQuizzes(quizzesData);
        setMaterials(materialsData);
        setSubmissions(submissionsData);
        
        // Calculate scores for all submissions
        const scores: Record<string, any> = {};
        for (const submission of submissionsData) {
          const scoreData = await calculateSubmissionScore(submission, submission.quiz_id);
          scores[submission.quiz_id] = scoreData;
        }
        setSubmissionScores(scores);
      }
    } catch (error) {
      console.error('Error loading library data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuizStatus = (quizId: string) => {
    const submission = submissions.find(sub => sub.quiz_id === quizId);
    if (submission) {
      const scoreData = submissionScores[quizId];
      return { 
        status: 'completed' as const, 
        score: scoreData?.score || 0,
        correctAnswers: scoreData?.correctAnswers || 0,
        totalQuestions: scoreData?.totalQuestions || 0,
      };
    }
    return { status: 'available' as const, score: undefined, correctAnswers: undefined, totalQuestions: undefined };
  };

  const getQuizStatusColor = (status: 'available' | 'completed') => {
    switch (status) {
      case 'available':
        return theme.colors.student.main;
      case 'completed':
        return '#4CAF50';
    }
  };

  const getQuizStatusText = (status: 'available' | 'completed') => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'completed':
        return 'Completado';
    }
  };

  const getQuizStatusIcon = (status: 'available' | 'completed') => {
    switch (status) {
      case 'available':
        return 'play-circle';
      case 'completed':
        return 'checkmark-circle';
    }
  };

  const getMaterialIcon = (contentType: string) => {
    if (contentType?.includes('pdf')) {
      return { icon: 'document-text', color: '#E74C3C', bg: '#FFEBEE' };
    } else if (contentType?.includes('video')) {
      return { icon: 'play-circle', color: '#9C27B0', bg: '#F3E5F5' };
    } else {
      return { icon: 'document', color: '#2196F3', bg: '#E3F2FD' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.student.main} />
          <Text style={styles.loadingText}>Cargando biblioteca...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderQuizzes = () => {
    if (quizzes.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="clipboard-outline" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>No hay quizzes disponibles</Text>
        </View>
      );
    }

    return (
    <View style={styles.content}>
      {quizzes.map((quiz) => {
        const { status, score, correctAnswers, totalQuestions } = getQuizStatus(quiz.id);
        const submission = submissions.find(sub => sub.quiz_id === quiz.id);
        
        return (
        <TouchableOpacity
          key={quiz.id}
          style={styles.quizCard}
          activeOpacity={0.8}
          onPress={() => {
            if (status === 'completed' && submission && score !== undefined && correctAnswers !== undefined && totalQuestions !== undefined) {
              // Navigate to results screen with calculated data
              navigation.navigate('StudentQuizResults', {
                quizId: quiz.id,
                quizTitle: quiz.title,
                score,
                correctAnswers,
                totalQuestions,
                passed: score >= (quiz.passing_score || 70),
                passingScore: quiz.passing_score || 70,
              });
            } else {
              // Navigate to quiz taking screen
              navigation.navigate('StudentTakeQuiz', { quizId: quiz.id });
            }
          }}
        >
          {/* Quiz Header */}
          <View style={styles.quizHeader}>
            <View style={[
              styles.quizStatusBadge,
              { backgroundColor: getQuizStatusColor(status) + '20' }
            ]}>
              <Ionicons
                name={getQuizStatusIcon(status) as any}
                size={16}
                color={getQuizStatusColor(status)}
              />
              <Text style={[
                styles.quizStatusText,
                { color: getQuizStatusColor(status) }
              ]}>
                {getQuizStatusText(status)}
              </Text>
            </View>
            {score !== undefined && (
              <View style={styles.scoreChip}>
                <Ionicons name="star" size={14} color="#FFA000" />
                <Text style={styles.scoreChipText}>{score} pts</Text>
              </View>
            )}
          </View>

          {/* Quiz Title */}
          <Text style={styles.quizTitle}>{quiz.title}</Text>

          {/* Quiz Info */}
          <View style={styles.quizInfo}>
            {quiz.duration_minutes && (
              <View style={styles.quizInfoItem}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.quizInfoText}>{quiz.duration_minutes} min</Text>
              </View>
            )}
            <View style={styles.quizInfoItem}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.quizInfoText}>{formatDate(quiz.created_at)}</Text>
            </View>
          </View>

          {/* Action Button */}
          {status === 'available' && (
            <View style={styles.quizAction}>
              <Text style={styles.quizActionText}>Comenzar Quiz</Text>
              <Ionicons name="arrow-forward" size={20} color={theme.colors.student.main} />
            </View>
          )}
          {status === 'completed' && (
            <View style={[styles.quizAction, styles.quizActionCompleted]}>
              <Text style={[styles.quizActionText, styles.quizActionTextCompleted]}>Ver Resultados</Text>
              <Ionicons name="arrow-forward" size={20} color="#4CAF50" />
            </View>
          )}
        </TouchableOpacity>
        );
      })}
    </View>
    );
  };

  const renderMaterials = () => {
    if (materials.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="book-outline" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>No hay materiales disponibles</Text>
        </View>
      );
    }

    return (
    <View style={styles.content}>
      {materials.map((material) => {
        const iconData = getMaterialIcon(material.content_type);
        return (
          <TouchableOpacity
            key={material.id}
            style={styles.materialCard}
            activeOpacity={0.8}
          >
            <View style={[styles.materialIcon, { backgroundColor: iconData.bg }]}>
              <Ionicons name={iconData.icon as any} size={28} color={iconData.color} />
            </View>
            <View style={styles.materialContent}>
              <Text style={styles.materialTitle}>{material.title}</Text>
              <View style={styles.materialMeta}>
                <Ionicons name="calendar-outline" size={14} color="#666" />
                <Text style={styles.materialMetaText}>{formatDate(material.created_at)}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        );
      })}
    </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Biblioteca</Text>
          <Text style={styles.headerSubtitle}>
            {classData?.classes?.name || 'Mi Clase'}
          </Text>
        </View>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'quizzes' && styles.tabActive]}
          onPress={() => setActiveTab('quizzes')}
        >
          <Ionicons
            name="clipboard"
            size={20}
            color={activeTab === 'quizzes' ? theme.colors.student.main : '#999'}
          />
          <Text style={[
            styles.tabText,
            activeTab === 'quizzes' && styles.tabTextActive
          ]}>
            Quizzes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'materials' && styles.tabActive]}
          onPress={() => setActiveTab('materials')}
        >
          <Ionicons
            name="book"
            size={20}
            color={activeTab === 'materials' ? theme.colors.student.main : '#999'}
          />
          <Text style={[
            styles.tabText,
            activeTab === 'materials' && styles.tabTextActive
          ]}>
            Materiales
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'quizzes' ? renderQuizzes() : renderMaterials()}
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },

  // Header
  header: {
    backgroundColor: theme.colors.student.main,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  headerContent: {
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },

  // Tab Selector
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },

  tabActive: {
    backgroundColor: '#E8F5E9',
  },

  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#999',
  },

  tabTextActive: {
    color: theme.colors.student.main,
  },

  // Content
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
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

  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  quizStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },

  quizStatusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  scoreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },

  scoreChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F57C00',
  },

  quizTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },

  quizInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },

  quizInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  quizInfoText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },

  quizAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
  },

  quizActionCompleted: {
    backgroundColor: '#E8F5E9',
  },

  quizActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.student.main,
  },

  quizActionTextCompleted: {
    color: '#4CAF50',
  },

  // Material Card
  materialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  materialIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  materialContent: {
    flex: 1,
  },

  materialTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 6,
  },

  materialMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  materialMetaText: {
    fontSize: 12,
    color: '#666',
  },

  materialMetaDot: {
    fontSize: 12,
    color: '#999',
  },
});
