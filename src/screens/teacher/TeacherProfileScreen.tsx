/**
 * TeacherProfileScreen
 * 
 * Profile screen for teachers with user information and edit functionality.
 * Uses useAuth hook to access profile data and authentication actions.
 * 
 * Requirements: 1.9, 2.1, 5.2, 5.9, 10.14, 11.1, 11.9
 */

import React, { useState } from 'react';
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
import type { TeacherTabScreenProps } from '@/types/navigation';
import { useAuth } from '@/hooks';
import { Button } from '@/components/shared';
import { theme } from '@/styles';
import type { Teacher } from '@/types/database';

type Props = TeacherTabScreenProps<'Profile'>;

/**
 * TeacherProfileScreen Component
 * 
 * Displays teacher profile information with edit and sign out functionality.
 */
export default function TeacherProfileScreen({ navigation }: Props) {
  const { user, profile, signOut, loading } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const teacherProfile = profile as Teacher | null;

  const handleGoBack = () => {
    navigation.navigate('Main');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
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
    setIsEditing(!isEditing);
    // TODO: Implement edit functionality
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.teacher.main} />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user || !teacherProfile) {
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
          <View style={styles.placeholder} />
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>👨‍🏫</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarButton} onPress={handleEdit}>
              <Ionicons name="create" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileLabel}>PERFIL DE DOCENTE</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Nombre Completo</Text>
            <View style={styles.fieldInput}>
              <Text style={styles.fieldValue}>{teacherProfile.full_name}</Text>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Correo Electrónico</Text>
            <View style={styles.fieldInput}>
              <Text style={styles.fieldValue}>{teacherProfile.email}</Text>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Escuela o Institución</Text>
            <View style={styles.fieldInput}>
              <Text style={styles.fieldValue}>{teacherProfile.school}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            onPress={handleEdit}
            variant="primary"
            style={styles.saveButton}
          >
            Editar Perfil
          </Button>

          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.signOutButton}
            disabled={signingOut}
          >
            <Ionicons name="log-out-outline" size={20} color="#E74C3C" />
            <Text style={styles.signOutButtonText}>
              {signingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
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
    backgroundColor: '#F5F5F5',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 40,
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
    backgroundColor: theme.colors.teacher.main,
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },

  placeholder: {
    width: 40,
  },

  // Avatar Section
  avatarSection: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#fff',
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E3F2FD',
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
    fontSize: 56,
  },

  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.teacher.main,
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
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.tertiary,
    letterSpacing: 1,
  },

  // Profile Card
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  fieldContainer: {
    marginBottom: 20,
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },

  fieldInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },

  fieldValue: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },

  // Actions
  actionsContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
  },

  saveButton: {
    backgroundColor: theme.colors.teacher.main,
    borderRadius: 28,
    height: 56,
    shadowColor: theme.colors.teacher.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 28,
    height: 56,
    marginTop: 16,
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
