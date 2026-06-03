/**
 * TeacherScheduleScreen
 * 
 * Screen for viewing scheduled quizzes with availability dates.
 * Shows quizzes that have been programmed with specific start/end dates.
 * 
 * Requirements: 1.9, 2.1, 5.2, 5.9, 10.14, 11.1, 11.9
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackScreenProps } from '@/types/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getTeacherQuizzes } from '@/services/supabase/quizzes';
import { theme } from '@/styles';

// ============================================================================
// Types
// ============================================================================

interface ScheduledQuiz {
  id: string;
  title: string;
  class_id: string;
  available_from: string | null;
  available_until: string | null;
  is_published: boolean;
}

type Props = RootStackScreenProps<'TeacherSchedule'>;

// ============================================================================
// Component
// ============================================================================

export default function TeacherScheduleScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<ScheduledQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScheduledQuizzes();
  }, []);

  const loadScheduledQuizzes = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const allQuizzes = await getTeacherQuizzes(user.id);
      
      // Filter only quizzes that have scheduling (available_from or available_until)
      const scheduled = allQuizzes.filter(
        (quiz) => quiz.available_from || quiz.available_until
      );
      
      setQuizzes(scheduled);
    } catch (error) {
      console.error('Error loading scheduled quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Sin límite';
    
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getQuizStatus = (quiz: ScheduledQuiz) => {
    const now = new Date();
    const availableFrom = quiz.available_from ? new Date(quiz.available_from) : null;
    const availableUntil = quiz.available_until ? new Date(quiz.available_until) : null;

    if (!quiz.is_published) {
      return { status: 'draft', color: '#718096', text: 'Borrador' };
    }

    if (availableFrom && now < availableFrom) {
      return { status: 'scheduled', color: '#4285F4', text: 'Programado' };
    }

    if (availableUntil && now > availableUntil) {
      return { status: 'ended', color: '#E53E3E', text: 'Finalizado' };
    }

    return { status: 'active', color: '#38A169', text: 'Activo' };
  };

  const renderQuiz = ({ item }: { item: ScheduledQuiz }) => {
    const status = getQuizStatus(item);

    return (
      <View style={styles.cardContainer}>
        <View
          style={[
            styles.cardAccent,
            { backgroundColor: status.color },
          ]}
        />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${status.color}20` },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: status.color },
                ]}
              >
                {status.text}
              </Text>
            </View>
          </View>

          <Text style={styles.quizTitle}>{item.title}</Text>

          {item.available_from && (
            <View style={styles.dateRow}>
              <Ionicons name="play-circle-outline" size={16} color="#4A5568" />
              <Text style={styles.dateLabel}>Disponible desde:</Text>
              <Text style={styles.dateValue}>{formatDateTime(item.available_from)}</Text>
            </View>
          )}

          {item.available_until && (
            <View style={styles.dateRow}>
              <Ionicons name="stop-circle-outline" size={16} color="#4A5568" />
              <Text style={styles.dateLabel}>Disponible hasta:</Text>
              <Text style={styles.dateValue}>{formatDateTime(item.available_until)}</Text>
            </View>
          )}

          {!item.available_from && item.available_until && (
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={16} color="#4285F4" />
              <Text style={styles.infoText}>
                Disponible ahora hasta la fecha límite
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const keyExtractor = (item: ScheduledQuiz) => item.id;

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.teacher.main} />
          <Text style={styles.loadingText}>Cargando horarios...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.infoBanner}>
        <Ionicons name="calendar-outline" size={24} color="#4285F4" />
        <Text style={styles.bannerText}>
          Aquí puedes ver todos los quizzes que has programado con fechas específicas.
        </Text>
      </View>

      <FlatList
        data={quizzes}
        keyExtractor={keyExtractor}
        renderItem={renderQuiz}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-clear-outline" size={64} color="#CBD5E0" />
            <Text style={styles.emptyText}>No hay quizzes programados</Text>
            <Text style={styles.emptySubtext}>
              Los quizzes con fechas de disponibilidad aparecerán aquí
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFBFD' },
  
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.text.secondary,
  },

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
  
  listContainer: { 
    padding: 20, 
    paddingBottom: 100 
  },
  
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  
  cardAccent: { 
    width: 6 
  },
  
  cardContent: { 
    flex: 1, 
    padding: 16 
  },
  
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  statusBadge: { 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 8 
  },
  
  statusText: { 
    fontSize: 12, 
    fontWeight: '700' 
  },
  
  quizTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 12,
  },
  
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  
  dateLabel: {
    fontSize: 13,
    color: '#718096',
    fontWeight: '600',
  },
  
  dateValue: {
    fontSize: 13,
    color: '#2D3748',
    fontWeight: '500',
    flex: 1,
  },
  
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F0FE',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  
  infoText: {
    fontSize: 13,
    color: '#1A73E8',
    fontWeight: '500',
    flex: 1,
  },
  
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  
  emptyText: {
    fontSize: 16,
    color: '#A0AEC0',
    fontWeight: '600',
    marginTop: 16,
  },
  
  emptySubtext: {
    fontSize: 14,
    color: '#CBD5E0',
    marginTop: 8,
    textAlign: 'center',
  },
});
