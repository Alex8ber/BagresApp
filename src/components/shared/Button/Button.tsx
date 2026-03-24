/**
 * Button Component
 * 
 * A reusable button component with multiple variants, sizes, and states.
 * Supports loading state, icons, and full-width layout.
 */

import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '@/styles/theme';
import { applyShadow } from '@/styles/shadows';

// ============================================================================
// Types
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

// ============================================================================
// Component
// ============================================================================

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  children,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[`${variant}Container`],
        styles[`${size}Container`],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={theme.opacity.pressed}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getSpinnerColor(variant)}
          style={styles.spinner}
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text
            style={[
              styles.baseText,
              styles[`${variant}Text`],
              styles[`${size}Text`],
              textStyle,
            ]}
          >
            {children}
          </Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

// ============================================================================
// Helper Functions
// ============================================================================

function getSpinnerColor(variant: ButtonVariant): string {
  switch (variant) {
    case 'primary':
    case 'secondary':
      return theme.colors.text.inverse;
    case 'outline':
    case 'ghost':
      return theme.colors.primary[600];
    default:
      return theme.colors.text.inverse;
  }
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  // Base styles
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.base,
    overflow: 'hidden',
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  baseText: {
    ...theme.typography.button,
    textAlign: 'center',
  },

  // Variant styles - Container
  primaryContainer: {
    backgroundColor: theme.colors.primary[600],
    ...applyShadow(2),
  },

  secondaryContainer: {
    backgroundColor: theme.colors.secondary[600],
    ...applyShadow(2),
  },

  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary[600],
  },

  ghostContainer: {
    backgroundColor: 'transparent',
  },

  // Variant styles - Text
  primaryText: {
    color: theme.colors.text.inverse,
  },

  secondaryText: {
    color: theme.colors.text.inverse,
  },

  outlineText: {
    color: theme.colors.primary[600],
  },

  ghostText: {
    color: theme.colors.primary[600],
  },

  // Size styles - Container
  smallContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    minHeight: 32,
  },

  mediumContainer: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
  },

  largeContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 56,
  },

  // Size styles - Text
  smallText: {
    fontSize: theme.fontSize.sm,
  },

  mediumText: {
    fontSize: theme.fontSize.base,
  },

  largeText: {
    fontSize: theme.fontSize.lg,
  },

  // State styles
  disabled: {
    opacity: theme.opacity.disabled,
  },

  fullWidth: {
    width: '100%',
  },

  // Icon styles
  leftIcon: {
    marginRight: theme.spacing.xs,
  },

  rightIcon: {
    marginLeft: theme.spacing.xs,
  },

  spinner: {
    marginVertical: theme.spacing.xs,
  },
});

export default Button;
