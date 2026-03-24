/**
 * Shadow Utilities - Usage Examples
 * 
 * This file demonstrates how to use the shadow utilities in your components.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { applyShadow, getShadow, createShadow, removeShadow } from './shadows';
import { colors, spacing, borderRadius } from './theme';

/**
 * Example 1: Using applyShadow with StyleSheet
 * 
 * The most common pattern - spread applyShadow() directly into your styles.
 */
export function CardWithShadowExample() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardText}>Card with Elevation 2</Text>
      </View>
      
      <View style={styles.elevatedCard}>
        <Text style={styles.cardText}>Card with Elevation 4</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.base,
    gap: spacing.lg,
  },
  card: {
    ...applyShadow(2), // Apply elevation 2 shadow
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.base,
    padding: spacing.base,
  },
  elevatedCard: {
    ...applyShadow(4), // Apply elevation 4 shadow
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.base,
    padding: spacing.base,
  },
  cardText: {
    color: colors.text.primary,
  },
});

/**
 * Example 2: Using getShadow for dynamic shadows
 * 
 * When you need to compute shadow based on props or state.
 */
interface DynamicCardProps {
  elevation: 1 | 2 | 3 | 4 | 5;
  children: React.ReactNode;
}

export function DynamicCard({ elevation, children }: DynamicCardProps) {
  const dynamicStyles = StyleSheet.create({
    card: {
      ...getShadow(elevation), // Dynamic elevation
      backgroundColor: colors.background.primary,
      borderRadius: borderRadius.base,
      padding: spacing.base,
    },
  });

  return <View style={dynamicStyles.card}>{children}</View>;
}

/**
 * Example 3: Using createShadow for custom shadows
 * 
 * When you need a shadow that doesn't match the standard elevations.
 */
export function CustomShadowExample() {
  return (
    <View style={customStyles.container}>
      <View style={customStyles.redShadowCard}>
        <Text style={customStyles.text}>Card with Red Shadow</Text>
      </View>
      
      <View style={customStyles.deepShadowCard}>
        <Text style={customStyles.text}>Card with Deep Shadow</Text>
      </View>
    </View>
  );
}

const customStyles = StyleSheet.create({
  container: {
    padding: spacing.base,
    gap: spacing.lg,
  },
  redShadowCard: {
    ...createShadow({
      color: '#FF0000',
      offsetY: 4,
      opacity: 0.3,
      radius: 8,
      elevation: 3,
    }),
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.base,
    padding: spacing.base,
  },
  deepShadowCard: {
    ...createShadow({
      offsetY: 15,
      opacity: 0.2,
      radius: 20,
      elevation: 6,
    }),
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.base,
    padding: spacing.base,
  },
  text: {
    color: colors.text.primary,
  },
});

/**
 * Example 4: Conditional shadows with removeShadow
 * 
 * Toggle shadows based on state or props.
 */
interface ToggleableCardProps {
  isElevated: boolean;
  children: React.ReactNode;
}

export function ToggleableCard({ isElevated, children }: ToggleableCardProps) {
  const toggleStyles = StyleSheet.create({
    card: {
      ...(isElevated ? applyShadow(3) : removeShadow()),
      backgroundColor: colors.background.primary,
      borderRadius: borderRadius.base,
      padding: spacing.base,
    },
  });

  return <View style={toggleStyles.card}>{children}</View>;
}

/**
 * Example 5: All elevation levels showcase
 * 
 * Display all available elevation levels side by side.
 */
export function ElevationShowcase() {
  return (
    <View style={showcaseStyles.container}>
      <Text style={showcaseStyles.title}>Elevation Levels</Text>
      
      <View style={showcaseStyles.level1}>
        <Text style={showcaseStyles.levelText}>Elevation 1</Text>
      </View>
      
      <View style={showcaseStyles.level2}>
        <Text style={showcaseStyles.levelText}>Elevation 2</Text>
      </View>
      
      <View style={showcaseStyles.level3}>
        <Text style={showcaseStyles.levelText}>Elevation 3</Text>
      </View>
      
      <View style={showcaseStyles.level4}>
        <Text style={showcaseStyles.levelText}>Elevation 4</Text>
      </View>
      
      <View style={showcaseStyles.level5}>
        <Text style={showcaseStyles.levelText}>Elevation 5</Text>
      </View>
    </View>
  );
}

const showcaseStyles = StyleSheet.create({
  container: {
    padding: spacing.base,
    gap: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  level1: {
    ...applyShadow(1),
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.base,
    padding: spacing.base,
  },
  level2: {
    ...applyShadow(2),
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.base,
    padding: spacing.base,
  },
  level3: {
    ...applyShadow(3),
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.base,
    padding: spacing.base,
  },
  level4: {
    ...applyShadow(4),
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.base,
    padding: spacing.base,
  },
  level5: {
    ...applyShadow(5),
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.base,
    padding: spacing.base,
  },
  levelText: {
    color: colors.text.primary,
  },
});

/**
 * Example 6: Button with pressed state shadow
 * 
 * Reduce shadow when button is pressed for tactile feedback.
 */
export function ShadowButton() {
  const [isPressed, setIsPressed] = React.useState(false);

  const buttonStyles = StyleSheet.create({
    button: {
      ...(isPressed ? applyShadow(1) : applyShadow(3)),
      backgroundColor: colors.primary[500],
      borderRadius: borderRadius.base,
      padding: spacing.base,
      alignItems: 'center',
    },
    buttonText: {
      color: colors.text.inverse,
      fontWeight: 'bold',
    },
  });

  return (
    <View
      style={buttonStyles.button}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      <Text style={buttonStyles.buttonText}>Press Me</Text>
    </View>
  );
}
