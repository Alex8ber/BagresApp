/**
 * StudentProfileScreen
 * 
 * Profile screen for students with user information and edit functionality.
 * Kid-friendly design with green colors.
 * 
 * Requirements: 2.3, 2.6, 5.3, 6.7, 8.1, 8.2, 11.8
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Alert, 
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { StudentTabParamList } from '@/types/navigation';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useAuth } from '@/hooks';
import { Button } from '@/components/shared';
import { theme } from '@/styles';
import type { Student } from '@/types/database';
import * as studentService from '@/services/supabase/students';

type Props = BottomTabScreenProps<StudentTabParamList, 'Profile'>;

/**
 * StudentProfileScreen Component
 * 
 * Displays student profile information with edit and sign out functionality.
 */
export default function StudentProfileScreen({ navigation }: Props) {
  const { profile, signOut, loading } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [classData, setClassData] = useState<any>(null);
  const [stats, setStats] = useState({
    completedQuizzes: 0,
    totalPoints: 0,
    achievements: 0,
  });

  const studentProfile = profile as Student | null;

  useEffect(() => {
    loadStudentData();
  }, [profile]);

  const loadStudentData = async () => {
    if (!profile?.id) return;

    try {
      // Get student's class
      const studentClass = await studentService.getStudentClass(profile.id);
      setClassData(studentClass);

      // Get student's submissions to calculate stats
      const submissions = await studentService.getStudentSubmissions(profile.id);
      
      const completedQuizzes = submissions.length;
      const totalPoints = submissions.reduce((sum, sub) => sum + (sub.score || 0), 0);
      
      setStats({
        completedQuizzes,
        totalPoints,
        achievements: Math.floor(completedQuizzes / 5), // 1 achievement per 5 quizzes
      });
    } catch (error) {
      console.error('Error loading student data:', error);
    }
  };

  const handleGoBack = () => {
    navigation.navigate('Main');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas salir?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Sí, salir',
          style: 'destructive',
          onPress: async () => {
            try {
              setSigningOut(true);
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar sesión. Intenta de nuevo.');
              setSigningOut(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEdit = () => {
    Alert.alert('Editar Perfil', 'Esta función estará disponible pronto');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.student.main} />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!studentProfile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>No hay datos de perfil disponibles</Text>
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
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>👦</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarButton} onPress={handleEdit}>
              <Ionicons name="create" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileLabel}>ESTUDIANTE</Text>
          <Text style={styles.userName}>{studentProfile.full_name}</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.fieldContainer}>
            <View style={styles.fieldIcon}>
              <Ionicons name="person" size={20} color={theme.colors.student.main} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={styles.fieldLabel}>Nombre Completo</Text>
              <Text style={styles.fieldValue}>{studentProfile.fullName}</Text>
            </View>
          </View>

          {classData && (
            <View style={styles.fieldContainer}>
              <View style={styles.fieldIcon}>
                <Ionicons name="school" size={20} color={theme.colors.student.main} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Clase</Text>
                <Text style={styles.fieldValue}>{classData.classes?.name || 'Mi Clase'}</Text>
              </View>
            </View>
          )}

          {classData?.classes?.teachers && (
            <View style={styles.fieldContainer}>
              <View style={styles.fieldIcon}>
                <Ionicons name="person-outline" size={20} color={theme.colors.student.main} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>Profesor</Text>
                <Text style={styles.fieldValue}>{classData.classes.teachers.full_name}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Mis Estadísticas</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="trophy" size={24} color={theme.colors.student.main} />
              </View>
              <Text style={styles.statValue}>{stats.achievements}</Text>
              <Text style={styles.statLabel}>Logros</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="star" size={24} color="#FF9800" />
              </View>
              <Text style={styles.statValue}>{stats.totalPoints}</Text>
              <Text style={styles.statLabel}>Puntos</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="checkmark-circle" size={24} color="#2196F3" />
              </View>
              <Text style={styles.statValue}>{stats.completedQuizzes}</Text>
              <Text style={styles.statLabel}>Completadas</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.signOutButton}
            disabled={signingOut}
          >
            <Ionicons name="log-out-outline" size={20} color="#E74C3C" />
            <Text style={styles.signOutButtonText}>
              {signingOut ? 'Saliendo...' : 'Cerrar Sesión'}
            </Text>
          </TouchableOpacity>
        </View>
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

  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.text.secondary,
  },

  errorText: {
    fontSize: 16,
    color: theme.colors.error.main,
    textAlign: 'center',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: theme.colors.student.main,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },

  editButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Avatar Section
  avatarSection: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
    backgroundColor: '#fff',
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  avatarEmoji: {
    fontSize: 48,
  },

  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.student.main,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  profileLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.text.tertiary,
    letterSpacing: 1,
    marginBottom: 8,
  },

  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },

  // Profile Card
  profileCard: {
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

  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  fieldIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  fieldContent: {
    flex: 1,
  },

  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },

  fieldValue: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },

  // Stats Card
  statsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 20,
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  statItem: {
    alignItems: 'center',
  },

  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },

  // Actions
  actionsContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },

  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 28,
    height: 56,
    borderWidth: 2,
    borderColor: '#E74C3C',
    gap: 8,
  },

  signOutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E74C3C',
  },
});
