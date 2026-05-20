/**
 * TeacherLibraryScreen
 * 
 * Library screen showing materials and quizzes organized by class.
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
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { TeacherTabScreenProps } from '@/types/navigation';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { RootStackScreenProps, RootStackParamList } from '@/types/navigation';
import { useAuth, useLibrary, useTeacherClasses } from '@/hooks';
import { theme } from '@/styles';
import type { Teacher } from '@/types/models';
import { deleteMaterial, deleteMaterialFile, deleteQuiz } from '@/services';

type Props = CompositeScreenProps<
  TeacherTabScreenProps<'Library'>,
  RootStackScreenProps<keyof RootStackParamList>
>;
type TabType = 'materials' | 'quizzes';

/**
 * TeacherLibraryScreen Component
 * 
 * Shows library of materials and quizzes organized by class.
 */
export default function TeacherLibraryScreen({ navigation }: Props) {
  const { user, profile } = useAuth();
  const teacherProfile = profile as Teacher | null;
  const { materials, quizzes, loading, refetch } = useLibrary(user?.id);
  const { classes } = useTeacherClasses();
  const [activeTab, setActiveTab] = useState<TabType>('materials');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showClassSelector, setShowClassSelector] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'material' | 'quiz' | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'material' | 'quiz'; item: any } | null>(null);

  // Refetch when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Group materials by class
  const materialsByClass = materials.reduce((acc, material) => {
    if (!acc[material.class_id]) {
      acc[material.class_id] = [];
    }
    acc[material.class_id].push(material);
    return acc;
  }, {} as Record<string, typeof materials>);

  // Group quizzes by class
  const quizzesByClass = quizzes.reduce((acc, quiz) => {
    if (!acc[quiz.class_id]) {
      acc[quiz.class_id] = [];
    }
    acc[quiz.class_id].push(quiz);
    return acc;
  }, {} as Record<string, typeof quizzes>);

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'video': return '🎥';
      case 'document': return '📝';
      case 'link': return '🔗';
      case 'image': return '🖼️';
      default: return '📎';
    }
  };

  const getStatusBadge = (quiz: typeof quizzes[0]) => {
    if (!quiz.is_published) {
      return { text: 'Borrador', color: '#FF9800', bg: '#FFF3E0' };
    }
    const now = new Date();
    const availableFrom = quiz.available_from ? new Date(quiz.available_from) : null;
    const availableUntil = quiz.available_until ? new Date(quiz.available_until) : null;

    if (availableFrom && now < availableFrom) {
      return { text: 'Programado', color: '#2196F3', bg: '#E3F2FD' };
    }
    if (availableUntil && now > availableUntil) {
      return { text: 'Cerrado', color: '#757575', bg: '#F5F5F5' };
    }
    return { text: 'Activo', color: '#4CAF50', bg: '#E8F5E9' };
  };

  const handleAddContent = () => {
    if (classes.length === 0) {
      alert('Primero debes crear una clase antes de agregar contenido');
      return;
    }
    setShowAddModal(true);
  };

  const handleSelectAction = (action: 'material' | 'quiz') => {
    setSelectedAction(action);
    setShowAddModal(false);
    setShowClassSelector(true);
  };

  const handleSelectClass = (classId: string) => {
    setShowClassSelector(false);
    const selectedClass = classes.find(c => c.id === classId);
    if (!selectedClass) return;

    if (selectedAction === 'material') {
      navigation.navigate('TeacherCreateMaterial', {
        classId: classId,
        className: selectedClass.name,
      });
    } else if (selectedAction === 'quiz') {
      navigation.navigate('TeacherCreateQuiz', {
        classId: classId,
        className: selectedClass.name,
      });
    }
  };

  const handleOpenMaterial = (material: typeof materials[0]) => {
    navigation.navigate('TeacherMaterialDetail', {
      materialId: material.id,
      classId: material.class_id,
    });
  };

  const handleOpenQuiz = (quiz: typeof quizzes[0]) => {
    navigation.navigate('QuizDetail', {
      quizId: quiz.id,
      classId: quiz.class_id,
    });
  };

  const handleDeleteMaterial = async (material: typeof materials[0]) => {
    setItemToDelete({ type: 'material', item: material });
    setShowDeleteModal(true);
  };

  const handleDeleteQuiz = async (quiz: typeof quizzes[0]) => {
    setItemToDelete({ type: 'quiz', item: quiz });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'material') {
        const material = itemToDelete.item;
        
        // Delete file from storage if it exists
        if (material.file_url && material.file_url.includes('/materials/')) {
          await deleteMaterialFile(material.file_url);
        }
        
        // Delete material from database
        await deleteMaterial(material.id);
      } else {
        // Delete quiz
        await deleteQuiz(itemToDelete.item.id);
      }
      
      // Refresh the list
      refetch();
      
      // Close modal
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('No se pudo eliminar el elemento');
    }
  };

  const renderMaterials = () => {
    if (materials.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>No hay materiales aún</Text>
          <Text style={styles.emptySubtitle}>
            Comienza agregando contenido educativo para tus clases
          </Text>
        </View>
      );
    }

    return classes.map((classItem) => {
      const classMaterials = materialsByClass[classItem.id] || [];
      if (classMaterials.length === 0) return null;

      return (
        <View key={classItem.id} style={styles.classSection}>
          <View style={styles.classSectionHeader}>
            {classItem.class_image_url ? (
              <Image source={{ uri: classItem.class_image_url }} style={styles.classIconSmall} />
            ) : (
              <Text style={styles.classIconSmall}>{classItem.class_icon || '📚'}</Text>
            )}
            <Text style={styles.classSectionTitle}>{classItem.name}</Text>
            <Text style={styles.classSectionCount}>({classMaterials.length})</Text>
          </View>

          {classMaterials.map((material) => (
            <View key={material.id} style={styles.itemCardContainer}>
              <TouchableOpacity 
                style={styles.itemCard}
                onPress={() => handleOpenMaterial(material)}
              >
                <View style={styles.itemIconContainer}>
                  <Text style={styles.itemIcon}>{getMaterialIcon(material.material_type)}</Text>
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{material.title}</Text>
                  {material.description && (
                    <Text style={styles.itemDescription} numberOfLines={2}>
                      {material.description}
                    </Text>
                  )}
                  <View style={styles.itemFooter}>
                    <Text style={styles.itemType}>{material.material_type.toUpperCase()}</Text>
                    {material.available_from && (
                      <Text style={styles.itemDate}>
                        Desde: {new Date(material.available_from).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
              </TouchableOpacity>
              
              {/* Delete Button */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteMaterial(material)}
              >
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      );
    });
  };

  const renderQuizzes = () => {
    if (quizzes.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>No hay cuestionarios aún</Text>
          <Text style={styles.emptySubtitle}>
            Crea evaluaciones para medir el progreso de tus estudiantes
          </Text>
        </View>
      );
    }

    return classes.map((classItem) => {
      const classQuizzes = quizzesByClass[classItem.id] || [];
      if (classQuizzes.length === 0) return null;

      return (
        <View key={classItem.id} style={styles.classSection}>
          <View style={styles.classSectionHeader}>
            {classItem.class_image_url ? (
              <Image source={{ uri: classItem.class_image_url }} style={styles.classIconSmall} />
            ) : (
              <Text style={styles.classIconSmall}>{classItem.class_icon || '📚'}</Text>
            )}
            <Text style={styles.classSectionTitle}>{classItem.name}</Text>
            <Text style={styles.classSectionCount}>({classQuizzes.length})</Text>
          </View>

          {classQuizzes.map((quiz) => {
            const status = getStatusBadge(quiz);
            return (
              <View key={quiz.id} style={styles.itemCardContainer}>
                <TouchableOpacity 
                  style={styles.itemCard}
                  onPress={() => handleOpenQuiz(quiz)}
                >
                  <View style={styles.itemIconContainer}>
                    <Text style={styles.itemIcon}>📝</Text>
                  </View>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>{quiz.title}</Text>
                    {quiz.description && (
                      <Text style={styles.itemDescription} numberOfLines={2}>
                        {quiz.description}
                      </Text>
                    )}
                    <View style={styles.itemFooter}>
                      <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                        <Text style={[styles.statusText, { color: status.color }]}>
                          {status.text}
                        </Text>
                      </View>
                      {quiz.duration_minutes && (
                        <Text style={styles.itemMeta}>⏱️ {quiz.duration_minutes} min</Text>
                      )}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
                </TouchableOpacity>
                
                {/* Delete Button */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteQuiz(quiz)}
                >
                  <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            {teacherProfile?.avatarUrl ? (
              <Image source={{ uri: teacherProfile.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>👨‍🏫</Text>
            )}
          </View>
          <View>
            <Text style={styles.greeting}>BIBLIOTECA</Text>
            <Text style={styles.userName}>{profile?.fullName || 'Profesor'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'materials' && styles.tabActive]}
          onPress={() => setActiveTab('materials')}
        >
          <Text style={[styles.tabText, activeTab === 'materials' && styles.tabTextActive]}>
            Materiales ({materials.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'quizzes' && styles.tabActive]}
          onPress={() => setActiveTab('quizzes')}
        >
          <Text style={[styles.tabText, activeTab === 'quizzes' && styles.tabTextActive]}>
            Cuestionarios ({quizzes.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.teacher.main} />
            <Text style={styles.loadingText}>Cargando biblioteca...</Text>
          </View>
        ) : (
          <View style={styles.content}>
            {activeTab === 'materials' ? renderMaterials() : renderQuizzes()}
          </View>
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddContent}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Content Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowAddModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Qué deseas agregar?</Text>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleSelectAction('material')}
            >
              <View style={styles.modalOptionIcon}>
                <Text style={styles.modalOptionEmoji}>📚</Text>
              </View>
              <View style={styles.modalOptionText}>
                <Text style={styles.modalOptionTitle}>Material de Estudio</Text>
                <Text style={styles.modalOptionSubtitle}>PDF, videos, documentos, enlaces</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalOption}
              onPress={() => handleSelectAction('quiz')}
            >
              <View style={styles.modalOptionIcon}>
                <Text style={styles.modalOptionEmoji}>📝</Text>
              </View>
              <View style={styles.modalOptionText}>
                <Text style={styles.modalOptionTitle}>Cuestionario</Text>
                <Text style={styles.modalOptionSubtitle}>Evaluaciones y pruebas</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Class Selector Modal */}
      <Modal
        visible={showClassSelector}
        transparent
        animationType="fade"
        onRequestClose={() => setShowClassSelector(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowClassSelector(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona la clase</Text>
            <Text style={styles.modalSubtitle}>
              ¿Para qué clase es este {selectedAction === 'material' ? 'material' : 'cuestionario'}?
            </Text>
            
            <ScrollView style={styles.classListScroll} showsVerticalScrollIndicator={false}>
              {classes.map((classItem) => (
                <TouchableOpacity 
                  key={classItem.id}
                  style={styles.classOption}
                  onPress={() => handleSelectClass(classItem.id)}
                >
                  {classItem.class_image_url ? (
                    <Image source={{ uri: classItem.class_image_url }} style={styles.classOptionIcon} />
                  ) : (
                    <Text style={styles.classOptionIcon}>{classItem.class_icon || '📚'}</Text>
                  )}
                  <View style={styles.classOptionText}>
                    <Text style={styles.classOptionTitle}>{classItem.name}</Text>
                    <Text style={styles.classOptionSubtitle}>
                      {classItem.subject} • {classItem.grade}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowClassSelector(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowDeleteModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.deleteModalHeader}>
              <Ionicons name="warning" size={48} color="#EF5350" />
            </View>
            
            <Text style={styles.modalTitle}>
              {itemToDelete?.type === 'material' ? 'Eliminar Material' : 'Eliminar Cuestionario'}
            </Text>
            <Text style={styles.modalSubtitle}>
              ¿Estás seguro de que deseas eliminar "{itemToDelete?.item?.title}"?
              {'\n\n'}Esta acción no se puede deshacer.
            </Text>

            <View style={styles.deleteModalButtons}>
              <TouchableOpacity 
                style={styles.deleteModalCancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.deleteModalCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.deleteModalConfirmButton}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteModalConfirmText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#E3F2FD',
    borderColor: theme.colors.teacher.main,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  tabTextActive: {
    color: theme.colors.teacher.main,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  classSection: {
    marginBottom: 24,
  },
  classSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  classIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 32,
  },
  classSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  classSectionCount: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
  },
  itemCardContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EF5350',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  itemIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemIcon: {
    fontSize: 24,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemType: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.teacher.main,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  itemDate: {
    fontSize: 11,
    color: theme.colors.text.tertiary,
  },
  itemMeta: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
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
  bottomSpacer: {
    height: 100,
  },
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
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  modalOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalOptionEmoji: {
    fontSize: 24,
  },
  modalOptionText: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  modalOptionSubtitle: {
    fontSize: 13,
    color: theme.colors.text.secondary,
  },
  modalCancelButton: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  classListScroll: {
    maxHeight: 300,
  },
  classOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  classOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 40,
    marginRight: 12,
  },
  classOptionText: {
    flex: 1,
  },
  classOptionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  classOptionSubtitle: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  deleteModalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  deleteModalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  deleteModalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  deleteModalConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#EF5350',
    alignItems: 'center',
  },
  deleteModalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
