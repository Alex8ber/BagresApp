/**
 * StudentQuizResultsScreen
 * 
 * Screen showing quiz results after submission.
 * Displays score, pass/fail status, and feedback.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/styles';
import type { RootStackScreenProps } from '@/types/navigation';

type Props = RootStackScreenProps<'StudentQuizResults'>;

export default function StudentQuizResultsScreen({ navigation, route }: Props) {
  const { quizTitle, score, correctAnswers, totalQuestions, passed, passingScore } = route.params;

  const getResultIcon = () => {
    if (passed) {
      return { name: 'checkmark-circle' as const, color: '#4CAF50' };
    }
    return { name: 'close-circle' as const, color: '#EF5350' };
  };

  const getResultMessage = () => {
    if (passed) {
      if (score >= 90) return '¡Excelente trabajo!';
      if (score >= 80) return '¡Muy bien hecho!';
      return '¡Buen trabajo!';
    }
    return 'Sigue practicando';
  };

  const resultIcon = getResultIcon();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Result Icon */}
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: resultIcon.color + '20' }]}>
            <Ionicons name={resultIcon.name} size={80} color={resultIcon.color} />
          </View>
        </View>

        {/* Result Message */}
        <Text style={styles.resultMessage}>{getResultMessage()}</Text>
        <Text style={styles.quizTitle}>{quizTitle}</Text>

        {/* Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreCircle}>
            <Text style={[styles.scoreNumber, { color: resultIcon.color }]}>{score}</Text>
            <Text style={styles.scoreLabel}>puntos</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Text style={styles.statLabel}>Correctas</Text>
              <Text style={styles.statValue}>{correctAnswers}</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Ionicons name="close-circle" size={24} color="#EF5350" />
              <Text style={styles.statLabel}>Incorrectas</Text>
              <Text style={styles.statValue}>{totalQuestions - correctAnswers}</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Ionicons name="list" size={24} color="#2196F3" />
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>{totalQuestions}</Text>
            </View>
          </View>
        </View>

        {/* Pass/Fail Status */}
        <View style={[styles.statusCard, passed ? styles.statusCardPassed : styles.statusCardFailed]}>
          <Ionicons
            name={passed ? 'trophy' : 'alert-circle'}
            size={32}
            color={passed ? '#4CAF50' : '#EF5350'}
          />
          <View style={styles.statusTextContainer}>
            <Text style={[styles.statusTitle, { color: passed ? '#4CAF50' : '#EF5350' }]}>
              {passed ? '¡Aprobado!' : 'No aprobado'}
            </Text>
            <Text style={styles.statusSubtitle}>
              Calificación mínima: {passingScore} puntos
            </Text>
          </View>
        </View>

        {/* Feedback */}
        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>Retroalimentación</Text>
          <Text style={styles.feedbackText}>
            {passed
              ? `Has demostrado un buen dominio del tema. Respondiste correctamente ${correctAnswers} de ${totalQuestions} preguntas.`
              : `Necesitas repasar algunos conceptos. Respondiste correctamente ${correctAnswers} de ${totalQuestions} preguntas. Te recomendamos revisar el material de estudio y volver a intentarlo.`}
          </Text>
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('StudentDashboard')}
        >
          <Text style={styles.primaryButtonText}>Volver al inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('StudentDashboard')}
        >
          <Text style={styles.secondaryButtonText}>Ver más quizzes</Text>
        </TouchableOpacity>
      </View>
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
  iconContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultMessage: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  quizTitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  scoreCircle: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreNumber: {
    fontSize: 64,
    fontWeight: '800',
    lineHeight: 72,
  },
  scoreLabel: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    gap: 16,
  },
  statusCardPassed: {
    backgroundColor: '#E8F5E9',
  },
  statusCardFailed: {
    backgroundColor: '#FFEBEE',
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  feedbackCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  feedbackText: {
    fontSize: 15,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  actionsContainer: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: theme.colors.student.main,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: theme.colors.student.main,
    fontSize: 16,
    fontWeight: '600',
  },
});
