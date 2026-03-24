/**
 * TeacherCreateClassScreen
 * 
 * Screen for creating new classes with auto-generated class codes.
 * Uses useForm hook for form management and useTeacherClasses for class creation.
 * 
 * Requirements: 1.9, 2.1, 5.2, 5.9, 10.6, 10.7, 10.14, 11.1, 11.9
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTeacher } from '@/context/TeacherContext';
import { useForm } from '@/hooks/useForm';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import type { RootStackScreenProps } from '@/types/navigation';
import type { ClassFormData, ClassFormErrors } from '@/types/forms';

// ============================================================================
// Types
// ============================================================================

type Props = RootStackScreenProps<'TeacherCreateClass'>;

interface ClassWithCode {
  id: string;
  name: string;
  description: string;
  code: string;
  createdAt: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate a random 6-character alphanumeric class code
 */
function generateClassCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validate class form data
 */
function validateClassForm(values: ClassFormData): ClassFormErrors {
  const errors: ClassFormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Class name is required';
  }

  return errors;
}

// ============================================================================
// Component
// ============================================================================

export default function TeacherCreateClassScreen({ navigation }: Props) {
  const { classes, addClass } = useTeacher();

  const { values, errors, handleChange, handleSubmit, isSubmitting } =
    useForm<ClassFormData>({
      initialValues: {
        name: '',
        subject: '',
        grade: '',
        description: '',
      },
      validate: validateClassForm,
      onSubmit: async (formValues) => {
        const newCode = generateClassCode();
        const newClass: ClassWithCode = {
          id: Date.now().toString(),
          name: formValues.name.trim(),
          description: formValues.description.trim(),
          code: newCode,
          createdAt: new Date().toISOString(),
          // Note: subject and grade are in the form but not used in the original implementation
        };

        addClass(newClass as any); // Type assertion needed due to context type mismatch

        Alert.alert(
          'Class Created Successfully!',
          `Your class code is:\n\n${newCode}\n\nShare this code with your students.`,
          [{ text: 'OK' }]
        );
      },
    });

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#2D3748" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create a New Class</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Class Details</Text>

            <Input
              label="Class Name"
              placeholder="e.g. Mathematics 101"
              value={values.name}
              onChangeText={handleChange('name')}
              error={errors.name}
            />

            <Input
              label="Description (Optional)"
              placeholder="e.g. Advanced algebra and calculus"
              value={values.description}
              onChangeText={handleChange('description')}
              multiline
              numberOfLines={3}
              style={styles.textArea}
            />

            <Button
              onPress={handleSubmit}
              loading={isSubmitting}
              leftIcon={<Ionicons name="school-outline" size={20} color="#FFF" />}
            >
              Generate Class Code
            </Button>
          </View>

          <Text style={styles.sectionTitle}>
            Created Classes ({classes.length})
          </Text>

          {classes.length === 0 ? (
            <Text style={styles.emptyText}>
              You haven't created any classes yet.
            </Text>
          ) : (
            classes.map((cls: any) => (
              <View key={cls.id} style={styles.classCard}>
                <View style={styles.classHeader}>
                  <Text style={styles.classNameText}>{cls.name}</Text>
                  <View style={styles.codeBadge}>
                    <Text style={styles.codeText}>
                      {(cls as any).code || 'N/A'}
                    </Text>
                  </View>
                </View>
                {(cls as any).description ? (
                  <Text style={styles.classDescText}>
                    {(cls as any).description}
                  </Text>
                ) : null}
              </View>
            ))
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFBFD' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FAFBFD',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#2D3748' },
  content: { flex: 1, paddingHorizontal: 20 },

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
    fontSize: 18,
    fontWeight: '800',
    color: '#2D3748',
    marginBottom: 20,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A5568',
    marginTop: 10,
    marginBottom: 15,
  },
  emptyText: {
    color: '#A0AEC0',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },

  classCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#34A853',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  classNameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    flex: 1,
    marginRight: 10,
  },
  codeBadge: {
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  codeText: {
    color: '#0D652D',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1,
  },
  classDescText: { fontSize: 14, color: '#718096' },
});
