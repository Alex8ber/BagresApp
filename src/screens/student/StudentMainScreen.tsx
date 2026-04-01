/**
 * StudentMainScreen
 * 
 * Main dashboard screen for students with a fun, kid-friendly design.
 * Shows classes, upcoming tests, and quick access to learning materials.
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
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/styles';
import * as studentService from '@/services/supabase/students';

/**
 * StudentMainScreen Component
 * 
 * Kid-friendly dashboard with colorful cards and easy navigation.
 */
export default function StudentMainScreen() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<any>(null);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [recentMaterials, setRecentMaterials] = useState<any[]>([]);
  const [activeQuizzes, setActiveQuizzes] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    loadStudentData();
    loadNotificationCount();
  }, [profile]);

  const loadNotificationCount = async () => {
    if (!profile?.id) return;
    
    try {
      const { getUnreadCount } = await import('@/services/supabase/notifications');
      const count = await getUnreadCount(profile.id, 'student');
      setUnreadNotifications(count);
    } catch (error) {
      console.error('Error loading notification count:', error);
    }
  };

  const loadStudentData = async () => {
    if (!profile?.id) return;

    try {
      setLoading(true);

      // Get student's class
      const studentClass = await studentService.getStudentClass(profile.id);
      setClassData(studentClass);

      if (studentClass?.class_id) {
        // Get all data in parallel
        const [quizzes, activities, materials] = await Promise.all([
          studentService.getUpcomingQuizzes(studentClass.class_id),
          studentService.getStudentRecentActivities(profile.id, studentClass.class_id),
          studentService.getStudentMaterials(studentClass.class_id),
        ]);

        setUpcomingQuizzes(quizzes);
        setRecentActivities(activities);
        
        // Get recent materials (last 3)
        setRecentMaterials(materials.slice(0, 3));
        
        // Get active quizzes (available now)
        const now = new Date().toISOString();
        const active = quizzes.filter(q => 
          q.available_from <= now && q.available_until >= now
        );
        setActiveQuizzes(active.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationPress = () => {
    // TODO: Navigate to notifications screen
    console.log('Open notifications');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.student.main} />
          <Text style={styles.loadingText}>Cargando...</Text>
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👦</Text>
            </View>
            <View>
              <Text style={styles.greeting}>¡HOLA!</Text>
              <Text style={styles.userName}>{profile?.fullName || 'Estudiante'}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleNotificationPress}
          >
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            {unreadNotifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Welcome Card */}
        <TouchableOpacity style={styles.welcomeCard} activeOpacity={0.8}>
          <View style={styles.welcomeCardContent}>
            <Text style={styles.welcomeTitle}>¡Sigue aprendiendo!</Text>
            <Text style={styles.welcomeSubtitle}>
              {activeQuizzes.length > 0 
                ? `${activeQuizzes.length} ${activeQuizzes.length === 1 ? 'quiz activo' : 'quizzes activos'} disponibles`
                : upcomingQuizzes.length > 0
                ? `${upcomingQuizzes.length} ${upcomingQuizzes.length === 1 ? 'examen próximo' : 'exámenes próximos'}`
                : 'No tienes exámenes próximos'}
            </Text>
          </View>
          <Text style={styles.welcomeEmoji}>📚</Text>
        </TouchableOpacity>

        {/* Active Quizzes Section */}
        {activeQuizzes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quizzes Activos</Text>
              <Text style={styles.sectionBadge}>{activeQuizzes.length}</Text>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {activeQuizzes.map((quiz) => (
                <TouchableOpacity 
                  key={quiz.id} 
                  style={styles.activeQuizCard}
                  activeOpacity={0.8}
                >
                  <View style={styles.activeQuizHeader}>
                    <View style={styles.activeQuizBadge}>
                      <Ionicons name="flash" size={16} color="#fff" />
                      <Text style={styles.activeQuizBadgeText}>ACTIVO</Text>
                    </View>
                  </View>
                  <Text style={styles.activeQuizTitle}>{quiz.title}</Text>
                  <View style={styles.activeQuizFooter}>
                    <View style={styles.activeQuizInfo}>
                      <Ionicons name="help-circle-outline" size={14} color="#666" />
                      <Text style={styles.activeQuizInfoText}>
                        {quiz.question_count || 0} preguntas
                      </Text>
                    </View>
                    {quiz.duration_minutes && (
                      <View style={styles.activeQuizInfo}>
                        <Ionicons name="time-outline" size={14} color="#666" />
                        <Text style={styles.activeQuizInfoText}>{quiz.duration_minutes} min</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.activeQuizButton}>
                    <Text style={styles.activeQuizButtonText}>Comenzar Ahora</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Recent Materials Section */}
        {recentMaterials.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Materiales Recientes</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllButton}>Ver todos</Text>
              </TouchableOpacity>
            </View>
            
            {recentMaterials.map((material) => (
              <TouchableOpacity 
                key={material.id} 
                style={styles.materialCard}
                activeOpacity={0.8}
              >
                <View style={styles.materialIconContainer}>
                  <Ionicons 
                    name={material.content_type?.includes('pdf') ? 'document-text' : 'document'} 
                    size={24} 
                    color={theme.colors.student.main} 
                  />
                </View>
                <View style={styles.materialContent}>
                  <Text style={styles.materialTitle}>{material.title}</Text>
                  <Text style={styles.materialDate}>
                    {new Date(material.created_at).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* My Class Section */}
        {classData ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mi Clase</Text>
            </View>
            
            <View style={styles.classesScroll}>
              <TouchableOpacity 
                style={[styles.classCard, { backgroundColor: '#A5D6A7' }]}
                activeOpacity={0.8}
              >
                <Text style={styles.classEmoji}>📚</Text>
                <Text style={styles.className}>{classData.classes?.name || 'Mi Clase'}</Text>
                <View style={styles.classTeacher}>
                  <Ionicons name="person" size={14} color="#666" />
                  <Text style={styles.classTeacherText}>
                    {classData.classes?.teachers?.full_name || 'Profesor'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mi Clase</Text>
            </View>
            
            <View style={styles.classesScroll}>
              <View style={styles.noClassCard}>
                <Ionicons name="school-outline" size={48} color="#999" />
                <Text style={styles.noClassText}>No estás inscrito en ninguna clase</Text>
              </View>
            </View>
          </View>
        )}

        {/* Upcoming Tests Section */}
        {upcomingQuizzes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Próximos Exámenes</Text>
            </View>
            
            {upcomingQuizzes.slice(0, 3).map((quiz) => (
              <TouchableOpacity 
                key={quiz.id} 
                style={styles.testCard}
                activeOpacity={0.8}
              >
                <View style={styles.testIcon}>
                  <Ionicons name="document-text" size={24} color={theme.colors.student.main} />
                </View>
                <View style={styles.testContent}>
                  <Text style={styles.testSubject}>{quiz.title}</Text>
                  <View style={styles.testMeta}>
                    <Ionicons name="calendar-outline" size={14} color="#666" />
                    <Text style={styles.testMetaText}>
                      {new Date(quiz.available_from).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                      })}
                      {quiz.duration_minutes && ` • ${quiz.duration_minutes} min`}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Recent Activities Section */}
        {recentActivities.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Actividades Recientes</Text>
            </View>
            
            {recentActivities.slice(0, 5).map((activity) => (
              <View key={activity.id} style={styles.activityCard}>
                <View style={[
                  styles.activityStatus,
                  { backgroundColor: activity.status === 'completed' ? '#C8E6C9' : '#FFE082' }
                ]}>
                  <Ionicons 
                    name={activity.status === 'completed' ? 'checkmark-circle' : 'time'} 
                    size={20} 
                    color={activity.status === 'completed' ? '#2E7D32' : '#F57C00'} 
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityStatusText}>
                    {activity.status === 'completed' ? 'Completado' : 'Pendiente'}
                  </Text>
                </View>
                {activity.score !== null && (
                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>{activity.score}</Text>
                    <Text style={styles.scoreLabel}>pts</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.bottomSpacer} />
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
    paddingBottom: 100,
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
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: theme.colors.student.main,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  greeting: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF5252',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  // Welcome Card
  welcomeCard: {
    backgroundColor: theme.colors.student.main,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeCardContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 18,
  },
  welcomeEmoji: {
    fontSize: 48,
  },

  // Section
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  sectionBadge: {
    backgroundColor: theme.colors.student.main,
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.student.main,
  },

  // Horizontal Scroll
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },

  // Active Quiz Card
  activeQuizCard: {
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.student.main,
  },
  activeQuizHeader: {
    marginBottom: 12,
  },
  activeQuizBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.student.main,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  activeQuizBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  activeQuizTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  activeQuizFooter: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  activeQuizInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeQuizInfoText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeQuizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.student.main,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  activeQuizButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  // Material Card (compact version)
  materialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  materialIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  materialContent: {
    flex: 1,
  },
  materialTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  materialDate: {
    fontSize: 12,
    color: '#666',
  },

  // Classes
  classesScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  classCard: {
    width: 200,
    height: 140,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  classEmoji: {
    fontSize: 32,
  },
  className: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginTop: 8,
  },
  classTeacher: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  classTeacherText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  noClassCard: {
    width: '100%',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  noClassText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },

  // Test Card
  testCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  testIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  testContent: {
    flex: 1,
  },
  testSubject: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  testMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  testMetaText: {
    fontSize: 13,
    color: '#666',
  },

  // Activity Card
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  activityStatus: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  activityStatusText: {
    fontSize: 13,
    color: '#666',
  },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.student.main,
  },
  scoreLabel: {
    fontSize: 10,
    color: theme.colors.student.main,
    fontWeight: '600',
  },

  bottomSpacer: {
    height: 40,
  },
});
