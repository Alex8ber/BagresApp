/**
 * Theme System
 * 
 * Centralized design tokens for consistent styling across the application.
 * Provides typed color palette, spacing system, typography, and design tokens.
 */

import {
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
  typography,
} from './typography';

// ============================================================================
// Color Palette
// ============================================================================

export const colors = {
  // Primary Colors
  primary: {
    50: '#E8F0FE',
    100: '#D2E3FC',
    200: '#AECBFA',
    300: '#8AB4F8',
    400: '#669DF6',
    500: '#4299E1', // Main primary
    600: '#1A73E8',
    700: '#1967D2',
    800: '#185ABC',
    900: '#174EA6',
  },

  // Secondary Colors (Green for students)
  secondary: {
    50: '#E6F4EA',
    100: '#CEEAD6',
    200: '#A8DAB5',
    300: '#81C995',
    400: '#57BA74',
    500: '#38A169', // Main secondary
    600: '#2E8555',
    700: '#256D46',
    800: '#1E5A3A',
    900: '#19472F',
  },

  // Neutral/Gray Scale
  neutral: {
    50: '#FAFBFD',
    100: '#F7FAFC',
    200: '#EDF2F7',
    300: '#E2E8F0',
    400: '#CBD5E0',
    500: '#A0AEC0',
    600: '#718096',
    700: '#4A5568',
    800: '#2D3748',
    900: '#1A202C',
  },

  // Semantic Colors
  success: {
    light: '#C6F6D5',
    main: '#48BB78',
    dark: '#2F855A',
  },

  error: {
    light: '#FED7D7',
    main: '#F56565',
    dark: '#C53030',
  },

  warning: {
    light: '#FEEBC8',
    main: '#ED8936',
    dark: '#C05621',
  },

  info: {
    light: '#BEE3F8',
    main: '#4299E1',
    dark: '#2B6CB0',
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#FAFBFD',
    tertiary: '#F7FAFC',
    disabled: '#EDF2F7',
  },

  // Text Colors
  text: {
    primary: '#2D3748',
    secondary: '#718096',
    tertiary: '#A0AEC0',
    disabled: '#CBD5E0',
    inverse: '#FFFFFF',
  },

  // Border Colors
  border: {
    light: '#E2E8F0',
    main: '#CBD5E0',
    dark: '#A0AEC0',
  },

  // Overlay Colors
  overlay: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.3)',
    dark: 'rgba(0, 0, 0, 0.5)',
  },

  // Role-specific Colors
  teacher: {
    light: '#E8F0FE',
    main: '#4299E1',
    dark: '#1967D2',
    border: '#D2E3FC',
  },

  student: {
    light: '#E6F4EA',
    main: '#38A169',
    dark: '#256D46',
    border: '#CEEAD6',
  },
} as const;

// ============================================================================
// Spacing System
// ============================================================================

/**
 * Spacing scale based on 4px base unit
 * Use these values for consistent spacing throughout the app
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

// ============================================================================
// Typography (Re-exported from typography.ts)
// ============================================================================

// Typography constants are imported from typography.ts and re-exported here
// for backward compatibility and centralized theme access
export { fontFamily, fontWeight, fontSize, lineHeight, letterSpacing, typography };

// ============================================================================
// Border Radius
// ============================================================================

export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  full: 9999,
} as const;

// ============================================================================
// Shadows and Elevation
// ============================================================================

/**
 * Shadow presets for different elevation levels
 */
export const shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
} as const;

// ============================================================================
// Opacity
// ============================================================================

export const opacity = {
  disabled: 0.4,
  hover: 0.8,
  pressed: 0.6,
} as const;

// ============================================================================
// Z-Index
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
} as const;

// ============================================================================
// Animation Duration
// ============================================================================

export const duration = {
  fast: 150,
  base: 200,
  slow: 300,
  slower: 500,
} as const;

// ============================================================================
// Default Theme Export
// ============================================================================

export const theme = {
  colors,
  spacing,
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
  typography,
  borderRadius,
  shadows,
  opacity,
  zIndex,
  duration,
} as const;

// ============================================================================
// TypeScript Types
// ============================================================================

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;

export default theme;
