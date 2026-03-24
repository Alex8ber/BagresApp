/**
 * RoleCard Component
 * 
 * Displays a role selection card with emoji, title, and action buttons.
 * Used in RoleSelectionScreen for teacher/student role selection.
 * 
 * Requirements: 2.1, 2.2, 5.2, 11.1
 */

import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { theme } from '@/styles/theme';

// ============================================================================
// Types
// ============================================================================

export interface RoleCardProps {
  /** Role identifier (e.g., 'teacher', 'student') */
  role: 'teacher' | 'student';
  /** Emoji to display for the role */
  emoji: string;
  /** Title text for the role */
  title: string;
  /** Handler for login button press */
  onLogin: () => void;
  /** Handler for register button press */
  onRegister: () => void;
  /** Optional container style */
  style?: StyleProp<ViewStyle>;
}

// ============================================================================
// Component
// ============================================================================

export const RoleCard: React.FC<RoleCardProps> = ({
  role,
  emoji,
  title,
  onLogin,
  onRegister,
  style,
}) => {
  const isTeacher = role === 'teacher';
  const backgroundColor = isTeacher
    ? theme.colors.teacher.light
    : theme.colors.student.light;
  const borderColor = isTeacher
    ? theme.colors.teacher.border
    : theme.colors.student.border;
  const buttonColor = isTeacher
    ? theme.colors.teacher.main
    : theme.colors.student.main;

  return (
    <Card
      variant="outlined"
      style={[
        styles.card,
        { backgroundColor, borderColor },
        style,
      ]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.buttonRow}>
        <Button
          variant="primary"
          size="medium"
          onPress={onLogin}
          style={[styles.button, { backgroundColor: buttonColor }]}
        >
          Login
        </Button>
        <Button
          variant="outline"
          size="medium"
          onPress={onRegister}
          style={[styles.button, styles.outlineButton, { borderColor: buttonColor }]}
          textStyle={{ color: buttonColor }}
        >
          Register
        </Button>
      </View>
    </Card>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
  },

  emoji: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },

  title: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },

  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: theme.spacing.md,
  },

  button: {
    flex: 1,
  },

  outlineButton: {
    backgroundColor: 'transparent',
  },
});

export default RoleCard;
