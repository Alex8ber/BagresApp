/**
 * QuestionCard Component
 * 
 * A reusable component for displaying and editing quiz questions.
 * Supports three question types: single choice, multiple choice, and open-ended.
 * Provides UI for managing question text, points, options, and correct answers.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/shared/Card';
import { QuestionTypeSelector, QuestionType } from '@/components/shared/QuestionTypeSelector';
import { theme } from '@/styles/theme';

// ============================================================================
// Types
// ============================================================================

export interface QuizOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  order_index: number;
}

export interface QuestionWithOptions {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: QuestionType;
  points: number;
  order_index: number;
  options: QuizOption[];
}

export interface QuestionCardProps {
  question: QuestionWithOptions;
  editable: boolean;
  onDelete?: (questionId: string) => void;
  onReorder?: (direction: 'up' | 'down') => void;
  onAddOption?: (questionId: string) => void;
  onDeleteOption?: (optionId: string) => void;
  onToggleCorrect?: (optionId: string) => void;
  onUpdateQuestionText?: (questionId: string, text: string) => void;
  onUpdateQuestionType?: (questionId: string, type: QuestionType) => void;
  onUpdatePoints?: (questionId: string, points: number) => void;
  onUpdateOptionText?: (optionId: string, text: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  showReorderButtons?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  editable,
  onDelete,
  onReorder,
  onAddOption,
  onDeleteOption,
  onToggleCorrect,
  onUpdateQuestionText,
  onUpdateQuestionType,
  onUpdatePoints,
  onUpdateOptionText,
  containerStyle,
  showReorderButtons = true,
}) => {
  const showOptions = question.question_type === 'single_choice' || question.question_type === 'multiple_choice';

  return (
    <Card variant="elevated" style={[styles.card, containerStyle]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.questionNumber}>
            <Text style={styles.questionNumberText}>#{question.order_index + 1}</Text>
          </View>
          <Text style={styles.headerTitle}>Pregunta</Text>
        </View>

        {editable && (
          <View style={styles.headerActions}>
            {showReorderButtons && onReorder && (
              <>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => onReorder('up')}
                  activeOpacity={theme.opacity.pressed}
                >
                  <Ionicons name="arrow-up" size={20} color={theme.colors.text.secondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => onReorder('down')}
                  activeOpacity={theme.opacity.pressed}
                >
                  <Ionicons name="arrow-down" size={20} color={theme.colors.text.secondary} />
                </TouchableOpacity>
              </>
            )}
            {onDelete && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onDelete(question.id)}
                activeOpacity={theme.opacity.pressed}
              >
                <Ionicons name="trash-outline" size={20} color={theme.colors.error.main} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Question Type Selector */}
      {editable && onUpdateQuestionType ? (
        <View style={styles.section}>
          <Text style={styles.label}>Tipo de pregunta</Text>
          <QuestionTypeSelector
            value={question.question_type}
            onChange={(type) => onUpdateQuestionType(question.id, type)}
          />
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.label}>Tipo de pregunta</Text>
          <Text style={styles.readOnlyText}>
            {question.question_type === 'single_choice' && 'Selección Simple'}
            {question.question_type === 'multiple_choice' && 'Selección Múltiple'}
            {question.question_type === 'open_ended' && 'Respuesta Abierta'}
          </Text>
        </View>
      )}

      {/* Question Text */}
      <View style={styles.section}>
        <Text style={styles.label}>Pregunta *</Text>
        {editable && onUpdateQuestionText ? (
          <TextInput
            style={styles.textInput}
            placeholder="Escribe la pregunta aquí..."
            value={question.question_text}
            onChangeText={(text) => onUpdateQuestionText(question.id, text)}
            multiline
            numberOfLines={3}
            placeholderTextColor={theme.colors.text.tertiary}
          />
        ) : (
          <Text style={styles.readOnlyText}>{question.question_text}</Text>
        )}
      </View>

      {/* Points */}
      <View style={styles.section}>
        <Text style={styles.label}>Puntos *</Text>
        {editable && onUpdatePoints ? (
          <TextInput
            style={styles.pointsInput}
            placeholder="0"
            value={question.points.toString()}
            onChangeText={(text) => {
              const points = parseInt(text) || 0;
              onUpdatePoints(question.id, points);
            }}
            keyboardType="numeric"
            placeholderTextColor={theme.colors.text.tertiary}
          />
        ) : (
          <Text style={styles.readOnlyText}>{question.points}</Text>
        )}
      </View>

      {/* Options (for single_choice and multiple_choice) */}
      {showOptions && (
        <View style={styles.section}>
          <View style={styles.optionsHeader}>
            <Text style={styles.label}>Opciones</Text>
            {editable && onAddOption && (
              <TouchableOpacity
                style={styles.addOptionButton}
                onPress={() => onAddOption(question.id)}
                activeOpacity={theme.opacity.pressed}
              >
                <Ionicons name="add-circle" size={20} color={theme.colors.teacher.main} />
                <Text style={styles.addOptionText}>Agregar Opción</Text>
              </TouchableOpacity>
            )}
          </View>

          {question.options.length === 0 ? (
            <Text style={styles.emptyText}>No hay opciones. Agrega al menos 2 opciones.</Text>
          ) : (
            <View style={styles.optionsList}>
              {question.options.map((option, index) => (
                <View key={option.id} style={styles.optionItem}>
                  <View style={styles.optionLeft}>
                    {editable && onToggleCorrect ? (
                      <TouchableOpacity
                        style={styles.checkboxButton}
                        onPress={() => onToggleCorrect(option.id)}
                        activeOpacity={theme.opacity.pressed}
                      >
                        <Ionicons
                          name={option.is_correct ? 'checkmark-circle' : 'ellipse-outline'}
                          size={24}
                          color={option.is_correct ? theme.colors.success.main : theme.colors.border.main}
                        />
                      </TouchableOpacity>
                    ) : (
                      <Ionicons
                        name={option.is_correct ? 'checkmark-circle' : 'ellipse-outline'}
                        size={24}
                        color={option.is_correct ? theme.colors.success.main : theme.colors.border.main}
                      />
                    )}

                    {editable && onUpdateOptionText ? (
                      <TextInput
                        style={styles.optionInput}
                        placeholder={`Opción ${index + 1}`}
                        value={option.option_text}
                        onChangeText={(text) => onUpdateOptionText(option.id, text)}
                        placeholderTextColor={theme.colors.text.tertiary}
                      />
                    ) : (
                      <Text style={styles.optionText}>{option.option_text}</Text>
                    )}
                  </View>

                  {editable && onDeleteOption && (
                    <TouchableOpacity
                      style={styles.deleteOptionButton}
                      onPress={() => onDeleteOption(option.id)}
                      activeOpacity={theme.opacity.pressed}
                    >
                      <Ionicons name="close-circle" size={20} color={theme.colors.error.main} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Open-ended hint */}
      {question.question_type === 'open_ended' && !editable && (
        <View style={styles.hintContainer}>
          <Ionicons name="information-circle-outline" size={16} color={theme.colors.info.main} />
          <Text style={styles.hintText}>Los estudiantes responderán con texto libre</Text>
        </View>
      )}
    </Card>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.teacher.light,
    alignItems: 'center',
    justifyContent: 'center',
  },

  questionNumberText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
    color: theme.colors.teacher.main,
  },

  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },

  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },

  iconButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.base,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.secondary,
  },

  section: {
    marginBottom: theme.spacing.md,
  },

  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },

  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    borderRadius: theme.borderRadius.base,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.base,
    fontSize: theme.fontSize.base,
    color: theme.colors.text.primary,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  pointsInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    borderRadius: theme.borderRadius.base,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.base,
    fontSize: theme.fontSize.base,
    color: theme.colors.text.primary,
    width: 100,
  },

  readOnlyText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },

  optionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },

  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.base,
    backgroundColor: theme.colors.teacher.light,
  },

  addOptionText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.teacher.main,
  },

  emptyText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: theme.spacing.md,
  },

  optionsList: {
    gap: theme.spacing.sm,
  },

  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.base,
    backgroundColor: theme.colors.background.secondary,
  },

  optionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  checkboxButton: {
    padding: theme.spacing.xs,
  },

  optionInput: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.xs,
  },

  optionText: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.text.primary,
  },

  deleteOptionButton: {
    padding: theme.spacing.xs,
  },

  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.base,
    backgroundColor: theme.colors.info.light,
  },

  hintText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.info.dark,
  },
});

export default QuestionCard;
