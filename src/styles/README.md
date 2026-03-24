# Styles Module

This module provides a centralized, type-safe theme system for consistent styling across the application.

## Usage

### Importing the Theme

```typescript
// Import the entire theme
import { theme } from '@/styles';

// Import specific tokens
import { colors, spacing, typography, shadows } from '@/styles';
```

### Using Colors

```typescript
import { StyleSheet } from 'react-native';
import { colors } from '@/styles';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    borderColor: colors.border.light,
  },
  primaryButton: {
    backgroundColor: colors.primary[500],
  },
  teacherCard: {
    backgroundColor: colors.teacher.light,
    borderColor: colors.teacher.border,
  },
});
```

### Using Spacing

```typescript
import { StyleSheet } from 'react-native';
import { spacing } from '@/styles';

const styles = StyleSheet.create({
  container: {
    padding: spacing.base,        // 16px
    marginBottom: spacing.lg,     // 24px
    gap: spacing.sm,              // 8px
  },
  header: {
    paddingHorizontal: spacing.xl, // 32px
    paddingVertical: spacing.md,   // 12px
  },
});
```

### Using Typography

```typescript
import { StyleSheet } from 'react-native';
import { typography, fontSize, fontWeight } from '@/styles';

const styles = StyleSheet.create({
  // Using typography presets
  title: {
    ...typography.h1,
  },
  subtitle: {
    ...typography.subtitle1,
  },
  
  // Using individual tokens
  customText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
});
```

### Using Shadows

```typescript
import { StyleSheet } from 'react-native';
import { shadows, borderRadius } from '@/styles';

const styles = StyleSheet.create({
  card: {
    ...shadows.lg,
    borderRadius: borderRadius.xl,
  },
  button: {
    ...shadows.base,
    borderRadius: borderRadius.md,
  },
});
```

### Complete Example

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, shadows, borderRadius } from '@/styles';

export function ExampleCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>This is an example card</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body2,
    color: colors.text.secondary,
  },
});
```

## Theme Structure

### Colors
- **Primary**: Blue color palette for teacher-related UI
- **Secondary**: Green color palette for student-related UI
- **Neutral**: Gray scale for backgrounds and borders
- **Semantic**: Success, error, warning, info colors
- **Background**: Various background shades
- **Text**: Text color hierarchy
- **Border**: Border color options
- **Overlay**: Semi-transparent overlays
- **Role-specific**: Teacher and student theme colors

### Spacing
Based on 4px base unit:
- `xs`: 4px
- `sm`: 8px
- `md`: 12px
- `base`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

### Typography
- **Headings**: h1 through h6
- **Body**: body1, body2
- **Subtitles**: subtitle1, subtitle2
- **Caption**: Small text
- **Overline**: Uppercase labels
- **Button**: Button text styles

### Border Radius
- `none`: 0
- `sm`: 4px
- `base`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 24px
- `2xl`: 32px
- `full`: 9999px (circular)

### Shadows
Elevation levels from `none` to `2xl` with appropriate shadow properties for both iOS and Android.

### Other Tokens
- **Opacity**: disabled, hover, pressed states
- **Z-Index**: Layering system for modals, dropdowns, etc.
- **Duration**: Animation timing values

## TypeScript Support

All theme tokens are fully typed for autocomplete and type safety:

```typescript
import type { Theme, Colors, Spacing, Typography } from '@/styles';

// Use types in your components
interface MyComponentProps {
  backgroundColor?: keyof Colors['primary'];
  spacing?: keyof Spacing;
}
```

## Best Practices

1. **Always use theme tokens** instead of hardcoded values
2. **Use typography presets** for consistent text styling
3. **Use spacing scale** for consistent layout
4. **Use semantic colors** (success, error, warning) for status indicators
5. **Use shadows** for elevation and depth
6. **Avoid inline styles** - use StyleSheet.create with theme tokens
