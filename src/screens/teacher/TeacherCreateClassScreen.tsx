/**
 * TeacherCreateClassScreen
 * 
 * Screen for creating and uploading new classes/evaluations with file support.
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
  Alert,
} from 'react-native';
import type { RootStackScreenProps } from '@/types/navigation';
import { theme } from '@/styles';

type Props = RootStackScreenProps<'TeacherCreateClass'>;

interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'word' | 'powerpoint' | 'image';
  size: string;
}

/**
 * TeacherCreateClassScreen Component
 * 
 * Form for creating new classes with file upload support.
 */
export default function TeacherCreateClassScreen({ navigation }: Props) {
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    // Mock files for demonstration
    { id: '1', name: 'Guía de Fracciones.pdf', type: 'pdf', size: '2.4 MB' },
    { id: '2', name: 'Ejercicios.docx', type: 'word', size: '1.1 MB' },
  ]);

  const handleFileUpload = (fileType: string) => {
    // Mock file upload - in production this would use expo-document-picker
    Alert.alert(
      'Subir Archivo',
      `Seleccionar archivo de tipo: ${fileType}`,
      [{ text: 'OK' }]
    );
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId));
  };

  const handlePublish = () => {
    if (!className.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para la clase');
      return;
    }
    Alert.alert('Éxito', 'Clase publicada correctamente', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const handleSaveDraft = () => {
    if (!className.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para la clase');
      return;
    }
    Alert.alert('Éxito', 'Borrador guardado correctamente', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'word': return '📝';
      case 'powerpoint': return '📊';
      case 'image': return '🖼️';
      default: return '📎';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Class Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre de la Clase</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Matemáticas - Fracciones"
              placeholderTextColor={theme.colors.text.tertiary}
              value={className}
              onChangeText={setClassName}
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe el contenido de la clase..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* File Upload Section */}
          <View style={styles.uploadSection}>
            <Text style={styles.sectionTitle}>Subir Archivos</Text>
            <Text style={styles.sectionSubtitle}>
              Agrega materiales de apoyo para tu clase
            </Text>

            {/* File Type Buttons */}
            <View style={styles.fileTypeGrid}>
              <TouchableOpacity
                style={styles.fileTypeButton}
                onPress={() => handleFileUpload('PDF')}
              >
                <Text style={styles.fileTypeIcon}>📄</Text>
                <Text style={styles.fileTypeText}>PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.fileTypeButton}
                onPress={() => handleFileUpload('Word')}
              >
                <Text style={styles.fileTypeIcon}>📝</Text>
                <Text style={styles.fileTypeText}>Word</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.fileTypeButton}
                onPress={() => handleFileUpload('PowerPoint')}
              >
                <Text style={styles.fileTypeIcon}>📊</Text>
                <Text style={styles.fileTypeText}>PPT</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.fileTypeButton}
                onPress={() => handleFileUpload('Imagen')}
              >
                <Text style={styles.fileTypeIcon}>🖼️</Text>
                <Text style={styles.fileTypeText}>Imagen</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Uploaded Files List - Separate section for better visibility */}
          {uploadedFiles.length > 0 && (
            <View style={styles.uploadedFilesSection}>
              <Text style={styles.uploadedFilesTitle}>Archivos Subidos ({uploadedFiles.length})</Text>
              {uploadedFiles.map((file) => (
                <View key={file.id} style={styles.fileItem}>
                  <Text style={styles.fileItemIcon}>{getFileIcon(file.type)}</Text>
                  <View style={styles.fileItemContent}>
                    <Text style={styles.fileItemName}>{file.name}</Text>
                    <Text style={styles.fileItemSize}>{file.size}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeFileButton}
                    onPress={() => handleRemoveFile(file.id)}
                  >
                    <Text style={styles.removeFileIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.publishButton}
              onPress={handlePublish}
            >
              <Text style={styles.publishButtonText}>Publicar Clase</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.draftButton}
              onPress={handleSaveDraft}
            >
              <Text style={styles.draftButtonText}>Guardar como Borrador</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: theme.fontWeight.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.base,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.base,
    color: theme.colors.text.primary,
    outlineStyle: 'none',
  } as any,
  textArea: {
    minHeight: 100,
    paddingTop: theme.spacing.md,
  },
  uploadSection: {
    marginBottom: theme.spacing.base,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: theme.fontWeight.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.base,
  },
  fileTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  fileTypeButton: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: theme.colors.background.primary,
    borderWidth: 2,
    borderColor: theme.colors.teacher.border,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  fileTypeIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  fileTypeText: {
    fontSize: 12,
    fontWeight: theme.fontWeight.medium as any,
    color: theme.colors.text.primary,
  },
  uploadedFilesSection: {
    marginBottom: theme.spacing.lg,
    paddingTop: theme.spacing.base,
  },
  uploadedFilesTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeight.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  fileItemIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  fileItemContent: {
    flex: 1,
  },
  fileItemName: {
    fontSize: 14,
    fontWeight: theme.fontWeight.medium as any,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  fileItemSize: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
  },
  removeFileButton: {
    padding: theme.spacing.sm,
  },
  removeFileIcon: {
    fontSize: 20,
  },
  actionButtons: {
    gap: theme.spacing.md,
  },
  publishButton: {
    backgroundColor: theme.colors.teacher.main,
    paddingVertical: theme.spacing.base,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.base,
  },
  publishButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 16,
    fontWeight: theme.fontWeight.semibold as any,
  },
  draftButton: {
    backgroundColor: theme.colors.background.primary,
    borderWidth: 2,
    borderColor: theme.colors.teacher.main,
    paddingVertical: theme.spacing.base,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  draftButtonText: {
    color: theme.colors.teacher.main,
    fontSize: 16,
    fontWeight: theme.fontWeight.semibold as any,
  },
  bottomSpacer: {
    height: theme.spacing.xl,
  },
});
