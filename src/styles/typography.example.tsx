/**
 * Typography Usage Example
 * 
 * This file demonstrates how to use the typography system in components.
 * This is for documentation purposes and can be deleted after migration.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography, fontSize, fontWeight, lineHeight } from './typography';
import { colors, spacing } from './theme';

/**
 * Example: Typography Showcase
 * Demonstrates all available typography presets
 */
export function TypographyShowcase() {
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Heading 1 - Extra Large</Text>
      <Text style={styles.h2}>Heading 2 - Large</Text>
      <Text style={styles.h3}>Heading 3 - Medium</Text>
      <Text style={styles.h4}>Heading 4 - Small</Text>
      <Text style={styles.h5}>Heading 5 - Extra Small</Text>
      <Text style={styles.h6}>Heading 6 - Tiny</Text>
      
      <View style={styles.divider} />
      
      <Text style={styles.body1}>
        Body 1 - This is regular body text used for main content. 
        It has a comfortable reading size and line height.
      </Text>
      
      <Text style={styles.body2}>
        Body 2 - This is smaller body text used for secondary content.
        It's slightly more compact but still readable.
      </Text>
      
      <View style={styles.divider} />
      
      <Text style={styles.subtitle1}>Subtitle 1 - Regular subtitle</Text>
      <Text style={styles.subtitle2}>Subtitle 2 - Small subtitle</Text>
      
      <View style={styles.divider} />
      
      <Text style={styles.caption}>Caption - Small descriptive text</Text>
      <Text style={styles.overline}>Overline - Label Text</Text>
      
      <View style={styles.divider} />
      
      <Text style={styles.button}>BUTTON TEXT</Text>
    </View>
  );
}

/**
 * Example: Custom Typography
 * Shows how to create custom text styles using typography constants
 */
export function CustomTypography() {
  return (
    <View style={styles.container}>
      <Text style={styles.customTitle}>Custom Title Style</Text>
      <Text style={styles.customBody}>
        This text uses custom typography by combining fontSize, fontWeight, 
        and lineHeight constants from the typography system.
      </Text>
      <Text style={styles.customEmphasis}>
        Custom emphasis text with different styling
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
  },
  
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: spacing.lg,
  },
  
  // Typography presets
  h1: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  h2: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  h3: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  h4: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  h5: {
    ...typography.h5,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  h6: {
    ...typography.h6,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  
  body1: {
    ...typography.body1,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  body2: {
    ...typography.body2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  
  subtitle1: {
    ...typography.subtitle1,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  subtitle2: {
    ...typography.subtitle2,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  
  caption: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  overline: {
    ...typography.overline,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  
  button: {
    ...typography.button,
    color: colors.primary[500],
  },
  
  // Custom typography styles
  customTitle: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    color: colors.primary[600],
    marginBottom: spacing.md,
  },
  customBody: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.relaxed,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  customEmphasis: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
    color: colors.secondary[600],
  },
});
