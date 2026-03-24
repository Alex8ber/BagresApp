/**
 * TeacherClassesScreen
 * 
 * Displays a list of classes for the authenticated teacher.
 * Uses useTeacherClasses hook to fetch and manage classes data.
 * 
 * Requirements: 1.9, 2.1, 5.2, 5.9, 10.6, 10.14, 11.1, 11.9
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
import type { TeacherTabScreenProps } from '@/types/navigation';
import { useTeacherClasses } from '@/hooks';
import { Card, Button } from '@/components/shared';
import { theme } from '@/styles';
import type { Class } from '@/types/database';

type Props = TeacherTabScreenProps<'Classes'>;

/**
 * TeacherClassesScreen Component
 * 
 * Displays teacher's classes with loading and error states.
 */
export default function TeacherClassesScreen(_props: Props) {
  const { classes, loading, error, refetch } = useTeacherClasses();

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          <Text style={styles.loadingText}>Loading classes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Button onPress={refetch} style={styles.retryButton}>
            Retry
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  if (classes.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyTitle}>No Classes Yet</Text>
          <Text style={styles.emptySubtitle}>Create your first class to get started</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderClassItem = ({ item }: { item: Class }) => (
    <Card style={styles.classCard} variant="elevated">
      <Text style={styles.className}>{item.name}</Text>
      <Text style={styles.classSubject}>{item.subject}</Text>
      <Text style={styles.classGrade}>Grade: {item.grade}</Text>
      {item.description && (
        <Text style={styles.classDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>My Classes</Text>
          <Text style={styles.subtitle}>{classes.length} class{classes.length !== 1 ? 'es' : ''}</Text>
        </View>

        <FlatList
          data={classes}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  headerContainer: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: theme.fontWeight.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text.secondary,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.base,
    color: theme.colors.text.secondary,
  },
  errorText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.error.main,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    marginTop: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: theme.fontWeight.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  emptySubtitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  classCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  className: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  classSubject: {
    fontSize: theme.fontSize.base,
    color: theme.colors.primary[500],
    marginBottom: theme.spacing.xs,
  },
  classGrade: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  classDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
});
