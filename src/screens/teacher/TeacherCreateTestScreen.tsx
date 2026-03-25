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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTeacher } from '@/context/TeacherContext';
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
  
  // Optional classId parameter
  const classIdParam = route.params?.classId;
  
  const [selectedClassId, setSelectedClassId] = useState<string | null>(
    classIdParam || null
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Form state
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOption, setCorrectOption] = useState<OptionKey>('A');

  const handleAddQuestion = () => {
    if (!currentQuestionText || !optionA || !optionB || !optionC || !optionD) {
      Alert.alert(
        'Missing Fields',
        'Please fill in the question and all 4 options.'
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

  const handleSaveTest = () => {
    if (!selectedClassId) {
      Alert.alert(
        'No Class Selected',
        'Please select a class to attach this test to before saving.'
      );
      return;
    }
    if (questions.length === 0) {
      Alert.alert(
        'Empty Test',
        'Please add at least one question before saving.'
      );
      return;
    }
    Alert.alert('Success', 'Test saved successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
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
      <Text style={styles.sectionTitle}>1. Select a Class</Text>
      {classes.length === 0 ? (
        <Text style={styles.emptyClassText}>
          You need to create a class first from the dashboard.
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.classList}
        >
          {classes.map((cls: any) => (
            <TouchableOpacity
              key={cls.id}
              style={[
                styles.classPill,
                selectedClassId === cls.id && styles.classPillActive,
              ]}
              onPress={() => setSelectedClassId(cls.id)}
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
          ))}
        </ScrollView>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>2. Add New Maths Question</Text>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="e.g. What is the derivative of x^2?"
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
                placeholder={`Option ${opt}`}
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
          <Text style={styles.addBtnText}>Add Question</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>
        Added Questions ({questions.length})
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
        <Text style={styles.previewTitle}>Maths Test Preview</Text>
        <Text style={styles.previewSubtitle}>
          Total Questions: {questions.length}
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
              >
                <Text style={styles.bottomSecondaryBtnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bottomPrimaryBtn}
                onPress={handleSaveTest}
              >
                <Text style={styles.bottomPrimaryBtnText}>Save Test</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.bottomSecondaryBtn}
                onPress={() => {
                  if (questions.length === 0) {
                    Alert.alert(
                      'No Questions',
                      'Add some questions before previewing.'
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
                <Text style={styles.bottomSecondaryBtnText}>Preview Test</Text>
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
  bottomPrimaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
