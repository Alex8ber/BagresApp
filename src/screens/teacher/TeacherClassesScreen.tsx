/**
 * TeacherClassesScreen
 * 
 * Displays a list of classes for the authenticated teacher.
 * Shows class codes for student enrollment and class management options.
 * 
 * Requirements: 1.9, 2.1, 5.2, 5.9, 10.6, 10.14, 11.1, 11.9
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ActivityIndicator, 
  FlatList, 
  TouchableOpacity,
  Alert,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import type { TeacherTabScreenProps } from '@/types/navigation';
import { useTeacherClasses } from '@/hooks';
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/styles';
import type { Class } from '@/types/database';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Props = TeacherTabScreenProps<'Classes'>;

/**
 * Generate a random 6-character class code
 */
const generateClassCode = (classId: string): string => {
  // In production, this would be stored in the database
  // For now, generate a consistent code based on the class ID
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    const index = (classId.charCodeAt(i % classId.length) + i) % chars.length;
    code += chars[index];
  }
  return code;
};

/**
 * TeacherClassesScreen Component
 * 
 * Displays teacher's classes with class codes and management options.
 */
export default function TeacherClassesScreen(_props: Props) {
  const navigation = useNavigation<NavigationProp>();
  const { profile } = useAuth();
  const { classes, loading, error, refetch } = useTeacherClasses();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    // In a real app, use Clipboard API
    setCopiedCode(code);
    Alert.alert('Código Copiado', `Código de clase: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleShareCode = async (className: string, code: string) => {
    try {
      await Share.share({
        message: `¡Únete a mi clase "${className}"! Usa el código: ${code}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCreateClass = () => {
    navigation.navigate('TeacherCreateClass', {});
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.teacher.main} />
          <Text style={styles.loadingText}>Cargando clases...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error.main} />
          <Text style={styles.errorText}>Error al cargar clases</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderClassItem = ({ item }: { item: Class }) => {
    const classCode = generateClassCode(item.id);
    const isCopied = copiedCode === classCode;

    return (
      <View style={styles.classCard}>
        {/* Class Header */}
        <View style={styles.classHeader}>
          <View style={styles.classIconContainer}>
            <Text style={styles.classIcon}>📚</Text>
          </View>
          <View style={styles.classHeaderInfo}>
            <Text style={styles.className}>{item.name}</Text>
            <View style={styles.classMetaRow}>
              <View style={styles.metaBadge}>
                <Ionicons name="book-outline" size={12} color={theme.colors.teacher.main} />
                <Text style={styles.metaText}>{item.subject}</Text>
              </View>
              <View style={styles.metaBadge}>
                <Ionicons name="school-outline" size={12} color={theme.colors.teacher.main} />
                <Text style={styles.metaText}>{item.grade}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description */}
        {item.description && (
          <Text style={styles.classDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        {/* Class Code Section */}
        <View style={styles.codeSection}>
          <View style={styles.codeLabelRow}>
            <Ionicons name="key-outline" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.codeLabel}>Código de Clase</Text>
          </View>
          <View style={styles.codeContainer}>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{classCode}</Text>
            </View>
            <TouchableOpacity
              style={[styles.codeActionButton, isCopied && styles.codeActionButtonActive]}
              onPress={() => handleCopyCode(classCode)}
            >
              <Ionicons 
                name={isCopied ? "checkmark" : "copy-outline"} 
                size={20} 
                color={isCopied ? "#fff" : theme.colors.teacher.main} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.codeActionButton}
              onPress={() => handleShareCode(item.name, classCode)}
            >
              <Ionicons name="share-social-outline" size={20} color={theme.colors.teacher.main} />
            </TouchableOpacity>
          </View>
          <Text style={styles.codeHint}>
            Los estudiantes pueden unirse con este código
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="people" size={18} color={theme.colors.text.secondary} />
            <Text style={styles.statText}>0 estudiantes</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="document-text-outline" size={18} color={theme.colors.text.secondary} />
            <Text style={styles.statText}>0 materiales</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="school-outline" size={48} color={theme.colors.teacher.main} />
      </View>
      <Text style={styles.emptyTitle}>No tienes clases aún</Text>
      <Text style={styles.emptySubtitle}>
        Crea tu primera clase para comenzar a gestionar estudiantes y materiales
      </Text>
      <TouchableOpacity style={styles.emptyCreateButton} onPress={handleCreateClass}>
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.emptyCreateButtonText}>Crear Primera Clase</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Professional Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👨‍🏫</Text>
          </View>
          <View>
            <Text style={styles.greeting}>MIS CLASES</Text>
            <Text style={styles.userName}>{profile?.fullName || 'Profesor'}</Text>
          </View>
        </View>
        <View style={styles.headerStats}>
          <Text style={styles.statsNumber}>{classes.length}</Text>
          <Text style={styles.statsLabel}>{classes.length === 1 ? 'Clase' : 'Clases'}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.container}>
        {classes.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={classes}
            renderItem={renderClassItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Floating Action Button */}
      {classes.length > 0 && (
        <TouchableOpacity 
          style={styles.fab} 
          onPress={handleCreateClass}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  // Professional Header
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
  headerStats: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  statsLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
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
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: theme.colors.teacher.main,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Empty State
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  emptyCreateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.teacher.main,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyCreateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  listContent: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  classHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  classIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  classIcon: {
    fontSize: 28,
  },
  classHeaderInfo: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 6,
  },
  classMetaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.teacher.main,
    fontWeight: '600',
  },
  classDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  codeSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  codeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  codeLabel: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  codeBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: theme.colors.teacher.main,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  codeText: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.teacher.main,
    letterSpacing: 2,
  },
  codeActionButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeActionButtonActive: {
    backgroundColor: theme.colors.teacher.main,
  },
  codeHint: {
    fontSize: 12,
    color: theme.colors.text.tertiary,
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.teacher.main,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
