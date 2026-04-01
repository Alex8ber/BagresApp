/**
 * QuizDetailScreen
 * 
 * Display quiz information and provide management controls.
 * Shows quiz details, questions (read-only), and provides publish/unpublish,
 * edit settings, add questions, and delete functionality.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/shared/Button';
import { QuestionCard } from '@/components/shared/QuestionCard';
import { DeadlineManager } from '@/components/shared/DeadlineManager';
import { theme } from '@/styles/theme';
import type { RootStackScreenProps } from '@/types/navigation';
import type { Quiz } from '@/types/database';
import {
  getQuizWithQuestions,
  updateQuiz,
  deleteQuiz,
} from '@/services/supabase/quizzes';
import { supabase } from '@/services/supabase/client';
import type { QuestionWithOptions } from '@/services/supabase/quizzes';

type Props = RootStackScreenProps<'QuizDetail'>;

export default function QuizDetailScreen({ navigation, route }: Props) {
  const { quizId, classId } = route.params;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [className, setClassName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Edit modal state
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editPassingScore, setEditPassingScore] = useState('');
  const [editAvailableFrom, setEditAvailableFrom] = useState<string | null>(null);
  const [editAvailableUntil, setEditAvailableUntil] = useState<string | null>(null);

  // ============================================================================
  // Sub-task 7.2: Fetch quiz details on mount
  // ============================================================================
  
  useEffect(() => {
    fetchQuizDetails();
  }, [quizId]);

  const fetchQuizDetails = async () => {
    try {
      setLoading(true);

      // Fetch quiz with questions
      const data = await getQuizWithQuestions(quizId);
      setQuiz(data);
      setQuestions(data.questions);

      // Fetch class name
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('name')
        .eq('id', classId)
        .single<{ name: string }>();

      if (classError) throw classError;
      setClassName(classData?.name || '');
    } catch (error) {
      console.error('Error fetching quiz details:', error);
      alert('No se pudo cargar el cuestionario');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // Sub-task 7.5: Implement publish/unpublish toggle
  // ============================================================================
  
  const handleTogglePublish = async () => {
    if (!quiz) return;

    try {
      setUpdating(true);
      const newPublishState = !quiz.is_published;
      
      await updateQuiz(quizId, { is_published: newPublishState });
      
      setQuiz({ ...quiz, is_published: newPublishState });
      
      const message = newPublishState 
        ? 'Cuestionario publicado correctamente'
        : 'Cuestionario despublicado correctamente';
      alert(message);
    } catch (error) {
      console.error('Error toggling publish:', error);
      alert('No se pudo cambiar el estado de publicación');
    } finally {
      setUpdating(false);
    }
  };

  // ============================================================================
  // Sub-task 7.7: Implement edit settings modal
  // ============================================================================
  
  const openEditModal = () => {
    if (!quiz) return;
    
    setEditTitle(quiz.title);
    setEditDescription(quiz.description || '');
    setEditDuration(quiz.duration_minutes?.toString() || '');
    setEditPassingScore(quiz.passing_score.toString());
    setEditAvailableFrom(quiz.available_from);
    setEditAvailableUntil(quiz.available_until);
    setShowEditModal(true);
  };

  const handleSaveSettings = async () => {
    if (!quiz) return;

    // Validate
    if (!editTitle.trim()) {
      alert('El título es requerido');
      return;
    }

    const passingScore = parseInt(editPassingScore);
    if (isNaN(passingScore) || passingScore < 0 || passingScore > 100) {
      alert('La nota de aprobación debe estar entre 0 y 100');
      return;
    }

    const duration = editDuration ? parseInt(editDuration) : null;
    if (duration !== null && (isNaN(duration) || duration <= 0)) {
      alert('La duración debe ser un número positivo');
      return;
    }

    // Validate deadlines
    if (editAvailableFrom && editAvailableUntil) {
      const from = new Date(editAvailableFrom);
      const until = new Date(editAvailableUntil);
      if (until <= from) {
        alert('La fecha de cierre debe ser posterior a la fecha de inicio');
        return;
      }
    }

    try {
      setUpdating(true);
      
      await updateQuiz(quizId, {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
        duration_minutes: duration,
        passing_score: passingScore,
        available_from: editAvailableFrom,
        available_until: editAvailableUntil,
      });

      // Update local state
      setQuiz({
        ...quiz,
        title: editTitle.trim(),
        description: editDescription.trim() || null,
        duration_minutes: duration,
        passing_score: passingScore,
        available_from: editAvailableFrom,
        available_until: editAvailableUntil,
      });

      setShowEditModal(false);
      alert('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('No se pudo guardar la configuración');
    } finally {
      setUpdating(false);
    }
  };

  // ============================================================================
  // Sub-task 7.8: Implement navigation to QuizEditorScreen
  // ============================================================================
  
  const handleAddQuestions = () => {
    if (!quiz) return;
    
    navigation.navigate('QuizEditor', {
      quizId: quiz.id,
      classId: classId,
      className: className,
    });
  };

  // ============================================================================
  // Sub-task 7.9: Implement delete quiz functionality
  // ============================================================================
  
  const handleDeleteQuiz = async () => {
    try {
      setDeleting(true);
      await deleteQuiz(quizId);
      setShowDeleteModal(false);
      alert('Cuestionario eliminado correctamente');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('No se pudo eliminar el cuestionario');
      setDeleting(false);
    }
  };

  // ============================================================================
  // Helper functions
  // ============================================================================
  
  const getStatusBadge = () => {
    if (!quiz) return { text: 'Borrador', color: '#FF9800', bg: '#FFF3E0' };
    
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

  // ============================================================================
  // Render
  // ============================================================================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.teacher.main} />
        <Text style={styles.loadingText}>Cargando cuestionario...</Text>
      </View>
    );
  }

  if (!quiz) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No se pudo cargar el cuestionario</Text>
      </View>
    );
  }

  const status = getStatusBadge();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <View style={[styles.headerCard, { borderLeftColor: theme.colors.teacher.main }]}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconEmoji}>📝</Text>
          </View>
          
          <View style={styles.headerContent}>
            <Text style={styles.className}>{className}</Text>
            <Text style={styles.title}>{quiz.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              <Text style={[styles.statusText, { color: status.color }]}>
                {status.text}
              </Text>
            </View>
          </View>
        </View>

        {/* Description Section */}
        {quiz.description && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={20} color={theme.colors.text.primary} />
              <Text style={styles.sectionTitle}>Descripción</Text>
            </View>
            <Text style={styles.description}>{quiz.description}</Text>
          </View>
        )}

        {/* Quiz Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.text.primary} />
            <Text style={styles.sectionTitle}>Información del Cuestionario</Text>
          </View>

          {quiz.duration_minutes && (
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color={theme.colors.text.secondary} />
              <Text style={styles.detailLabel}>Duración:</Text>
              <Text style={styles.detailValue}>{quiz.duration_minutes} minutos</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Ionicons name="checkmark-circle-outline" size={18} color={theme.colors.text.secondary} />
            <Text style={styles.detailLabel}>Nota de aprobación:</Text>
            <Text style={styles.detailValue}>{quiz.passing_score}%</Text>
          </View>

          {quiz.available_from && (
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={18} color={theme.colors.text.secondary} />
              <Text style={styles.detailLabel}>Disponible desde:</Text>
              <Text style={styles.detailValue}>
                {new Date(quiz.available_from).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          )}

          {quiz.available_until && (
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={18} color={theme.colors.text.secondary} />
              <Text style={styles.detailLabel}>Disponible hasta:</Text>
              <Text style={styles.detailValue}>
                {new Date(quiz.available_until).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Ionicons name="help-circle-outline" size={18} color={theme.colors.text.secondary} />
            <Text style={styles.detailLabel}>Total de preguntas:</Text>
            <Text style={styles.detailValue}>{questions.length}</Text>
          </View>
        </View>

        {/* Questions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list-outline" size={20} color={theme.colors.text.primary} />
            <Text style={styles.sectionTitle}>Preguntas ({questions.length})</Text>
          </View>

          {questions.length === 0 ? (
            <View style={styles.emptyQuestions}>
              <Ionicons name="document-text-outline" size={48} color={theme.colors.text.tertiary} />
              <Text style={styles.emptyQuestionsText}>
                No hay preguntas aún. Agrega preguntas para comenzar.
              </Text>
            </View>
          ) : (
            questions.map((question) => (
              <View key={question.id} style={styles.questionWrapper}>
                <QuestionCard
                  question={question}
                  editable={false}
                  showReorderButtons={false}
                />
              </View>
            ))
          )}
        </View>

        {/* Publish Toggle Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="eye-outline" size={20} color={theme.colors.text.primary} />
            <Text style={styles.sectionTitle}>Visibilidad</Text>
          </View>
          
          <TouchableOpacity
            style={styles.publishToggle}
            onPress={handleTogglePublish}
            disabled={updating}
          >
            <View style={styles.publishToggleLeft}>
              <Ionicons 
                name={quiz.is_published ? "eye" : "eye-off"} 
                size={24} 
                color={quiz.is_published ? theme.colors.teacher.main : theme.colors.text.secondary} 
              />
              <View>
                <Text style={styles.publishToggleTitle}>
                  {quiz.is_published ? 'Publicado' : 'No Publicado'}
                </Text>
                <Text style={styles.publishToggleSubtitle}>
                  {quiz.is_published 
                    ? 'Los estudiantes pueden ver este cuestionario'
                    : 'Los estudiantes no pueden ver este cuestionario'}
                </Text>
              </View>
            </View>
            <View style={[
              styles.toggleSwitch,
              quiz.is_published && styles.toggleSwitchActive
            ]}>
              <View style={[
                styles.toggleKnob,
                quiz.is_published && styles.toggleKnobActive
              ]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={openEditModal}
            style={[styles.actionButton, { backgroundColor: theme.colors.teacher.main }]}
          >
            <Ionicons name="settings-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>  Editar Configuración</Text>
          </Button>

          <Button
            variant="secondary"
            size="large"
            fullWidth
            onPress={handleAddQuestions}
            style={styles.actionButton}
          >
            <Ionicons name="add-circle-outline" size={20} color={theme.colors.teacher.main} />
            <Text style={[styles.buttonText, { color: theme.colors.teacher.main }]}>  Agregar Preguntas</Text>
          </Button>

          <Button
            variant="secondary"
            size="large"
            fullWidth
            onPress={() => setShowDeleteModal(true)}
            style={[styles.actionButton, styles.deleteButton]}
          >
            <Ionicons name="trash-outline" size={20} color="#EF5350" />
            <Text style={[styles.buttonText, { color: '#EF5350' }]}>  Eliminar Cuestionario</Text>
          </Button>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

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
            
            <Text style={styles.modalTitle}>Eliminar Cuestionario</Text>
            <Text style={styles.modalSubtitle}>
              ¿Estás seguro de que deseas eliminar "{quiz.title}"?
              {'\n\n'}Esta acción eliminará todas las preguntas y no se puede deshacer.
            </Text>

            <View style={styles.deleteModalButtons}>
              <TouchableOpacity 
                style={styles.deleteModalCancelButton}
                onPress={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                <Text style={styles.deleteModalCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.deleteModalConfirmButton}
                onPress={handleDeleteQuiz}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.deleteModalConfirmText}>Eliminar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Edit Settings Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContent}>
            <View style={styles.editModalHeader}>
              <Text style={styles.modalTitle}>Editar Configuración</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.editModalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Título *</Text>
                <TextInput
                  style={styles.input}
                  value={editTitle}
                  onChangeText={setEditTitle}
                  placeholder="Título del cuestionario"
                  placeholderTextColor={theme.colors.text.tertiary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Descripción</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editDescription}
                  onChangeText={setEditDescription}
                  placeholder="Descripción del cuestionario"
                  placeholderTextColor={theme.colors.text.tertiary}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Duración (min)</Text>
                  <TextInput
                    style={styles.input}
                    value={editDuration}
                    onChangeText={setEditDuration}
                    placeholder="60"
                    placeholderTextColor={theme.colors.text.tertiary}
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Nota aprobación (%) *</Text>
                  <TextInput
                    style={styles.input}
                    value={editPassingScore}
                    onChangeText={setEditPassingScore}
                    placeholder="70"
                    placeholderTextColor={theme.colors.text.tertiary}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fechas de Disponibilidad</Text>
                <DeadlineManager
                  availableFrom={editAvailableFrom}
                  availableUntil={editAvailableUntil}
                  onChangeFrom={setEditAvailableFrom}
                  onChangeUntil={setEditAvailableUntil}
                />
              </View>

              <View style={styles.editModalButtons}>
                <Button
                  variant="secondary"
                  size="large"
                  fullWidth
                  onPress={() => setShowEditModal(false)}
                  disabled={updating}
                  style={styles.editModalCancelButton}
                >
                  Cancelar
                </Button>

                <Button
                  variant="primary"
                  size="large"
                  fullWidth
                  onPress={handleSaveSettings}
                  loading={updating}
                  style={[styles.editModalSaveButton, { backgroundColor: theme.colors.teacher.main }]}
                >
                  Guardar Cambios
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
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
  emptyQuestions: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
  },
  emptyQuestionsText: {
    marginTop: 12,
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  questionWrapper: {
    marginBottom: 12,
  },
  publishToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
  },
  publishToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  publishToggleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  publishToggleSubtitle: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: theme.colors.teacher.main,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleKnobActive: {
    alignSelf: 'flex-end',
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
  deleteButton: {
    borderColor: '#EF5350',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSpacer: {
    height: 40,
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
    lineHeight: 20,
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
  editModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
    maxHeight: '90%',
    marginTop: 'auto',
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  editModalScroll: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: theme.colors.text.primary,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  editModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 20,
  },
  editModalCancelButton: {
    flex: 1,
  },
  editModalSaveButton: {
    flex: 1,
  },
});
