/**
 * Spacing Utilities
 * 
 * Provides typed spacing utilities for consistent margins and paddings across the application.
 * Uses the centralized spacing scale from theme.ts (based on 4px base unit).
 * 
 * Usage:
 * ```typescript
 * import { applyMargin, applyPadding, applySpacing } from '@/styles/spacing';
 * 
 * // Apply margin to all sides
 * const styles = StyleSheet.create({
 *   container: {
 *     ...applyMargin('base'),
 *     backgroundColor: 'white',
 *   },
 * });
 * 
 * // Apply padding with different values per side
 * const styles2 = StyleSheet.create({
 *   card: {
 *     ...applyPadding({ vertical: 'lg', horizontal: 'md' }),
 *   },
 * });
 * ```
 */

import { ViewStyle } from 'react-native';

// ============================================================================
// Types
// ============================================================================

/**
 * Spacing scale keys from the theme
 */
export type SpacingKey = 'xs' | 'sm' | 'md' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';

/**
 * Spacing values in pixels (based on 4px base unit)
 */
export type SpacingValue = 4 | 8 | 12 | 16 | 24 | 32 | 48 | 64;

/**
 * Spacing configuration for all sides
 */
export interface SpacingAllSides {
  top?: SpacingKey;
  right?: SpacingKey;
  bottom?: SpacingKey;
  left?: SpacingKey;
}

/**
 * Spacing configuration for vertical and horizontal
 */
export interface SpacingAxes {
  vertical?: SpacingKey;
  horizontal?: SpacingKey;
}

/**
 * Union type for spacing configuration
 */
export type SpacingConfig = SpacingKey | SpacingAllSides | SpacingAxes;

// ============================================================================
// Spacing Scale
// ============================================================================

/**
 * Spacing scale based on 4px base unit
 * Matches the spacing constants from theme.ts
 */
