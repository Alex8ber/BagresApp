/**
 * Styles Barrel Export
 * 
 * Central export point for all style-related modules.
 * Provides convenient access to theme, shadows, typography, and spacing utilities.
 * 
 * Usage:
 * ```typescript
 * // Import everything from styles
 * import { theme, applyShadow, typography, applyPadding } from '@/styles';
 * 
 * // Or import specific modules
 * import { colors, spacing } from '@/styles';
 * ```
 */

// ============================================================================
// Theme
// ============================================================================

export {
  // Theme object and constants
  theme,
  colors,
  spacing,
  borderRadius,
  shadows,
  opacity,
  zIndex,
  duration,
  
  // Typography (re-exported from theme)
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
  typography,
  
  // TypeScript types
  type Theme,
  type Colors,
  type Spacing,
  type Typography,
  type BorderRadius,
  type Shadows,
} from './theme';

// ============================================================================
// Shadow Utilities
// ============================================================================

export {
  // Shadow functions
  getShadow,
  applyShadow,
  createShadow,
  removeShadow,
  getShadowStyle,
  
  // Shadow constants
  elevationLevels,
  
  // TypeScript types
  type ElevationLevel,
  type ShadowStyle,
} from './shadows';

// ============================================================================
// Typography Utilities
// ============================================================================

export {
  // Typography types (already exported from theme, but re-exported here for clarity)
  type FontFamily,
  type FontWeight,
  type FontSize,
  type LineHeight,
  type LetterSpacing,
} from './typography';

// ============================================================================
// Spacing Utilities
// ============================================================================

export {
  // Spacing functions
  spacingScale,
  getSpacing,
  applyMargin,
  applyPadding,
  applySpacing,
  applyGap,
  applyGaps,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  
  // Spacing constants
  spacingKeys,
  
  // TypeScript types
  type SpacingKey,
  type SpacingValue,
  type SpacingAllSides,
  type SpacingAxes,
  type SpacingConfig,
} from './spacing';

// ============================================================================
// Default Export
// ============================================================================

/**
 * Default export provides the complete theme object
 */
export { default } from './theme';
