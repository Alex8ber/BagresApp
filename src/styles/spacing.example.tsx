/**
 * Spacing Utilities - Example Usage
 * 
 * This file demonstrates how to use the spacing utilities in real components.
 * These examples show common patterns and best practices.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  applyMargin,
  applyPadding,
  applyGap,
  marginBottom,
  paddingTop,
} from './spacing';
import { colors } from './theme';

// ============================================================================
// Example 1: Basic Card with Consistent Spacing
// ============================================================================

export function BasicCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Card Title</Text>
      <Text style={styles.cardDescription}>
        This card uses consistent spacing from the spacing scale.
      </Text>
    </View>
  );
}

// ============================================================================
// Example 2: Form Layout with Vertical Spacing
// ============================================================================

export function FormExample() {
  return (
    <View style={styles.form}>
      <Text style={styles.formLabel}>Email</Text>
      <View style={styles.input} />
      
      <Text style={styles.formLabel}>Password</Text>
      <View style={styles.input} />
      
      <View style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </View>
    </View>
  );
}

// ============================================================================
// Example 3: Grid Layout with Gap
// ============================================================================

export function GridExample() {
  return (
    <View style={styles.grid}>
      <View style={styles.gridItem}>
        <Text>Item 1</Text>
      </View>
      <View style={styles.gridItem}>
        <Text>Item 2</Text>
      </View>
      <View style={styles.gridItem}>
        <Text>Item 3</Text>
      </View>
      <View style={styles.gridItem}>
        <Text>Item 4</Text>
      </View>
    </View>
  );
}

// ============================================================================
// Example 4: List with Separators
// ============================================================================

export function ListExample() {
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  
  return (
    <View style={styles.list}>
      {items.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text>{item}</Text>
        </View>
      ))}
    </View>
  );
}

// ============================================================================
// Example 5: Complex Layout with Mixed Spacing
// ============================================================================

export function ComplexLayoutExample() {
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome back!</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Classes</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <Text>Activity item 1</Text>
        </View>
        <View style={styles.activityCard}>
          <Text>Activity item 2</Text>
        </View>
      </View>
    </ScrollView>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  // Example 1: Basic Card
  card: {
    ...applyPadding('base'),
    ...applyMargin({ bottom: 'md' }),
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  cardTitle: {
    ...marginBottom('sm'),
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  
  // Example 2: Form Layout
  form: {
    ...applyPadding('base'),
  },
  formLabel: {
    ...marginBottom('xs'),
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  input: {
    ...applyPadding({ vertical: 'sm', horizontal: 'md' }),
    ...marginBottom('base'),
    height: 44,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.main,
    borderRadius: 8,
  },
  button: {
    ...applyPadding({ vertical: 'md', horizontal: 'base' }),
    ...paddingTop('lg'),
    backgroundColor: colors.primary[500],
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  
  // Example 3: Grid Layout
  grid: {
    ...applyPadding('base'),
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...applyGap('md'),
  },
  gridItem: {
    ...applyPadding('base'),
    width: '48%',
    aspectRatio: 1,
    backgroundColor: colors.primary[100],
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Example 4: List
  list: {
    ...applyPadding({ vertical: 'sm', horizontal: 'base' }),
  },
  listItem: {
    ...applyPadding({ vertical: 'md', horizontal: 'base' }),
    ...marginBottom('xs'),
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  
  // Example 5: Complex Layout
  screen: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  header: {
    ...applyPadding({ vertical: 'xl', horizontal: 'base' }),
    backgroundColor: colors.primary[500],
  },
  headerTitle: {
    ...marginBottom('xs'),
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.inverse,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.primary[100],
  },
  section: {
    ...applyPadding('base'),
    ...marginBottom('lg'),
  },
  sectionTitle: {
    ...marginBottom('md'),
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    ...applyGap('md'),
  },
  statCard: {
    ...applyPadding('base'),
    flex: 1,
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    ...marginBottom('xs'),
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary[500],
  },
  statLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  activityCard: {
    ...applyPadding('base'),
    ...marginBottom('sm'),
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
});

// ============================================================================
// Export All Examples
// ============================================================================

export default {
  BasicCard,
  FormExample,
  GridExample,
  ListExample,
  ComplexLayoutExample,
};
