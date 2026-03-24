/**
 * Shared Components Barrel Export
 * 
 * Centralized export point for all shared/reusable components.
 * Import shared components from this file for better tree-shaking and cleaner imports.
 * 
 * Usage:
 * ```typescript
 * import { Button, Input, Card } from '@/components/shared';
 * ```
 */

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './Button';
export { Input, type InputProps } from './Input';
export { Card, type CardProps, type CardVariant } from './Card';