export const spacingScale: Record<SpacingKey, SpacingValue> = {
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
// Utility Functions
// ============================================================================

/**
 * Get spacing value in pixels for a given spacing key
 * 
 * @param key - Spacing key from the scale
 * @returns Spacing value in pixels
 * 
 * @example
 * ```typescript
 * const spacing = getSpacing('base'); // Returns: 16
 * ```
 */
export function getSpacing(key: SpacingKey): SpacingValue {
  return spacingScale[key];
}

/**
 * Apply margin to a component
 * 
 * @param config - Spacing configuration (single value, axes, or all sides)
 * @returns ViewStyle object with margin properties
 * 
 * @example
 * ```typescript
 * // Single value for all sides
 * applyMargin('base') // { margin: 16 }
 * 
 * // Vertical and horizontal
 * applyMargin({ vertical: 'lg', horizontal: 'md' })
 * // { marginVertical: 24, marginHorizontal: 12 }
 * 
 * // Individual sides
 * applyMargin({ top: 'xl', bottom: 'sm', left: 'base', right: 'base' })
 * // { marginTop: 32, marginBottom: 8, marginLeft: 16, marginRight: 16 }
 * ```
 */
export function applyMargin(config: SpacingConfig): ViewStyle {
  if (typeof config === 'string') {
    return { margin: spacingScale[config] };
  }

  if ('vertical' in config || 'horizontal' in config) {
    const axes = config as SpacingAxes;
    const style: ViewStyle = {};
    if (axes.vertical) {
      style.marginVertical = spacingScale[axes.vertical];
    }
    if (axes.horizontal) {
      style.marginHorizontal = spacingScale[axes.horizontal];
    }
    return style;
  }

  const sides = config as SpacingAllSides;
  const style: ViewStyle = {};
  if (sides.top) style.marginTop = spacingScale[sides.top];
  if (sides.right) style.marginRight = spacingScale[sides.right];
  if (sides.bottom) style.marginBottom = spacingScale[sides.bottom];
  if (sides.left) style.marginLeft = spacingScale[sides.left];
  return style;
}

/**
 * Apply padding to a component
 * 
 * @param config - Spacing configuration (single value, axes, or all sides)
 * @returns ViewStyle object with padding properties
 * 
 * @example
 * ```typescript
 * // Single value for all sides
 * applyPadding('base') // { padding: 16 }
 * 
 * // Vertical and horizontal
 * applyPadding({ vertical: 'lg', horizontal: 'md' })
 * // { paddingVertical: 24, paddingHorizontal: 12 }
 * 
 * // Individual sides
 * applyPadding({ top: 'xl', bottom: 'sm', left: 'base', right: 'base' })
 * // { paddingTop: 32, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 }
 * ```
 */
export function applyPadding(config: SpacingConfig): ViewStyle {
  if (typeof config === 'string') {
    return { padding: spacingScale[config] };
  }

  if ('vertical' in config || 'horizontal' in config) {
    const axes = config as SpacingAxes;
    const style: ViewStyle = {};
    if (axes.vertical) {
      style.paddingVertical = spacingScale[axes.vertical];
    }
    if (axes.horizontal) {
      style.paddingHorizontal = spacingScale[axes.horizontal];
    }
    return style;
  }

  const sides = config as SpacingAllSides;
  const style: ViewStyle = {};
  if (sides.top) style.paddingTop = spacingScale[sides.top];
  if (sides.right) style.paddingRight = spacingScale[sides.right];
  if (sides.bottom) style.paddingBottom = spacingScale[sides.bottom];
  if (sides.left) style.paddingLeft = spacingScale[sides.left];
  return style;
}

/**
 * Apply both margin and padding (useful for complex layouts)
 * 
 * @param margin - Margin configuration
 * @param padding - Padding configuration
 * @returns ViewStyle object with both margin and padding properties
 * 
 * @example
 * ```typescript
 * applySpacing('base', 'lg')
 * // { margin: 16, padding: 24 }
 * 
 * applySpacing(
 *   { vertical: 'lg', horizontal: 'md' },
 *   { vertical: 'base', horizontal: 'sm' }
 * )
 * ```
 */
export function applySpacing(
  margin: SpacingConfig,
  padding: SpacingConfig
): ViewStyle {
  return {
    ...applyMargin(margin),
    ...applyPadding(padding),
  };
}

/**
 * Create a gap style for flexbox layouts
 * 
 * Note: React Native's gap property is supported in newer versions.
 * For older versions, use margin utilities on child components instead.
 * 
 * @param gap - Spacing key for the gap
 * @returns ViewStyle object with gap property
 * 
 * @example
 * ```typescript
 * const styles = StyleSheet.create({
 *   container: {
 *     flexDirection: 'row',
 *     ...applyGap('md'),
 *   },
 * });
 * ```
 */
export function applyGap(gap: SpacingKey): ViewStyle {
  return { gap: spacingScale[gap] };
}

/**
 * Create row and column gap styles for flexbox layouts
 * 
 * @param rowGap - Spacing key for row gap
 * @param columnGap - Spacing key for column gap
 * @returns ViewStyle object with rowGap and columnGap properties
 * 
 * @example
 * ```typescript
 * const styles = StyleSheet.create({
 *   grid: {
 *     flexDirection: 'row',
 *     flexWrap: 'wrap',
 *     ...applyGaps('lg', 'md'),
 *   },
 * });
 * ```
 */
export function applyGaps(rowGap: SpacingKey, columnGap: SpacingKey): ViewStyle {
  return {
    rowGap: spacingScale[rowGap],
    columnGap: spacingScale[columnGap],
  };
}

/**
 * Create margin top style
 * 
 * @param key - Spacing key
 * @returns ViewStyle object with marginTop
 */
export function marginTop(key: SpacingKey): ViewStyle {
  return { marginTop: spacingScale[key] };
}

/**
 * Create margin bottom style
 * 
 * @param key - Spacing key
 * @returns ViewStyle object with marginBottom
 */
export function marginBottom(key: SpacingKey): ViewStyle {
  return { marginBottom: spacingScale[key] };
}

/**
 * Create margin left style
 * 
 * @param key - Spacing key
 * @returns ViewStyle object with marginLeft
 */
export function marginLeft(key: SpacingKey): ViewStyle {
  return { marginLeft: spacingScale[key] };
}

/**
 * Create margin right style
 * 
 * @param key - Spacing key
 * @returns ViewStyle object with marginRight
 */
export function marginRight(key: SpacingKey): ViewStyle {
  return { marginRight: spacingScale[key] };
}

/**
 * Create padding top style
 * 
 * @param key - Spacing key
 * @returns ViewStyle object with paddingTop
 */
export function paddingTop(key: SpacingKey): ViewStyle {
  return { paddingTop: spacingScale[key] };
}

/**
 * Create padding bottom style
 * 
 * @param key - Spacing key
 * @returns ViewStyle object with paddingBottom
 */
export function paddingBottom(key: SpacingKey): ViewStyle {
  return { paddingBottom: spacingScale[key] };
}

/**
 * Create padding left style
 * 
 * @param key - Spacing key
 * @returns ViewStyle object with paddingLeft
 */
export function paddingLeft(key: SpacingKey): ViewStyle {
  return { paddingLeft: spacingScale[key] };
}

/**
 * Create padding right style
 * 
 * @param key - Spacing key
 * @returns ViewStyle object with paddingRight
 */
export function paddingRight(key: SpacingKey): ViewStyle {
  return { paddingRight: spacingScale[key] };
}

// ============================================================================
// Exports
// ============================================================================

/**
 * Export spacing keys as a constant array for iteration/validation
 */
export const spacingKeys: SpacingKey[] = [
  'xs',
  'sm',
  'md',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
];

/**
 * Default export for convenience
 */
export default {
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
  spacingKeys,
};
