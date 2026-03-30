/**
 * StudentMainScreen
 * 
 * Main dashboard screen for students with a fun, kid-friendly design.
 * Shows classes, upcoming tests, and quick access to learning materials.
 * 
 * Requirements: 2.3, 2.6, 5.3, 6.7, 8.1, 8.2, 11.8
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/styles';

/**
 * StudentMainScreen Component
 * 
 * Kid-friendly dashboard with colorful cards and easy navigation.
 */
export default function StudentMainScreen() {
  const { profile } = useAuth();

  // Mock data - replace with real data later
  const myClasses = [
    { id: '1', name: 'Matemáticas', teacher: 'Prof. García', color: '#FFE082', emoji: '🔢' },
    { id: '2', name: 'Ciencias', teacher: 'Prof. López', color: '#A5D6A7', emoji: '🔬' },
  ];

  const upcomingTests = [
    { id: '1', subject: 'Matemáticas', date: 'Mañana', time: '10:00 AM' },
  ];

  const recentActivities = [
    { id: '1', title: 'Tarea de Fracciones', status: 'completed', score: 95 },
    { id: '2', title: 'Quiz de Ciencias', status: 'pending', score: null },
  ];

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
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Welcome Card */}
        <TouchableOpacity style={styles.welcomeCard} activeOpacity={0.8}>
          <View style={styles.welcomeCardContent}>
            <Text style={styles.welcomeTitle}>¡Sigue aprendiendo!</Text>
            <Text style={styles.welcomeSubtitle}>
              Tienes 1 examen próximo y 2 tareas pendientes
            </Text>
          </View>
          <Text style={styles.welcomeEmoji}>📚</Text>
        </TouchableOpacity>

        {/* My Classes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mis Clases</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.classesScroll}
          >
            {myClasses.map((classItem) => (
              <TouchableOpacity 
                key={classItem.id} 
                style={[styles.classCard, { backgroundColor: classItem.color }]}
                activeOpacity={0.8}
              >
                <Text style={styles.classEmoji}>{classItem.emoji}</Text>
                <Text style={styles.className}>{classItem.name}</Text>
                <View style={styles.classTeacher}>
                  <Ionicons name="person" size={14} color="#666" />
                  <Text style={styles.classTeacherText}>{classItem.teacher}</Text>
                </View>
              </TouchableOpacity>
            ))}
            
            {/* Add Class Card */}
            <TouchableOpacity style={styles.addClassCard} activeOpacity={0.8}>
              <Ionicons name="add-circle" size={40} color={theme.colors.student.main} />
              <Text style={styles.addClassText}>Unirme a{'\n'}una clase</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Upcoming Tests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos Exámenes</Text>
          </View>
          
          {upcomingTests.map((test) => (
            <TouchableOpacity 
              key={test.id} 
              style={styles.testCard}
              activeOpacity={0.8}
            >
              <View style={styles.testIcon}>
                <Ionicons name="document-text" size={24} color={theme.colors.student.main} />
              </View>
              <View style={styles.testContent}>
                <Text style={styles.testSubject}>{test.subject}</Text>
                <View style={styles.testMeta}>
                  <Ionicons name="calendar-outline" size={14} color="#666" />
                  <Text style={styles.testMetaText}>{test.date} • {test.time}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activities Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actividades Recientes</Text>
          </View>
          
          {recentActivities.map((activity) => (
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
  seeAllButton: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.student.main,
  },

  // Classes
  classesScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  classCard: {
    width: 140,
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
  addClassCard: {
    width: 140,
    height: 140,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: theme.colors.student.main,
    borderStyle: 'dashed',
  },
  addClassText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.student.main,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
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
