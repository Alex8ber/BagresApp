/**
 * TeacherCreateClassScreen
 * 
 * Screen for creating new classes with auto-generated class codes.
 * 
 * Requirements: 1.9, 2.1, 5.2, 5.9, 10.14, 11.1, 11.9
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackScreenProps } from '@/types/navigation';
import { useAuth } from '@/hooks';
import { theme } from '@/styles';
import { createClass } from '@/services/supabase/classes';
import { uploadClassImage } from '@/services';
import type { ClassInsert } from '@/types/database';

type Props = RootStackScreenProps<'TeacherCreateClass'>;

// Default icons for classes
const DEFAULT_ICONS = [
  '📚', '🔢', '🔬', '🌍', '🎨', '🎵', '⚽', '📜', '💻', '🧪'
];

/**
 * Generate a random 6-character class code
 */
function generateClassCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * TeacherCreateClassScreen Component
 * 
 * Form for creating new classes with validation and Supabase integration.
 */
export default function TeacherCreateClassScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📚');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedClassCode, setGeneratedClassCode] = useState('');
  const [error, setError] = useState('');

  const handleImagePick = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
          setUploadingImage(true);
          try {
            const reader = new FileReader();
            reader.onload = (event) => {
              const base64Image = event.target?.result as string;
              setCustomImage(base64Image);
            };
            reader.readAsDataURL(file);
          } catch (error) {
            console.error('Error loading image:', error);
          } finally {
            setUploadingImage(false);
          }
        }
      };
      input.click();
    }
  };

  const handleCreateClass = async () => {
    // Validation
    if (!name.trim()) {
      setError('Por favor ingresa el nombre de la clase');
      return;
    }
    if (!subject.trim()) {
      setError('Por favor ingresa la materia');
      return;
    }
    if (!grade.trim()) {
      setError('Por favor ingresa el grado');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Generate unique class code
      const classCode = generateClassCode();

      let imageUrl: string | null = null;

      // Upload custom image if provided
      if (customImage) {
        try {
          // Generate a temporary ID for the image upload
          const tempId = `${user!.id}-${Date.now()}`;
          imageUrl = await uploadClassImage(tempId, customImage);
        } catch (uploadError: any) {
          console.error('Failed to upload image:', uploadError);
          setLoading(false);
          setError(`Error al subir la imagen: ${uploadError.message || 'Verifica los permisos de Storage'}`);
          return;
        }
      }

      // Prepare class data
      const classData: ClassInsert = {
        teacher_id: user!.id,
        name: name.trim(),
        subject: subject.trim(),
        grade: grade.trim(),
        description: description.trim() || null,
        class_code: classCode,
        class_icon: customImage ? '📚' : selectedIcon, // Use default if custom image, otherwise use selected icon
        class_image_url: imageUrl,
      };

      // Create class in database
      await createClass(classData);

      // Show success modal with class code
      setGeneratedClassCode(classCode);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Failed to create class:', err);
      setError('No se pudo crear la clase. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Header Info */}
          <View style={styles.headerInfo}>
            <Ionicons name="school" size={48} color={theme.colors.teacher.main} />
            <Text style={styles.headerTitle}>Nueva Clase</Text>
            <Text style={styles.headerSubtitle}>
              Completa la información para crear tu clase
            </Text>
          </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color="#E74C3C" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Class Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nombre de la Clase <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Matemáticas Avanzadas"
              placeholderTextColor={theme.colors.text.tertiary}
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
          </View>

          {/* Subject Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Materia <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Matemáticas"
              placeholderTextColor={theme.colors.text.tertiary}
              value={subject}
              onChangeText={setSubject}
              editable={!loading}
            />
          </View>

          {/* Grade Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Grado <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 5to Grado"
              placeholderTextColor={theme.colors.text.tertiary}
              value={grade}
              onChangeText={setGrade}
              editable={!loading}
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción (Opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe el contenido y objetivos de la clase..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!loading}
            />
          </View>

          {/* Icon/Image Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Icono o Imagen de la Clase</Text>
            
            {/* Custom Image Preview */}
            {customImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: customImage }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setCustomImage(null)}
                >
                  <Ionicons name="close-circle" size={24} color="#E74C3C" />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Icon Grid */}
                <View style={styles.iconGrid}>
                  {DEFAULT_ICONS.map((icon) => (
                    <TouchableOpacity
                      key={icon}
                      style={[
                        styles.iconButton,
                        selectedIcon === icon && styles.iconButtonSelected,
                      ]}
                      onPress={() => setSelectedIcon(icon)}
                      disabled={loading}
                    >
                      <Text style={styles.iconText}>{icon}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Upload Custom Image Button */}
                <TouchableOpacity
                  style={styles.uploadImageButton}
                  onPress={handleImagePick}
                  disabled={loading || uploadingImage}
                >
                  {uploadingImage ? (
                    <ActivityIndicator size="small" color={theme.colors.teacher.main} />
                  ) : (
                    <>
                      <Ionicons name="image" size={20} color={theme.colors.teacher.main} />
                      <Text style={styles.uploadImageText}>Subir Imagen Personalizada</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color={theme.colors.teacher.main} />
            <Text style={styles.infoText}>
              Se generará automáticamente un código de 6 caracteres para que los estudiantes puedan unirse a tu clase.
            </Text>
          </View>

          {/* Create Button */}
          <TouchableOpacity
            style={[styles.createButton, loading && styles.createButtonDisabled]}
            onPress={handleCreateClass}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="add-circle" size={24} color="#fff" />
                <Text style={styles.createButtonText}>Crear Clase</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseSuccessModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
            </View>
            
            <Text style={styles.modalTitle}>¡Clase Creada!</Text>
            <Text style={styles.modalMessage}>
              Tu clase ha sido creada exitosamente
            </Text>

            {/* Class Code Display */}
            <View style={styles.classCodeContainer}>
              <Text style={styles.classCodeLabel}>Código de Clase</Text>
              <View style={styles.classCodeBox}>
                <Text style={styles.classCodeText}>{generatedClassCode}</Text>
              </View>
              <Text style={styles.classCodeHint}>
                Comparte este código con tus estudiantes para que puedan unirse
              </Text>
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseSuccessModal}
            >
              <Text style={styles.modalButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // Header
  headerInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  // Error
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#E74C3C',
    fontWeight: '500',
  },

  // Form Inputs
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  required: {
    color: '#E74C3C',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: theme.colors.text.primary,
    outlineStyle: 'none',
  } as any,
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },

  // Info Box
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.teacher.main,
    lineHeight: 20,
  },

  // Create Button
  createButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.teacher.main,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: theme.colors.teacher.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  bottomSpacer: {
    height: 40,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },

  // Class Code Display
  classCodeContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  classCodeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  classCodeBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: theme.colors.teacher.main,
    marginBottom: 12,
  },
  classCodeText: {
    fontSize: 36,
    fontWeight: '700',
    color: theme.colors.teacher.main,
    letterSpacing: 4,
  },
  classCodeHint: {
    fontSize: 13,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  modalButton: {
    backgroundColor: theme.colors.teacher.main,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  // Icon/Image Selector
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconButtonSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: theme.colors.teacher.main,
  },
  iconText: {
    fontSize: 32,
  },
  uploadImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.teacher.main,
    borderStyle: 'dashed',
  },
  uploadImageText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.teacher.main,
  },
  imagePreviewContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 16,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
