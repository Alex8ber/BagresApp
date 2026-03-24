/**
 * Typography System
 * 
 * Reusable typography styles for consistent text styling across the application.
 * Provides font families, weights, sizes, line heights, letter spacing, and text style presets.
 */

import { TextStyle } from 'react-native';

// ============================================================================
// Font Families
// ============================================================================

/**
 * Font families
 */
export const fontFamily = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
} as const;

// ============================================================================
// Font Weights
// ============================================================================

/**
 * Font weights
 */
export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
} as const;

// ============================================================================
// Font Sizes
// ============================================================================

/**
 * Font sizes
 */
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 42,
  '6xl': 48,
} as const;

// ============================================================================
// Line Heights
// ============================================================================

/**
 * Line heights
 */
export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
} as const;

// ============================================================================
// Letter Spacing
// ============================================================================

/**
 * Letter spacing
 */
export const letterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
  widest: 1,
} as const;

// ============================================================================
// Typography Presets
// ============================================================================

/**
 * Typography presets for common text styles
 * These can be used directly with Text components for consistent styling
 */
export const typography = {
  // Headings
  h1: {
    fontSize: fontSize['5xl'],
    fontWeight: fontWeight.extrabold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  h2: {
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  h3: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  h4: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.normal,
  } as TextStyle,

  h5: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
  } as TextStyle,

  h6: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
  } as TextStyle,

  // Body text
  body1: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
  } as TextStyle,

  body2: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
  } as TextStyle,

  // Subtitles
  subtitle1: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
  } as TextStyle,

  subtitle2: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
  } as TextStyle,

  // Caption and overline
  caption: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
  } as TextStyle,

  overline: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase' as const,
  } as TextStyle,

  // Button text
  button: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,
} as const;

// ============================================================================
// TypeScript Types
// ============================================================================

export type FontFamily = typeof fontFamily;
export type FontWeight = typeof fontWeight;
export type FontSize = typeof fontSize;
export type LineHeight = typeof lineHeight;
export type LetterSpacing = typeof letterSpacing;
export type Typography = typeof typography;

// ============================================================================
// Default Export
// ============================================================================

export default {
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
  typography,
};
