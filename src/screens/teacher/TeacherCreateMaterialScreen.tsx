/**
 * TeacherCreateMaterialScreen
 * 
 * Screen for creating and uploading educational materials for a specific class.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { useForm } from '@/hooks/useForm';
import { validateRequired } from '@/utils/validation';
import { theme } from '@/styles/theme';
import type { RootStackScreenProps } from '@/types/navigation';
import { createMaterial, uploadMaterialFile } from '@/services';

type Props = RootStackScreenProps<'TeacherCreateMaterial'>;

interface MaterialFormData {
  title: string;
  description: string;
  material_type: 'pdf' | 'video' | 'document' | 'link' | 'image';
  file_url: string;
}

interface MaterialFormErrors {
  title?: string;
  description?: string;
  file_url?: string;
}

const MATERIAL_TYPES = [
  { value: 'pdf', label: 'PDF', icon: '📄', color: '#E53935' },
  { value: 'video', label: 'Video', icon: '🎥', color: '#1E88E5' },
  { value: 'document', label: 'Documento', icon: '📝', color: '#43A047' },
  { value: 'link', label: 'Enlace', icon: '🔗', color: '#FB8C00' },
  { value: 'image', label: 'Imagen', icon: '🖼️', color: '#8E24AA' },
] as const;

export default function TeacherCreateMaterialScreen({ navigation, route }: Props) {
  const { classId, className } = route.params;
  const [error, setError] = useState<string | undefined>();
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');

  const { values, errors, handleChange, handleSubmit, setFieldValue, isSubmitting } = useForm<MaterialFormData>({
    initialValues: {
      title: '',
      description: '',
      material_type: 'pdf',
      file_url: '',
    },
    validate: (values) => {
      const errors: MaterialFormErrors = {};
      
      console.log('Validating form with values:', values);
      
      const titleError = validateRequired(values.title, 'Título');
      if (titleError) {
        errors.title = titleError;
        console.log('Title error:', titleError);
      }
      
      const urlError = validateRequired(values.file_url, 'URL del archivo');
      if (urlError && uploadMode === 'url') {
        errors.file_url = urlError;
        console.log('URL error:', urlError);
      }
      
      if (uploadMode === 'file' && !selectedFile) {
        errors.file_url = 'Debes seleccionar un archivo';
        console.log('File error: No file selected');
      }
      
      console.log('Validation errors:', errors);
      return errors;
    },
    onSubmit: async (data) => {
      try {
        setError(undefined);

        let fileUrl = data.file_url;
        
        // Si se seleccionó un archivo, subirlo a Supabase Storage
        if (uploadMode === 'file' && selectedFile) {
          console.log('Uploading file to Supabase Storage...');
          setError('Subiendo archivo...');
          
          fileUrl = await uploadMaterialFile(
            classId,
            selectedFile.uri,
            selectedFile.name,
            selectedFile.mimeType || 'application/octet-stream'
          );
          
          console.log('File uploaded successfully:', fileUrl);
        }

        console.log('Creating material with data:', {
          class_id: classId,
          title: data.title,
          description: data.description || null,
          material_type: data.material_type,
          file_url: fileUrl,
          available_from: null,
          available_until: null,
        });

        const result = await createMaterial({
          class_id: classId,
          title: data.title,
          description: data.description || null,
          material_type: data.material_type,
          file_url: fileUrl,
          available_from: null,
          available_until: null,
        });

        console.log('Material created successfully:', result);

        // Regresar a Library automáticamente
        navigation.goBack();
      } catch (err) {
        console.error('Error creating material:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error al crear el material';
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
      }
    },
  });

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile(file);
        setFieldValue('file_url', file.uri);
        console.log('File selected:', file);
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Class Info */}
        <View style={styles.classInfo}>
          <Text style={styles.classLabel}>Clase seleccionada</Text>
          <Text style={styles.className}>{className}</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Información del Material</Text>

          <Text style={styles.label}>Título *</Text>
          <Input
            placeholder="Ej: Introducción a las fracciones"
            value={values.title}
            onChangeText={handleChange('title')}
            error={errors.title}
            editable={!isSubmitting}
            focusColor={theme.colors.teacher.main}
          />

          <Text style={styles.label}>Descripción</Text>
          <Input
            placeholder="Describe brevemente el contenido..."
            value={values.description}
            onChangeText={handleChange('description')}
            error={errors.description}
            editable={!isSubmitting}
            multiline
            numberOfLines={3}
            focusColor={theme.colors.teacher.main}
          />

          {/* Upload Mode Selector - MOVED HERE */}
          <Text style={styles.label}>Método de Carga *</Text>
          <View style={styles.uploadModeContainer}>
            <TouchableOpacity
              style={[
                styles.uploadModeButton,
                uploadMode === 'url' && styles.uploadModeButtonActive,
              ]}
              onPress={() => {
                setUploadMode('url');
                setSelectedFile(null);
              }}
              disabled={isSubmitting}
            >
              <Ionicons 
                name="link-outline" 
                size={20} 
                color={uploadMode === 'url' ? theme.colors.teacher.main : theme.colors.text.secondary} 
              />
              <Text style={[
                styles.uploadModeText,
                uploadMode === 'url' && styles.uploadModeTextActive,
              ]}>
                URL / Enlace
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.uploadModeButton,
                uploadMode === 'file' && styles.uploadModeButtonActive,
              ]}
              onPress={() => {
                setUploadMode('file');
                setFieldValue('file_url', '');
              }}
              disabled={isSubmitting}
            >
              <Ionicons 
                name="cloud-upload-outline" 
                size={20} 
                color={uploadMode === 'file' ? theme.colors.teacher.main : theme.colors.text.secondary} 
              />
              <Text style={[
                styles.uploadModeText,
                uploadMode === 'file' && styles.uploadModeTextActive,
              ]}>
                Subir Archivo
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Tipo de Material *</Text>
          <View style={styles.typeGrid}>
            {MATERIAL_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeOption,
                  values.material_type === type.value && styles.typeOptionActive,
                  { borderColor: values.material_type === type.value ? type.color : '#E0E0E0' },
                ]}
                onPress={() => setFieldValue('material_type', type.value)}
                disabled={isSubmitting}
              >
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text style={[
                  styles.typeLabel,
                  values.material_type === type.value && { color: type.color },
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {uploadMode === 'url' ? (
            <>
              <Text style={styles.label}>URL del Archivo *</Text>
              <Input
                placeholder="https://ejemplo.com/archivo.pdf"
                value={values.file_url}
                onChangeText={handleChange('file_url')}
                error={errors.file_url}
                editable={!isSubmitting}
                autoCapitalize="none"
                keyboardType="url"
                focusColor={theme.colors.teacher.main}
              />
              <Text style={styles.helperText}>
                💡 Puedes usar enlaces de Google Drive, Dropbox, YouTube, etc.
              </Text>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.filePickerButton}
                onPress={handlePickDocument}
                disabled={isSubmitting}
              >
                <Ionicons name="document-attach-outline" size={24} color={theme.colors.teacher.main} />
                <Text style={styles.filePickerText}>
                  {selectedFile ? 'Cambiar archivo' : 'Seleccionar archivo'}
                </Text>
              </TouchableOpacity>

              {selectedFile && (
                <View style={styles.selectedFileContainer}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.selectedFileName} numberOfLines={1}>
                    {selectedFile.name}
                  </Text>
                  <Text style={styles.selectedFileSize}>
                    ({(selectedFile.size! / 1024 / 1024).toFixed(2)} MB)
                  </Text>
                </View>
              )}

              {errors.file_url && (
                <Text style={styles.errorTextSmall}>{errors.file_url}</Text>
              )}

              <Text style={styles.helperText}>
                💡 Puedes subir PDFs, documentos, imágenes, videos, etc.
              </Text>
            </>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={handleSubmit}
            loading={isSubmitting}
            style={styles.submitButton}
          >
            Crear Material
          </Button>

          <Button
            variant="secondary"
            size="large"
            fullWidth
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
            style={styles.cancelButton}
          >
            Cancelar
          </Button>
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
    padding: 20,
    paddingBottom: 40,
  },
  classInfo: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.teacher.main,
  },
  classLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.teacher.main,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  className: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 8,
    marginTop: 16,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  typeOption: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  typeOptionActive: {
    backgroundColor: '#fff',
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  helperText: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginTop: 8,
    lineHeight: 18,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: theme.colors.teacher.main,
  },
  cancelButton: {
    marginTop: 12,
  },
  uploadModeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  uploadModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
    gap: 8,
  },
  uploadModeButtonActive: {
    backgroundColor: '#E3F2FD',
    borderColor: theme.colors.teacher.main,
  },
  uploadModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  uploadModeTextActive: {
    color: theme.colors.teacher.main,
  },
  filePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.teacher.main,
    borderStyle: 'dashed',
    backgroundColor: '#F5F7FA',
    gap: 12,
    marginTop: 8,
  },
  filePickerText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.teacher.main,
  },
  selectedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  selectedFileName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  selectedFileSize: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  errorTextSmall: {
    fontSize: 13,
    color: '#C62828',
    marginTop: 8,
  },
});
