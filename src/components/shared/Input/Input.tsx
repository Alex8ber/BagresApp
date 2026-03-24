/**
 * Input Component
 * 
 * A reusable text input component with label, error handling, and icon support.
 * Provides consistent styling and validation feedback across the application.
 */

import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '@/styles/theme';

// ============================================================================
// Types
// ============================================================================

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  focusColor?: string;
}

// ============================================================================
// Component
// ============================================================================

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  focusColor,
  editable = true,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = !!error;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}

      {/* Input Container */}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          isFocused && focusColor && { borderColor: focusColor },
          hasError && styles.inputContainerError,
          !editable && styles.inputContainerDisabled,
        ]}
      >
        {/* Left Icon */}
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}

        {/* Text Input */}
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : undefined,
            rightIcon ? styles.inputWithRightIcon : undefined,
            !editable ? styles.inputDisabled : undefined,
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.text.tertiary}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />

        {/* Right Icon */}
        {rightIcon && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>

      {/* Error or Helper Text */}
      {(error || helperText) && (
        <Text
          style={[
            styles.helperText,
            hasError && styles.errorText,
            errorStyle,
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    borderRadius: theme.borderRadius.base,
    minHeight: 48,
    paddingHorizontal: theme.spacing.md,
  },

  inputContainerFocused: {
    borderColor: theme.colors.primary[600],
    borderWidth: 2,
  },

  inputContainerError: {
    borderColor: theme.colors.error.main,
    borderWidth: 2,
  },

  inputContainerDisabled: {
    backgroundColor: theme.colors.background.disabled,
    borderColor: theme.colors.border.light,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.sm,
    outlineStyle: 'none',
  } as TextStyle,

  inputWithLeftIcon: {
    paddingLeft: theme.spacing.xs,
  },

  inputWithRightIcon: {
    paddingRight: theme.spacing.xs,
  },

  inputDisabled: {
    color: theme.colors.text.disabled,
  },

  leftIconContainer: {
    marginRight: theme.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },

  rightIconContainer: {
    marginLeft: theme.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },

  helperText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 6,
    marginLeft: 4,
  },

  errorText: {
    color: theme.colors.error.main,
  },
});

export default Input;
