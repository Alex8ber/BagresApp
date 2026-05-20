/**
 * TeacherMaterialDetailScreen
 * 
 * Screen showing material details with options to open or download.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/shared/Button';
import { theme } from '@/styles/theme';
import type { RootStackScreenProps } from '@/types/navigation';
import { supabase } from '@/services/supabase/client';
import type { ClassMaterial } from '@/types/database';

type Props = RootStackScreenProps<'TeacherMaterialDetail'>;

const MATERIAL_ICONS: Record<string, string> = {
  pdf: '📄',
  video: '🎥',
  document: '📝',
  link: '🔗',
  image: '🖼️',
};

// Using teacher blue color for all materials for consistency
const MATERIAL_COLOR = '#1976D2'; // Teacher blue color

export default function TeacherMaterialDetailScreen({ route }: Props) {
  const { materialId, classId } = route.params;
  const [material, setMaterial] = useState<ClassMaterial | null>(null);
  const [className, setClassName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterialAndClass();
  }, [materialId, classId]);

  const fetchMaterialAndClass = async () => {
    try {
      setLoading(true);

      // Fetch material
      const { data: materialData, error: materialError } = await supabase
        .from('class_materials')
        .select('*')
        .eq('id', materialId)
        .single();

      if (materialError) throw materialError;

      // Fetch class name
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('name')
        .eq('id', classId)
        .single<{ name: string }>();

      if (classError) throw classError;

      setMaterial(materialData);
      setClassName(classData?.name || '');
    } catch (error) {
      console.error('Error fetching material:', error);
      alert('No se pudo cargar el material');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFile = async () => {
    if (!material?.file_url) {
      alert('Este material no tiene un archivo asociado');
      return;
    }

    try {
      const supported = await Linking.canOpenURL(material.file_url);
      if (supported) {
        await Linking.openURL(material.file_url);
      } else {
        alert('No se puede abrir este tipo de archivo');
      }
    } catch (error) {
      console.error('Error opening file:', error);
      alert('No se pudo abrir el archivo');
    }
  };

  const handleDownloadFile = async () => {
    if (!material?.file_url) {
      alert('Este material no tiene un archivo asociado');
      return;
    }

    try {
      await Linking.openURL(material.file_url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('No se pudo descargar el archivo');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.teacher.main} />
        <Text style={styles.loadingText}>Cargando material...</Text>
      </View>
    );
  }

  if (!material) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No se pudo cargar el material</Text>
      </View>
    );
  }

  const materialIcon = MATERIAL_ICONS[material.material_type] || '📎';

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <View style={[styles.headerCard, { borderLeftColor: MATERIAL_COLOR }]}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconEmoji}>{materialIcon}</Text>
          </View>
          
          <View style={styles.headerContent}>
            <Text style={styles.className}>{className}</Text>
            <Text style={styles.title}>{material.title}</Text>
            <View style={[styles.typeBadge, { backgroundColor: MATERIAL_COLOR + '20' }]}>
              <Text style={[styles.typeText, { color: MATERIAL_COLOR }]}>
                {material.material_type.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Description Section */}
        {material.description && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={20} color={theme.colors.text.primary} />
              <Text style={styles.sectionTitle}>Descripción</Text>
            </View>
            <Text style={styles.description}>{material.description}</Text>
          </View>
        )}

        {/* Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.text.primary} />
            <Text style={styles.sectionTitle}>Detalles</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={18} color={theme.colors.text.secondary} />
            <Text style={styles.detailLabel}>Fecha de creación:</Text>
            <Text style={styles.detailValue}>
              {new Date(material.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          {material.available_from && (
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color={theme.colors.text.secondary} />
              <Text style={styles.detailLabel}>Disponible desde:</Text>
              <Text style={styles.detailValue}>
                {new Date(material.available_from).toLocaleDateString('es-ES')}
              </Text>
            </View>
          )}

          {material.available_until && (
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color={theme.colors.text.secondary} />
              <Text style={styles.detailLabel}>Disponible hasta:</Text>
              <Text style={styles.detailValue}>
                {new Date(material.available_until).toLocaleDateString('es-ES')}
              </Text>
            </View>
          )}
        </View>

        {/* File Info Section */}
        {material.file_url && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="link-outline" size={20} color={theme.colors.text.primary} />
              <Text style={styles.sectionTitle}>Archivo</Text>
            </View>
            
            <View style={styles.fileInfo}>
              <Ionicons name="document-attach" size={24} color={MATERIAL_COLOR} />
              <Text style={styles.fileUrl} numberOfLines={1}>
                {material.file_url.split('/').pop()}
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={handleOpenFile}
            style={[styles.actionButton, { backgroundColor: MATERIAL_COLOR }]}
          >
            <Ionicons name="open-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>  Abrir Archivo</Text>
          </Button>

          <Button
            variant="secondary"
            size="large"
            fullWidth
            onPress={handleDownloadFile}
            style={styles.actionButton}
          >
            <Ionicons name="download-outline" size={20} color={theme.colors.teacher.main} />
            <Text style={[styles.buttonText, { color: theme.colors.teacher.main }]}>  Descargar</Text>
          </Button>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  headerCard: {
    backgroundColor: '#fff',
    padding: 24,
    marginBottom: 16,
    borderLeftWidth: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 40,
  },
  headerContent: {
    flex: 1,
  },
  className: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: theme.colors.text.secondary,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text.primary,
    textAlign: 'right',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
  },
  fileUrl: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  actionsContainer: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSpacer: {
    height: 40,
  },
});
