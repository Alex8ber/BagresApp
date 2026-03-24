/**
 * Theme Usage Example
 * 
 * This file demonstrates how to use the theme system in components.
 * This is for documentation purposes and can be deleted after migration.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, shadows, borderRadius } from './theme';

/**
 * Example: Using theme tokens in a component
 */
export function ExampleCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Welcome to BagresApp</Text>
      <Text style={styles.subtitle}>
        This card demonstrates the theme system
      </Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Primary Action</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Secondary Action</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/**
 * Example: Teacher-themed card
 */
export function TeacherCard() {
  return (
    <View style={styles.teacherCard}>
      <Text style={styles.roleEmoji}>👨‍🏫</Text>
      <Text style={styles.roleTitle}>Teacher</Text>
      <TouchableOpacity style={styles.teacherButton}>
        <Text style={styles.teacherButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

/**
 * Example: Student-themed card
 */
export function StudentCard() {
  return (
    <View style={styles.studentCard}>
      <Text style={styles.roleEmoji}>👨‍🎓</Text>
      <Text style={styles.roleTitle}>Student</Text>
      <TouchableOpacity style={styles.studentButton}>
        <Text style={styles.studentButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Basic card using theme tokens
  card: {
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border.light,
    ...shadows.md,
  },
  
  // Typography using presets
  title: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  
  // Button container with spacing
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  
  // Primary button using theme colors
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.base,
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.text.inverse,
  },
  
  // Secondary button with outline
  secondaryButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.primary[500],
    alignItems: 'center',
  },
  secondaryButtonText: {
    ...typography.button,
    color: colors.primary[500],
  },
  
  // Teacher-themed card
  teacherCard: {
    backgroundColor: colors.teacher.light,
    borderWidth: 1,
    borderColor: colors.teacher.border,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadows.lg,
  },
  
  // Student-themed card
  studentCard: {
    backgroundColor: colors.student.light,
    borderWidth: 1,
    borderColor: colors.student.border,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadows.lg,
  },
  
  // Role emoji
  roleEmoji: {
    fontSize: fontSize['6xl'],
    marginBottom: spacing.md,
  },
  
  // Role title
  roleTitle: {
    ...typography.h4,
    marginBottom: spacing.base,
  },
  
  // Teacher button
  teacherButton: {
    backgroundColor: colors.teacher.main,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    ...shadows.base,
  },
  teacherButtonText: {
    ...typography.button,
    color: colors.text.inverse,
  },
  
  // Student button
  studentButton: {
    backgroundColor: colors.student.main,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    ...shadows.base,
  },
  studentButtonText: {
    ...typography.button,
    color: colors.text.inverse,
  },
});

// Import fontSize for the emoji style
import { fontSize } from './theme';
