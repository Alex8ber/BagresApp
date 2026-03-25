/**
 * TeacherMainScreen
 * 
 * Main dashboard screen for teachers with quick access to common actions.
 * Provides navigation to Students List, Create Test, Create Class, Schedule, and Reports.
 * 
 * Requirements: 1.9, 2.1, 5.2, 5.9, 10.14, 11.1, 11.9
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { TeacherTabScreenProps } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import { theme } from '@/styles';
import { useAuth } from '@/hooks/useAuth';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = TeacherTabScreenProps<'Main'>;

/**
 * TeacherMainScreen Component
 * 
 * Displays a modern dashboard with classes, quick actions, and upcoming activities.
 */
export default function TeacherMainScreen(_props: Props) {
  const navigation = useNavigation<NavigationProp>();
  const { profile } = useAuth();

  // Mock data - replace with real data later
  const activeClasses = [
    { id: '1', name: '2do Grado - Mate', students: 24, color: '#E3F2FD', emoji: '🔢' },
    { id: '2', name: '1er Grado - Ciencias', students: 18, color: '#BBDEFB', emoji: '🔬' },
  ];

  const upcomingActivities = [
    { id: '1', time: '10:30 AM', title: 'Taller de Fracciones', subtitle: 'Aula 402 • 2do Grado - Mate' },
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
              <Text style={styles.avatarText}>👨‍🏫</Text>
            </View>
            <View>
              <Text style={styles.greeting}>GOOD MORNING</Text>
              <Text style={styles.userName}>¡{profile?.fullName || 'Sr. Smith'}!</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Ready for Today Card */}
        <TouchableOpacity style={styles.readyCard} activeOpacity={0.8}>
          <View style={styles.readyCardContent}>
            <Text style={styles.readyTitle}>¿Listo para hoy?</Text>
            <Text style={styles.readySubtitle}>3 classes and 12 quiz reviews pending.</Text>
          </View>
          <View style={styles.readyIcon}>
            <Ionicons name="book-outline" size={32} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Active Classes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tus Clases Activas</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>Ver todo</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.classesScroll}
          >
            {activeClasses.map((classItem) => (
              <TouchableOpacity 
                key={classItem.id} 
                style={[styles.classCard, { backgroundColor: classItem.color }]}
                activeOpacity={0.8}
              >
                <Text style={[styles.classEmoji, classItem.textColor && { color: classItem.textColor }]}>
                  {classItem.emoji}
                </Text>
                <Text style={[styles.className, classItem.textColor && { color: classItem.textColor }]}>
                  {classItem.name}
                </Text>
                <View style={styles.classStudents}>
                  <Ionicons 
                    name="people" 
                    size={14} 
                    color={classItem.textColor || theme.colors.text.secondary} 
                  />
                  <Text style={[styles.classStudentsText, classItem.textColor && { color: classItem.textColor }]}>
                    {classItem.students} Estudiantes
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          </View>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('TeacherCreateTest', {})}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="create-outline" size={28} color={theme.colors.teacher.main} />
              </View>
              <Text style={styles.actionTitle}>Crear{'\n'}Cuestionario</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => console.log('Lista de Alumnos')}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="people" size={28} color={theme.colors.teacher.main} />
              </View>
              <Text style={styles.actionTitle}>Lista de{'\n'}Alumnos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('TeacherReports', {})}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="bar-chart-outline" size={28} color="#FF9800" />
              </View>
              <Text style={styles.actionTitle}>Reportes</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('TeacherSchedule')}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="calendar-outline" size={28} color="#9C27B0" />
              </View>
              <Text style={styles.actionTitle}>Horario</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Activities Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>A continuación</Text>
          </View>
          
          {upcomingActivities.map((activity) => (
            <TouchableOpacity 
              key={activity.id} 
              style={styles.activityCard}
              activeOpacity={0.8}
            >
              <View style={styles.activityTime}>
                <Text style={styles.activityTimeText}>{activity.time.split(' ')[0]}</Text>
                <Text style={styles.activityTimePeriod}>{activity.time.split(' ')[1]}</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    backgroundColor: theme.colors.teacher.main,
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

  // Ready Card
  readyCard: {
    backgroundColor: theme.colors.teacher.main,
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
  readyCardContent: {
    flex: 1,
  },
  readyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  readySubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  readyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
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
    color: theme.colors.teacher.main,
  },

  // Classes
  classesScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  classCard: {
    width: 160,
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
  classStudents: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  classStudentsText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },

  // Actions Grid
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    lineHeight: 18,
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
  activityTime: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  activityTimeText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  activityTimePeriod: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '600',
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
  activitySubtitle: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
});
