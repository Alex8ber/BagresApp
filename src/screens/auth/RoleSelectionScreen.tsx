/**
 * RoleSelectionScreen
 * 
 * Initial screen where users select their role (Teacher or Student).
 * Provides navigation to respective login and registration screens.
 * 
 * Requirements: 1.9, 2.1, 2.2, 5.2, 11.1
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { RoleCard } from '@/components/screens/RoleSelection';
import { theme } from '@/styles/theme';
import type { RootStackScreenProps } from '@/types/navigation';

// ============================================================================
// Types
// ============================================================================

type Props = RootStackScreenProps<'RoleSelection'>;

// ============================================================================
// Component
// ============================================================================

export default function RoleSelectionScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>BagresApp</Text>
          <Text style={styles.subtitle}>Choose your role to get started</Text>
        </View>

        {/* Role Cards */}
        <View style={styles.rolesContainer}>
          <RoleCard
            role="teacher"
            emoji="👨‍🏫"
            title="Teacher"
            onLogin={() => navigation.navigate('TeacherLogin')}
            onRegister={() => navigation.navigate('TeacherRegister')}
          />
          
          <RoleCard
            role="student"
            emoji="👨‍🎓"
            title="Student"
            onLogin={() => navigation.navigate('StudentLogin')}
            onRegister={() => navigation.navigate('StudentRegister')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 50,
  },

  header: {
    alignItems: 'center',
    marginBottom: 60,
  },

  title: {
    fontSize: 48,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },

  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  rolesContainer: {
    width: '100%',
    maxWidth: 400,
  },
});
