/**
 * TeacherEditProfileScreen
 * 
 * Screen for editing teacher profile information.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackScreenProps } from '@/types/navigation';
import { useAuth } from '@/hooks';
import { theme } from '@/styles';
import type { Teacher } from '@/types/models';
import { updateTeacherProfile } from '@/services';

type Props = RootStackScreenProps<'TeacherEditProfile'>;

export default function TeacherEditProfileScreen({ navigation }: Props) {
  const { user, profile, refreshProfile } = useAuth();
  const teacherProfile = profile as Teacher | null;

  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (teacherProfile) {
      setFullName(teacherProfile.fullName || '');
      setSchool(teacherProfile.school || '');
    }
  }, [teacherProfile]);

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      return;
    }

    if (!fullName.trim()) {
      Alert.alert('Error', 'El nombre completo es requerido.');
      return;
    }

    if (!school.trim()) {
      Alert.alert('Error', 'La escuela o institución es requerida.');
      return;
    }

    setSaving(true);
    try {
      await updateTeacherProfile(user.id, {
        full_name: fullName.trim(),
        school: school.trim(),
      });

      await refreshProfile();
      
      Alert.alert('¡Éxito!', 'Perfil actualizado correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Información Personal</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Nombre Completo *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Juan Pérez"
                placeholderTextColor="#A0AEC0"
                value={fullName}
                onChangeText={setFullName}
                editable={!saving}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Correo Electrónico</Text>
              <View style={styles.disabledInput}>
                <Text style={styles.fieldValue}>{teacherProfile?.email}</Text>
              </View>
              <Text style={styles.helperText}>
                El correo no puede ser modificado
              </Text>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Escuela o Institución *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Colegio San José"
                placeholderTextColor="#A0AEC0"
                value={school}
                onChangeText={setSchool}
                editable={!saving}
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingBottom: 20,
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

  // Form
  formCard: {
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

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 20,
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

  input: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#2D3748',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  disabledInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },

  fieldValue: {
    fontSize: 16,
    color: '#2D3748',
    fontWeight: '500',
  },

  helperText: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
    marginTop: 6,
    fontStyle: 'italic',
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },

  saveButton: {
    flex: 1,
    backgroundColor: theme.colors.teacher.main,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
