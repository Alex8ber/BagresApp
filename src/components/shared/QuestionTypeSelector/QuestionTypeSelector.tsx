/**
 * QuestionTypeSelector Component
 * 
 * A reusable component for selecting question types in quiz creation.
 * Displays three options: Selección Simple, Selección Múltiple, Respuesta Abierta
 * Maps display names to enum values: 'single_choice', 'multiple_choice', 'open_ended'
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { theme } from '@/styles/theme';

// ============================================================================
// Types
// ============================================================================

export type QuestionType = 'single_choice' | 'multiple_choice' | 'open_ended';

export interface QuestionTypeSelectorProps {
  value: QuestionType;
  onChange: (type: QuestionType) => void;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

// ============================================================================
// Constants
// ============================================================================

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  single_choice: 'Selección Simple',
  multiple_choice: 'Selección Múltiple',
  open_ended: 'Respuesta Abierta',
};

const QUESTION_TYPES: QuestionType[] = ['single_choice', 'multiple_choice', 'open_ended'];

// ============================================================================
// Component
// ============================================================================

export const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {QUESTION_TYPES.map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.option,
            value === type && styles.optionActive,
            disabled && styles.optionDisabled,
          ]}
          onPress={() => !disabled && onChange(type)}
          disabled={disabled}
          activeOpacity={theme.opacity.pressed}
        >
          <Text
            style={[
              styles.optionText,
              value === type && styles.optionTextActive,
              disabled && styles.optionTextDisabled,
            ]}
          >
            {QUESTION_TYPE_LABELS[type]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.xs,
  },

  option: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.base,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.primary,
  },

  optionActive: {
    backgroundColor: theme.colors.teacher.light,
    borderColor: theme.colors.teacher.main,
    borderWidth: 2,
  },

  optionDisabled: {
    backgroundColor: theme.colors.background.disabled,
    borderColor: theme.colors.border.light,
    opacity: theme.opacity.disabled,
  },

  optionText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  optionTextActive: {
    color: theme.colors.teacher.main,
    fontWeight: '700',
  },

  optionTextDisabled: {
    color: theme.colors.text.disabled,
  },
});

export default QuestionTypeSelector;
