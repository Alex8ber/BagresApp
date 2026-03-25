/**
 * TeacherLibraryScreen
 * 
 * Library screen for teachers showing created classes and materials.
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { TeacherTabScreenProps } from '@/types/navigation';
import { theme } from '@/styles';

type Props = TeacherTabScreenProps<'Library'>;

interface ClassItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  status: 'Publicado' | 'Borrador' | 'Archivado';
  date: string;
}

/**
 * TeacherLibraryScreen Component
 * 
 * Shows library of created classes and materials with search and filter.
 */
export default function TeacherLibraryScreen(_props: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  // Mock data for classes
  const classes: ClassItem[] = [
    {
      id: '1',
      icon: '📚',
      title: 'Matemáticas - Fracciones',
      description: 'Evaluación sobre operaciones con fracciones',
      status: 'Publicado',
      date: '15 Mar 2026',
    },
    {
      id: '2',
      icon: '🔬',
      title: 'Ciencias - Sistema Solar',
      description: 'Quiz interactivo sobre planetas',
      status: 'Publicado',
      date: '12 Mar 2026',
    },
    {
      id: '3',
      icon: '📖',
      title: 'Lenguaje - Comprensión Lectora',
      description: 'Ejercicios de lectura y análisis',
      status: 'Borrador',
      date: '10 Mar 2026',
    },
    {
      id: '4',
      icon: '🌍',
      title: 'Geografía - Continentes',
      description: 'Evaluación sobre geografía mundial',
      status: 'Publicado',
      date: '8 Mar 2026',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Publicado':
        return { bg: '#E8F5E9', text: '#2E7D32', border: '#81C784' };
      case 'Borrador':
        return { bg: '#FFF3E0', text: '#E65100', border: '#FFB74D' };
      case 'Archivado':
        return { bg: '#F5F5F5', text: '#616161', border: '#BDBDBD' };
      default:
        return { bg: '#F5F5F5', text: '#616161', border: '#BDBDBD' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.brandEmoji}>🐟</Text>
              <View>
                <Text style={styles.brandText}>La Ludoteca</Text>
                <Text style={styles.headerTitle}>Mi Biblioteca</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Text style={styles.notificationIcon}>🔔</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search and Filter Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar clases..."
              placeholderTextColor={theme.colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Card */}
        <View style={styles.featuredCard}>
          <Text style={styles.featuredIcon}>⭐</Text>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>Planificación Semanal Interactiva</Text>
            <Text style={styles.featuredDescription}>
              Organiza tus clases de la semana
            </Text>
          </View>
          <TouchableOpacity style={styles.featuredButton}>
            <Text style={styles.featuredButtonText}>Ver</Text>
          </TouchableOpacity>
        </View>

        {/* Classes List */}
        <View style={styles.classesSection}>
          <Text style={styles.sectionTitle}>Tus Clases</Text>
          {classes.map((item) => {
            const statusColors = getStatusColor(item.status);
            return (
              <TouchableOpacity key={item.id} style={styles.classCard}>
                <View style={styles.classIconContainer}>
                  <Text style={styles.classIcon}>{item.icon}</Text>
                </View>
                <View style={styles.classContent}>
                  <Text style={styles.classTitle}>{item.title}</Text>
                  <Text style={styles.classDescription}>{item.description}</Text>
                  <View style={styles.classFooter}>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: statusColors.bg,
                          borderColor: statusColors.border,
                        },
                      ]}
                    >
                      <Text style={[styles.statusText, { color: statusColors.text }]}>
                        {item.status}
                      </Text>
                    </View>
                    <Text style={styles.classDate}>{item.date}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => navigation.navigate('TeacherCreateClass' as never)}
        >
          <Text style={styles.uploadIcon}>📤</Text>
          <Text style={styles.uploadButtonText}>Subir Nueva Evaluación</Text>
        </TouchableOpacity>

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
  header: {
    backgroundColor: theme.colors.teacher.main,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.base,
    paddingBottom: theme.spacing.lg,
    borderBottomLeftRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  brandEmoji: {
    fontSize: 40,
  },
  brandText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: theme.fontWeight.bold as any,
    color: theme.colors.text.inverse,
  },
  notificationButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    fontSize: 22,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.base,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: theme.fontSize.base,
    color: theme.colors.text.primary,
    outlineStyle: 'none',
  } as any,
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  filterIcon: {
    fontSize: 20,
  },
  featuredCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.base,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  featuredIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  featuredContent: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeight.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  featuredButton: {
    backgroundColor: theme.colors.teacher.main,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.base,
  },
  featuredButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 14,
    fontWeight: theme.fontWeight.semibold as any,
  },
  classesSection: {
    paddingHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: theme.fontWeight.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.base,
  },
  classCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.base,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    ...theme.shadows.sm,
  },
  classIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius.base,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  classIcon: {
    fontSize: 28,
  },
  classContent: {
    flex: 1,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: theme.fontWeight.semibold as any,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  classDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  classFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: theme.fontWeight.medium as any,
  },
  classDate: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.teacher.main,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.base,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.base,
  },
  uploadIcon: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  uploadButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 16,
    fontWeight: theme.fontWeight.semibold as any,
  },
  bottomSpacer: {
    height: theme.spacing.xl,
  },
});
