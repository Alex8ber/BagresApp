# Spacing Utilities

Provides typed spacing utilities for consistent margins and paddings across the application. Uses the centralized spacing scale from `theme.ts` (based on 4px base unit).

## Spacing Scale

The spacing system uses a consistent scale based on a 4px base unit:

| Key    | Value | Use Case                          |
|--------|-------|-----------------------------------|
| `xs`   | 4px   | Minimal spacing, tight layouts    |
| `sm`   | 8px   | Small gaps, compact elements      |
| `md`   | 12px  | Medium spacing                    |
| `base` | 16px  | Default spacing (recommended)     |
| `lg`   | 24px  | Large spacing, section separation |
| `xl`   | 32px  | Extra large spacing               |
| `2xl`  | 48px  | Very large spacing                |
| `3xl`  | 64px  | Maximum spacing                   |

## Basic Usage

### Apply Margin

```typescript
import { StyleSheet } from 'react-native';
import { applyMargin } from '@/styles/spacing';

const styles = StyleSheet.create({
  // Single value for all sides
  container: {
    ...applyMargin('base'), // margin: 16
    backgroundColor: 'white',
  },
  
  // Vertical and horizontal
  card: {
    ...applyMargin({ vertical: 'lg', horizontal: 'md' }),
    // marginVertical: 24, marginHorizontal: 12
  },
  
  // Individual sides
  header: {
    ...applyMargin({ top: 'xl', bottom: 'sm', left: 'base', right: 'base' }),
    // marginTop: 32, marginBottom: 8, marginLeft: 16, marginRight: 16
  },
});
```

### Apply Padding

```typescript
import { StyleSheet } from 'react-native';
import { applyPadding } from '@/styles/spacing';

const styles = StyleSheet.create({
  // Single value for all sides
  container: {
    ...applyPadding('base'), // padding: 16
    backgroundColor: 'white',
  },
  
  // Vertical and horizontal
  card: {
    ...applyPadding({ vertical: 'lg', horizontal: 'md' }),
    // paddingVertical: 24, paddingHorizontal: 12
  },
  
  // Individual sides
  content: {
    ...applyPadding({ top: 'xl', bottom: 'sm', left: 'base', right: 'base' }),
    // paddingTop: 32, paddingBottom: 8, paddingLeft: 16, paddingRight: 16
  },
});
```

### Apply Both Margin and Padding

```typescript
import { StyleSheet } from 'react-native';
import { applySpacing } from '@/styles/spacing';

const styles = StyleSheet.create({
  container: {
    ...applySpacing('base', 'lg'),
    // margin: 16, padding: 24
    backgroundColor: 'white',
  },
  
  card: {
    ...applySpacing(
      { vertical: 'lg', horizontal: 'md' },
      { vertical: 'base', horizontal: 'sm' }
    ),
    // marginVertical: 24, marginHorizontal: 12
    // paddingVertical: 16, paddingHorizontal: 8
  },
});
```

## Individual Side Utilities

For quick single-side spacing:

```typescript
import { StyleSheet } from 'react-native';
import { marginTop, marginBottom, paddingLeft, paddingRight } from '@/styles/spacing';

const styles = StyleSheet.create({
  header: {
    ...marginTop('xl'),      // marginTop: 32
    ...marginBottom('base'), // marginBottom: 16
  },
  
  content: {
    ...paddingLeft('lg'),    // paddingLeft: 24
    ...paddingRight('lg'),   // paddingRight: 24
  },
});
```

## Flexbox Gap Utilities

For modern flexbox layouts with gap support:

```typescript
import { StyleSheet } from 'react-native';
import { applyGap, applyGaps } from '@/styles/spacing';

const styles = StyleSheet.create({
  // Single gap for both row and column
  row: {
    flexDirection: 'row',
    ...applyGap('md'), // gap: 12
  },
  
  // Different row and column gaps
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...applyGaps('lg', 'md'), // rowGap: 24, columnGap: 12
  },
});
```

**Note:** The `gap` property requires React Native 0.71+. For older versions, use margin utilities on child components instead.

## Get Raw Spacing Value

If you need the raw pixel value:

```typescript
import { getSpacing } from '@/styles/spacing';

const spacing = getSpacing('base'); // Returns: 16
const customStyle = {
  width: getSpacing('xl') * 2, // 64px
};
```

## Complete Example

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { applyMargin, applyPadding, applyGap } from '@/styles/spacing';
import { colors } from '@/styles/theme';

export function ExampleCard() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Card Title</Text>
        <Text style={styles.description}>Card description text</Text>
        <View style={styles.actions}>
          <View style={styles.button}>
            <Text>Action 1</Text>
          </View>
          <View style={styles.button}>
            <Text>Action 2</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...applyPadding('base'),
    backgroundColor: colors.background.secondary,
  },
  card: {
    ...applyPadding({ vertical: 'lg', horizontal: 'base' }),
    ...applyMargin({ bottom: 'md' }),
    backgroundColor: colors.background.primary,
    borderRadius: 8,
  },
  title: {
    ...applyMargin({ bottom: 'sm' }),
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    ...applyMargin({ bottom: 'lg' }),
    color: colors.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    ...applyGap('md'),
  },
  button: {
    ...applyPadding({ vertical: 'sm', horizontal: 'base' }),
    backgroundColor: colors.primary[500],
    borderRadius: 4,
  },
});
```

## Best Practices

1. **Use the spacing scale consistently** - Avoid hardcoded pixel values
2. **Prefer semantic spacing keys** - Use `base` as your default, scale up/down as needed
3. **Use vertical/horizontal shortcuts** - More concise than individual sides when appropriate
4. **Combine with theme colors** - Import both spacing and colors from `@/styles`
5. **Use gap for flexbox** - Cleaner than margins on children (when supported)
6. **Keep spacing predictable** - Stick to the scale for visual consistency

## TypeScript Support

All spacing utilities are fully typed:

```typescript
import { SpacingKey, SpacingConfig } from '@/styles/spacing';

// SpacingKey: 'xs' | 'sm' | 'md' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
const key: SpacingKey = 'base';

// SpacingConfig: SpacingKey | SpacingAllSides | SpacingAxes
const config: SpacingConfig = { vertical: 'lg', horizontal: 'md' };
```

## API Reference

### Functions

- `getSpacing(key)` - Get raw spacing value in pixels
- `applyMargin(config)` - Apply margin styles
- `applyPadding(config)` - Apply padding styles
- `applySpacing(margin, padding)` - Apply both margin and padding
- `applyGap(gap)` - Apply flexbox gap
- `applyGaps(rowGap, columnGap)` - Apply row and column gaps
- `marginTop(key)` - Apply margin top
- `marginBottom(key)` - Apply margin bottom
- `marginLeft(key)` - Apply margin left
- `marginRight(key)` - Apply margin right
- `paddingTop(key)` - Apply padding top
- `paddingBottom(key)` - Apply padding bottom
- `paddingLeft(key)` - Apply padding left
- `paddingRight(key)` - Apply padding right

### Types

- `SpacingKey` - Valid spacing scale keys
- `SpacingValue` - Spacing values in pixels
- `SpacingAllSides` - Configuration for individual sides
- `SpacingAxes` - Configuration for vertical/horizontal
- `SpacingConfig` - Union of all spacing configurations

### Constants

- `spacingScale` - The complete spacing scale object
- `spacingKeys` - Array of all spacing keys
