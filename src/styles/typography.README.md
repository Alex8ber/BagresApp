# Typography System

Reusable typography styles for consistent text styling across the application.

## Overview

The typography system provides:
- Font families, weights, sizes, line heights, and letter spacing constants
- Pre-configured text style presets for common use cases
- Type-safe access to all typography tokens

## Usage

### Import Typography Styles

```typescript
import { typography, fontSize, fontWeight } from '@/styles';
// or
import { typography } from '@/styles/typography';
```

### Using Typography Presets

Apply typography presets directly to Text components:

```tsx
import { Text, StyleSheet } from 'react-native';
import { typography } from '@/styles';

function MyComponent() {
  return (
    <>
      <Text style={styles.title}>Main Title</Text>
      <Text style={styles.body}>Body text content</Text>
      <Text style={styles.caption}>Small caption text</Text>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.h1,
    // Add custom overrides if needed
  },
  body: {
    ...typography.body1,
  },
  caption: {
    ...typography.caption,
  },
});
```

## Available Typography Presets

### Headings

- `typography.h1` - Extra large heading (42px, extrabold)
- `typography.h2` - Large heading (36px, bold)
- `typography.h3` - Medium heading (30px, bold)
- `typography.h4` - Small heading (24px, bold)
- `typography.h5` - Extra small heading (20px, semibold)
- `typography.h6` - Tiny heading (18px, semibold)

### Body Text

- `typography.body1` - Regular body text (16px, regular)
- `typography.body2` - Small body text (14px, regular)

### Subtitles

- `typography.subtitle1` - Regular subtitle (16px, medium)
- `typography.subtitle2` - Small subtitle (14px, medium)

### Special Text

- `typography.caption` - Caption text (12px, regular)
- `typography.overline` - Uppercase overline text (12px, semibold, uppercase)
- `typography.button` - Button text (14px, bold, wide letter spacing)

## Typography Constants

### Font Sizes

```typescript
fontSize.xs    // 12
fontSize.sm    // 14
fontSize.base  // 16
fontSize.lg    // 18
fontSize.xl    // 20
fontSize['2xl'] // 24
fontSize['3xl'] // 30
fontSize['4xl'] // 36
fontSize['5xl'] // 42
fontSize['6xl'] // 48
```

### Font Weights

```typescript
fontWeight.regular   // '400'
fontWeight.medium    // '500'
fontWeight.semibold  // '600'
fontWeight.bold      // '700'
fontWeight.extrabold // '800'
```

### Line Heights

```typescript
lineHeight.tight   // 1.2
lineHeight.normal  // 1.5
lineHeight.relaxed // 1.75
lineHeight.loose   // 2
```

### Letter Spacing

```typescript
letterSpacing.tighter // -0.5
letterSpacing.tight   // -0.25
letterSpacing.normal  // 0
letterSpacing.wide    // 0.25
letterSpacing.wider   // 0.5
letterSpacing.widest  // 1
```

## Custom Typography Styles

You can create custom typography styles by combining constants:

```typescript
const styles = StyleSheet.create({
  customText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.relaxed,
    letterSpacing: letterSpacing.wide,
  },
});
```

## Best Practices

1. **Use presets first**: Always try to use existing typography presets before creating custom styles
2. **Consistent spacing**: Use typography presets with spacing tokens for consistent vertical rhythm
3. **Avoid inline styles**: Define typography styles in StyleSheet.create for better performance
4. **Type safety**: Import from `@/styles` to get full TypeScript support
5. **Color separation**: Typography presets don't include colors - apply colors separately using the color system

## Examples

### Card with Typography

```tsx
import { View, Text, StyleSheet } from 'react-native';
import { typography, spacing, colors } from '@/styles';

function InfoCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Card Title</Text>
      <Text style={styles.subtitle}>Subtitle text</Text>
      <Text style={styles.body}>
        This is the main content of the card with regular body text.
      </Text>
      <Text style={styles.caption}>Last updated: 2 hours ago</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.subtitle2,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  body: {
    ...typography.body1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  caption: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
});
```

### Button with Typography

```tsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { typography, colors, spacing, borderRadius } from '@/styles';

function PrimaryButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  buttonText: {
    ...typography.button,
    color: colors.text.inverse,
    textAlign: 'center',
  },
});
```
