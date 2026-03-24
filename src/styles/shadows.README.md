# Shadow Utilities

Typed shadow utilities for consistent elevation styling across the BagresApp application.

## Overview

The shadow utilities provide a standardized way to apply elevation shadows to components in React Native. Shadows work consistently across both iOS (using shadow properties) and Android (using elevation property).

## Features

- ✅ **5 Elevation Levels**: Predefined shadows for elevations 1-5
- ✅ **Type-Safe**: Full TypeScript support with typed elevation levels
- ✅ **Cross-Platform**: Works on both iOS and Android
- ✅ **Flexible**: Create custom shadows when needed
- ✅ **Easy to Use**: Simple API with intuitive function names

## Elevation Levels

| Level | Use Case | Shadow Depth |
|-------|----------|--------------|
| 1 | Subtle elevation (e.g., input fields) | Very light |
| 2 | Cards, buttons | Light |
| 3 | Raised cards, floating action buttons | Medium |
| 4 | Modals, dialogs | Deep |
| 5 | Popovers, tooltips | Very deep |

## API Reference

### `applyShadow(level: ElevationLevel): ShadowStyle`

Apply a shadow to a style object. This is the most common function you'll use.

**Parameters:**
- `level`: Elevation level (1-5)

**Returns:** Shadow style object that can be spread into StyleSheet

**Example:**
```typescript
const styles = StyleSheet.create({
  card: {
    ...applyShadow(2),
    backgroundColor: 'white',
  },
});
```

### `getShadow(level: ElevationLevel): ShadowStyle`

Get shadow style object for a specific elevation level. Functionally identical to `applyShadow`, but semantically clearer when storing the shadow object.

**Parameters:**
- `level`: Elevation level (1-5)

**Returns:** Shadow style object

**Example:**
```typescript
const shadow = getShadow(3);
console.log(shadow.elevation); // 3
```

### `createShadow(options): ShadowStyle`

Create a custom shadow with specific parameters.

**Parameters:**
- `options.color?`: Shadow color (default: '#000')
- `options.offsetX?`: Horizontal offset (default: 0)
- `options.offsetY?`: Vertical offset (default: 0)
- `options.opacity?`: Shadow opacity (default: 0.1)
- `options.radius?`: Shadow blur radius (default: 4)
- `options.elevation?`: Android elevation (default: 2)

**Returns:** Custom shadow style object

**Example:**
```typescript
const customShadow = createShadow({
  color: '#FF0000',
  offsetY: 5,
  opacity: 0.3,
  radius: 10,
  elevation: 3,
});
```

### `removeShadow(): ShadowStyle`

Remove all shadow styles. Useful for conditional styling.

**Returns:** Shadow style with all values set to zero

**Example:**
```typescript
const styles = StyleSheet.create({
  card: {
    ...(isElevated ? applyShadow(2) : removeShadow()),
    backgroundColor: 'white',
  },
});
```

### `getShadowStyle(level: ElevationLevel): ViewStyle`

Get shadow as a ViewStyle object for type compatibility.

**Parameters:**
- `level`: Elevation level (1-5)

**Returns:** Shadow style as ViewStyle

**Example:**
```typescript
const shadowStyle: ViewStyle = getShadowStyle(2);
```

## Types

### `ElevationLevel`

```typescript
type ElevationLevel = 1 | 2 | 3 | 4 | 5;
```

Valid elevation levels for the shadow system.

### `ShadowStyle`

```typescript
interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}
```

Shadow style properties for React Native.

## Usage Examples

### Basic Card with Shadow

```typescript
import { applyShadow } from '@/styles/shadows';

const styles = StyleSheet.create({
  card: {
    ...applyShadow(2),
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
});
```

### Dynamic Shadow Based on Props

```typescript
import { getShadow } from '@/styles/shadows';

interface CardProps {
  elevation: 1 | 2 | 3 | 4 | 5;
}

function Card({ elevation }: CardProps) {
  const styles = StyleSheet.create({
    card: {
      ...getShadow(elevation),
      backgroundColor: 'white',
    },
  });
  
  return <View style={styles.card}>...</View>;
}
```

### Custom Colored Shadow

```typescript
import { createShadow } from '@/styles/shadows';

const styles = StyleSheet.create({
  specialCard: {
    ...createShadow({
      color: '#4299E1',
      offsetY: 4,
      opacity: 0.3,
      radius: 8,
      elevation: 3,
    }),
    backgroundColor: 'white',
  },
});
```

### Conditional Shadow

```typescript
import { applyShadow, removeShadow } from '@/styles/shadows';

function ToggleCard({ isElevated }: { isElevated: boolean }) {
  const styles = StyleSheet.create({
    card: {
      ...(isElevated ? applyShadow(3) : removeShadow()),
      backgroundColor: 'white',
    },
  });
  
  return <View style={styles.card}>...</View>;
}
```

### Button with Press State

```typescript
import { applyShadow } from '@/styles/shadows';

function Button() {
  const [isPressed, setIsPressed] = useState(false);
  
  const styles = StyleSheet.create({
    button: {
      ...(isPressed ? applyShadow(1) : applyShadow(3)),
      backgroundColor: '#4299E1',
    },
  });
  
  return (
    <Pressable
      style={styles.button}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <Text>Press Me</Text>
    </Pressable>
  );
}
```

## Best Practices

1. **Use Standard Elevations**: Prefer the 5 standard elevation levels for consistency
2. **Match Elevation to Hierarchy**: Higher elevations should be used for elements that are visually "above" others
3. **Avoid Over-Elevation**: Don't use elevation 5 for everything - it loses its impact
4. **Consider Performance**: Shadows can impact performance on lower-end devices
5. **Test on Both Platforms**: Shadows render differently on iOS and Android

## Design Guidelines

### When to Use Each Level

**Elevation 1** - Subtle depth
- Input fields
- Chips
- Subtle cards

**Elevation 2** - Standard depth
- Cards
- Buttons
- List items

**Elevation 3** - Raised elements
- Floating action buttons
- Raised cards
- Selected items

**Elevation 4** - Overlays
- Modals
- Dialogs
- Drawers

**Elevation 5** - Top-most elements
- Popovers
- Tooltips
- Dropdown menus

## Platform Differences

### iOS
Uses `shadowColor`, `shadowOffset`, `shadowOpacity`, and `shadowRadius` properties.

### Android
Uses the `elevation` property, which is simpler but less customizable.

The shadow utilities handle both platforms automatically, ensuring consistent appearance across devices.

## Related

- [Theme System](./theme.ts) - Color palette and design tokens
- [Spacing System](./spacing.ts) - Consistent spacing utilities
- [Typography](./typography.ts) - Text styling utilities

## Validation

This utility validates **Requirement 3.8**: "THE Style_System SHALL provide elevation and shadow utilities for depth"
