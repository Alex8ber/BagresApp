/**
 * TeacherCreateTestScreen
 * 
 * Screen for creating math tests with multiple choice questions.
 * Allows teachers to add questions, preview tests, and save them to a class.
 * 
 * Requirements: 1.9, 5.3, 5.9, 10.14, 11.1, 11.9
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTeacher } from '@/context/TeacherContext';
import { useAuth } from '@/hooks/useAuth';
import { createQuiz, createQuestion, createOption } from '@/services/supabase/quizzes';
import type { RootStackScreenProps } from '@/types/navigation';

// ============================================================================
// Types
// ============================================================================

interface Question {
  id: string;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

type OptionKey = 'A' | 'B' | 'C' | 'D';

type Props = RootStackScreenProps<'TeacherCreateTest'>;

// ============================================================================
// Component
// ============================================================================

export default function TeacherCreateTestScreen({ navigation, route }: Props) {
  const { classes } = useTeacher();
  const { user } = useAuth();
  
  // Optional classId parameter
  const classIdParam = route.params?.classId;
  
  const [selectedClassId, setSelectedClassId] = useState<string | null>(
    classIdParam || null
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [quizTitle, setQuizTitle] = useState('');
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOption, setCorrectOption] = useState<OptionKey>('A');

  const handleAddQuestion = () => {
    if (!currentQuestionText || !optionA || !optionB || !optionC || !optionD) {
      Alert.alert(
        'Campos Incompletos',
        'Por favor completa la pregunta y las 4 opciones.'
      );
      return;
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      text: currentQuestionText,
      options: {
        A: optionA,
        B: optionB,
        C: optionC,
        D: optionD,
      },
      correctAnswer: correctOption,
    };

    setQuestions([...questions, newQuestion]);

    // Reset form
    setCurrentQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectOption('A');
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSaveTest = async () => {
    if (!selectedClassId) {
      Alert.alert(
        'Clase no seleccionada',
        'Por favor selecciona una clase antes de guardar el quiz.'
      );
      return;
    }
    if (questions.length === 0) {
      Alert.alert(
        'Quiz vacío',
        'Por favor agrega al menos una pregunta antes de guardar.'
      );
      return;
    }
    if (!quizTitle.trim()) {
      Alert.alert(
        'Título requerido',
        'Por favor ingresa un título para el quiz.'
      );
      return;
    }
    if (!user?.id) {
      Alert.alert('Error', 'No se pudo identificar al profesor.');
      return;
    }

    setIsSaving(true);

    try {
      console.log('[TeacherCreateTestScreen] Guardando quiz...');
      console.log('[TeacherCreateTestScreen] class_id:', selectedClassId);
      console.log('[TeacherCreateTestScreen] teacher_id:', user.id);
      console.log('[TeacherCreateTestScreen] title:', quizTitle);
      console.log('[TeacherCreateTestScreen] questions:', questions.length);

      // 1. Create the quiz
      const quiz = await createQuiz({
        title: quizTitle.trim(),
        class_id: selectedClassId,
        teacher_id: user.id,
        time_limit_minutes: 60, // Default 60 minutes
        passing_score: 70, // Default 70%
        is_published: true,
      });

      console.log('[TeacherCreateTestScreen] Quiz creado:', quiz.id);

      // 2. Create all questions and their options
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        
        // Create question
        const question = await createQuestion({
          quiz_id: quiz.id,
          question_text: q.text,
          question_type: 'multiple_choice',
          points: 1,
          order_index: i,
        });

        console.log('[TeacherCreateTestScreen] Pregunta creada:', question.id);

        // Create options
        const optionKeys: OptionKey[] = ['A', 'B', 'C', 'D'];
        for (let j = 0; j < optionKeys.length; j++) {
          const key = optionKeys[j];
          await createOption({
            question_id: question.id,
            option_text: q.options[key],
            is_correct: q.correctAnswer === key,
            order_index: j,
          });
        }
      }

      console.log('[TeacherCreateTestScreen] Quiz guardado exitosamente');

      Alert.alert('¡Éxito!', 'Quiz guardado correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('[TeacherCreateTestScreen] Error guardando quiz:', error);
      Alert.alert(
        'Error',
        'No se pudo guardar el quiz. Por favor intenta de nuevo.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const getOptionValue = (opt: OptionKey): string => {
    switch (opt) {
      case 'A':
        return optionA;
      case 'B':
        return optionB;
      case 'C':
        return optionC;
      case 'D':
        return optionD;
    }
  };

  const setOptionValue = (opt: OptionKey, text: string) => {
    switch (opt) {
      case 'A':
        setOptionA(text);
        break;
      case 'B':
        setOptionB(text);
        break;
      case 'C':
        setOptionC(text);
        break;
      case 'D':
        setOptionD(text);
        break;
    }
  };

  const renderEditMode = () => (
    <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.sectionTitle}>1. Título del Quiz</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Examen de Matemáticas - Unidad 1"
        placeholderTextColor="#A0AEC0"
        value={quizTitle}
        onChangeText={setQuizTitle}
      />

      <Text style={styles.sectionTitle}>2. Selecciona una Clase</Text>
      {classes.length === 0 ? (
        <Text style={styles.emptyClassText}>
          Necesitas crear una clase primero desde el panel principal.
        </Text>
      ) : (
        <>
          <Text style={styles.debugText}>
            Clases disponibles: {classes.length}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.classList}
          >
            {classes.map((cls: any) => {
              console.log('🏫 [TeacherCreateTestScreen] Class option:', {
                id: cls.id,
                name: cls.name,
                isSelected: selectedClassId === cls.id
              });
              return (
                <TouchableOpacity
                  key={cls.id}
                  style={[
                    styles.classPill,
                    selectedClassId === cls.id && styles.classPillActive,
                  ]}
                  onPress={() => {
                    console.log('🏫 [TeacherCreateTestScreen] Selected class:', cls.id, cls.name);
                    setSelectedClassId(cls.id);
                  }}
                >
                  <Text
                    style={[
                      styles.classPillText,
                      selectedClassId === cls.id && styles.classPillTextActive,
                    ]}
                  >
                    {cls.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          {selectedClassId && (
            <Text style={styles.debugText}>
              Clase seleccionada ID: {selectedClassId}
            </Text>
          )}
        </>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>3. Agregar Nueva Pregunta</Text>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ej: ¿Cuál es la derivada de x^2?"
          placeholderTextColor="#A0AEC0"
          value={currentQuestionText}
          onChangeText={setCurrentQuestionText}
          multiline
          numberOfLines={3}
        />

        <View style={styles.optionsContainer}>
          {(['A', 'B', 'C', 'D'] as OptionKey[]).map((opt) => (
            <View key={opt} style={styles.optionRow}>
              <TouchableOpacity
                style={[
                  styles.correctToggleBtn,
                  correctOption === opt && styles.correctToggleBtnActive,
                ]}
                onPress={() => setCorrectOption(opt)}
              >
                <Text
                  style={[
                    styles.correctToggleText,
                    correctOption === opt && styles.correctToggleTextActive,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
              <TextInput
                style={styles.optionInput}
                placeholder={`Opción ${opt}`}
                placeholderTextColor="#A0AEC0"
                value={getOptionValue(opt)}
                onChangeText={(text) => setOptionValue(opt, text)}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddQuestion}>
          <Ionicons
            name="add-circle-outline"
            size={20}
            color="#FFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.addBtnText}>Agregar Pregunta</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>
        Preguntas Agregadas ({questions.length})
      </Text>

      {questions.map((q, index) => (
        <View key={q.id} style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionText}>
              {index + 1}. {q.text}
            </Text>
            <TouchableOpacity
              onPress={() => handleRemoveQuestion(q.id)}
              style={styles.eraseBtn}
            >
              <Ionicons name="trash-outline" size={20} color="#E53E3E" />
            </TouchableOpacity>
          </View>
          <View style={styles.previewOptionsGrid}>
            {(Object.entries(q.options) as [OptionKey, string][]).map(
              ([key, val]) => (
                <Text
                  key={key}
                  style={[
                    styles.previewOptionText,
                    q.correctAnswer === key && styles.previewOptionTextCorrect,
                  ]}
                >
                  {key}) {val}
                </Text>
              )
            )}
          </View>
        </View>
      ))}

      <View style={{ height: 100 }} />
    </ScrollView>
  );

  const renderPreviewMode = () => (
    <ScrollView style={styles.content}>
      <View style={styles.previewHeaderCard}>
        <Text style={styles.previewTitle}>{quizTitle || 'Vista Previa del Quiz'}</Text>
        <Text style={styles.previewSubtitle}>
          Total de Preguntas: {questions.length}
        </Text>
      </View>

      {questions.map((q, index) => (
        <View key={q.id} style={styles.previewQuestionCard}>
          <Text style={styles.previewQuestionText}>
            {index + 1}. {q.text}
          </Text>
          <View style={styles.previewOptionsList}>
            {(Object.entries(q.options) as [OptionKey, string][]).map(
              ([key, val]) => (
                <View key={key} style={styles.previewOptionRow}>
                  <View
                    style={[
                      styles.previewOptionBubble,
                      q.correctAnswer === key &&
                        styles.previewOptionBubbleCorrect,
                    ]}
                  >
                    <Text
                      style={[
                        styles.previewOptionBubbleText,
                        q.correctAnswer === key &&
                          styles.previewOptionBubbleTextCorrect,
                      ]}
                    >
                      {key}
                    </Text>
                  </View>
                  <Text style={styles.previewOptionLabel}>{val}</Text>
                </View>
              )
            )}
          </View>
        </View>
      ))}
      <View style={{ height: 100 }} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {isPreviewMode ? renderPreviewMode() : renderEditMode()}

        <View style={styles.bottomBar}>
          {isPreviewMode ? (
            <>
              <TouchableOpacity
                style={styles.bottomSecondaryBtn}
                onPress={() => setIsPreviewMode(false)}
                disabled={isSaving}
              >
                <Text style={styles.bottomSecondaryBtnText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bottomPrimaryBtn, isSaving && styles.bottomPrimaryBtnDisabled]}
                onPress={handleSaveTest}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.bottomPrimaryBtnText}>Guardar Quiz</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.bottomSecondaryBtn}
                onPress={() => {
                  if (questions.length === 0) {
                    Alert.alert(
                      'Sin Preguntas',
                      'Agrega algunas preguntas antes de previsualizar.'
                    );
                    return;
                  }
                  setIsPreviewMode(true);
                }}
              >
                <Ionicons
                  name="eye-outline"
                  size={20}
                  color="#4285F4"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.bottomSecondaryBtnText}>Vista Previa</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFBFD' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 15,
  },

  debugText: {
    fontSize: 11,
    color: '#666',
    marginTop: 8,
    marginBottom: 8,
    fontFamily: 'monospace',
  },

  emptyClassText: {
    color: '#E53E3E',
    fontSize: 14,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  classList: { marginBottom: 20 },
  classPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#EDF2F7',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  classPillActive: {
    backgroundColor: '#E6F4EA',
    borderColor: '#34A853',
  },
  classPillText: {
    color: '#4A5568',
    fontWeight: '600',
  },
  classPillTextActive: {
    color: '#0D652D',
    fontWeight: '800',
  },

  input: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#2D3748',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    marginBottom: 15,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  correctToggleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDF2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  correctToggleBtnActive: {
    backgroundColor: '#38A169',
  },
  correctToggleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#718096',
  },
  correctToggleTextActive: {
    color: '#FFF',
  },
  optionInput: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#2D3748',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addBtn: {
    backgroundColor: '#4285F4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
  },
  addBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A5568',
    marginTop: 10,
    marginBottom: 15,
  },

  questionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4285F4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
    marginRight: 10,
  },
  eraseBtn: {
    padding: 5,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
  },
  previewOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  previewOptionText: {
    width: '50%',
    fontSize: 14,
    color: '#718096',
    marginBottom: 5,
  },
  previewOptionTextCorrect: {
    color: '#38A169',
    fontWeight: '700',
  },

  // Preview Mode Styles
  previewHeaderCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2D3748',
    marginBottom: 5,
  },
  previewSubtitle: { fontSize: 14, color: '#718096' },

  previewQuestionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  previewQuestionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 20,
  },
  previewOptionsList: { gap: 12 },
  previewOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 12,
  },
  previewOptionBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  previewOptionBubbleCorrect: {
    backgroundColor: '#C6F6D5',
  },
  previewOptionBubbleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A5568',
  },
  previewOptionBubbleTextCorrect: {
    color: '#22543D',
  },
  previewOptionLabel: {
    fontSize: 16,
    color: '#4A5568',
    flex: 1,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 15,
  },
  bottomSecondaryBtn: {
    flex: 1,
    backgroundColor: '#E8F0FE',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bottomSecondaryBtnText: {
    color: '#4285F4',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomPrimaryBtn: {
    flex: 1,
    backgroundColor: '#38A169',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomPrimaryBtnDisabled: {
    backgroundColor: '#A0AEC0',
  },
  bottomPrimaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
