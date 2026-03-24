/**
 * Card Component
 * 
 * A reusable card container component with multiple variants and elevation support.
 * Provides consistent styling for content grouping and visual hierarchy.
 */

import React from 'react';
import {
  View,
  ViewProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { theme } from '@/styles/theme';
import { applyShadow } from '@/styles/shadows';

// ============================================================================
// Types
// ============================================================================

export type CardVariant = 'elevated' | 'outlined' | 'filled';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  padding?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

// ============================================================================
// Component
// ============================================================================

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = theme.spacing.base,
  borderRadius = theme.borderRadius.base,
  style,
  children,
  ...rest
}) => {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        {
          padding,
          borderRadius,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.background.primary,
    overflow: 'hidden',
  },

  elevated: {
    ...applyShadow(2),
  },

  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.border.main,
  },

  filled: {
    backgroundColor: theme.colors.background.secondary,
  },
});

export default Card;
