/**
 * Shadow Utilities
 * 
 * Provides typed shadow utilities for consistent elevation styling across the application.
 * Shadows are defined for elevations 1-5, with each level providing progressively deeper depth.
 * 
 * Usage:
 * ```typescript
 * import { getShadow, applyShadow } from '@/styles/shadows';
 * 
 * // Get shadow object for elevation 2
 * const shadow = getShadow(2);
 * 
 * // Apply shadow directly to a style object
 * const styles = StyleSheet.create({
 *   card: {
 *     ...applyShadow(3),
 *     backgroundColor: 'white',
 *   },
 * });
 * ```
 */

import { ViewStyle } from 'react-native';

// ============================================================================
// Types
// ============================================================================

/**
 * Elevation levels supported by the shadow system
 */
export type ElevationLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Shadow style properties for React Native
 */
export interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

// ============================================================================
// Shadow Definitions
// ============================================================================

/**
 * Shadow presets for different elevation levels
 * 
 * Each elevation level provides a consistent shadow that works across
 * both iOS (shadow properties) and Android (elevation property).
 */
const shadowPresets: Record<ElevationLevel, ShadowStyle> = {
  1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  4: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  5: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get shadow style object for a specific elevation level
 * 
 * @param level - Elevation level (1-5)
 * @returns Shadow style object with all necessary properties
 * 
 * @example
 * ```typescript
 * const shadow = getShadow(2);
 * // Returns: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, ... }
 * ```
 */
export function getShadow(level: ElevationLevel): ShadowStyle {
  return shadowPresets[level];
}

/**
 * Apply shadow to a style object (alias for getShadow)
 * 
 * This function is semantically clearer when spreading into StyleSheet objects.
 * 
 * @param level - Elevation level (1-5)
 * @returns Shadow style object that can be spread into a style definition
 * 
 * @example
 * ```typescript
 * const styles = StyleSheet.create({
 *   card: {
 *     ...applyShadow(3),
 *     backgroundColor: 'white',
 *     borderRadius: 8,
 *   },
 * });
 * ```
 */
export function applyShadow(level: ElevationLevel): ShadowStyle {
  return getShadow(level);
}

/**
 * Create a custom shadow with specific parameters
 * 
 * Use this when you need fine-grained control over shadow properties
 * beyond the standard elevation levels.
 * 
 * @param options - Custom shadow configuration
 * @returns Shadow style object
 * 
 * @example
 * ```typescript
 * const customShadow = createShadow({
 *   color: '#FF0000',
 *   offsetY: 5,
 *   opacity: 0.3,
 *   radius: 10,
 *   elevation: 3,
 * });
 * ```
 */
export function createShadow(options: {
  color?: string;
  offsetX?: number;
  offsetY?: number;
  opacity?: number;
  radius?: number;
  elevation?: number;
}): ShadowStyle {
  return {
    shadowColor: options.color ?? '#000',
    shadowOffset: {
      width: options.offsetX ?? 0,
      height: options.offsetY ?? 0,
    },
    shadowOpacity: options.opacity ?? 0.1,
    shadowRadius: options.radius ?? 4,
    elevation: options.elevation ?? 2,
  };
}

/**
 * Remove all shadow styles (useful for conditional styling)
 * 
 * @returns Shadow style object with all values set to zero/transparent
 * 
 * @example
 * ```typescript
 * const styles = StyleSheet.create({
 *   card: {
 *     ...(isElevated ? applyShadow(2) : removeShadow()),
 *     backgroundColor: 'white',
 *   },
 * });
 * ```
 */
export function removeShadow(): ShadowStyle {
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  };
}

/**
 * Get shadow style as a ViewStyle object (for type compatibility)
 * 
 * @param level - Elevation level (1-5)
 * @returns Shadow style as ViewStyle
 */
export function getShadowStyle(level: ElevationLevel): ViewStyle {
  return getShadow(level) as ViewStyle;
}

// ============================================================================
// Exports
// ============================================================================

/**
 * Export shadow presets for direct access if needed
 */
export const shadows = shadowPresets;

/**
 * Export elevation levels as a constant array for iteration/validation
 */
export const elevationLevels: ElevationLevel[] = [1, 2, 3, 4, 5];

/**
 * Default export for convenience
 */
export default {
  getShadow,
  applyShadow,
  createShadow,
  removeShadow,
  getShadowStyle,
  shadows,
  elevationLevels,
};
