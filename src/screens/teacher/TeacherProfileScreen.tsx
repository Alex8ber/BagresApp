/**
 * TeacherProfileScreen
 * 
 * Profile screen for teachers with user information and sign out functionality.
 * Uses useAuth hook to access profile data and authentication actions.
 * 
 * Requirements: 1.9, 2.1, 5.2, 5.9, 10.14, 11.1, 11.9
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import type { TeacherTabScreenProps } from '@/types/navigation';
import { useAuth } from '@/hooks';
import { Button, Card } from '@/components/shared';
import { theme } from '@/styles';
import type { Teacher } from '@/types/database';

type Props = TeacherTabScreenProps<'Profile'>;

/**
 * TeacherProfileScreen Component
 * 
 * Displays teacher profile information and provides sign out functionality.
 */
export default function TeacherProfileScreen(_props: Props) {
  const { user, profile, signOut, loading } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const teacherProfile = profile as Teacher | null;

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setSigningOut(true);
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
              setSigningOut(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user || !teacherProfile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>No profile data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <Card style={styles.profileCard} variant="elevated">
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {teacherProfile.full_name.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{teacherProfile.full_name}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{teacherProfile.email}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>School</Text>
            <Text style={styles.value}>{teacherProfile.school}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: teacherProfile.verified ? theme.colors.success.main : theme.colors.warning.main },
                ]}
              />
              <Text style={styles.value}>
                {teacherProfile.verified ? 'Verified' : 'Pending Verification'}
              </Text>
            </View>
          </View>
        </Card>

        <Button
          onPress={handleSignOut}
          variant="outline"
          style={styles.signOutButton}
          disabled={signingOut}
          loading={signingOut}
        >
          Sign Out
        </Button>
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
  },
  profileCard: {
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: theme.fontWeight.bold as any,
    color: theme.colors.background.primary,
  },
  infoSection: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.fontWeight.medium as any,
  },
  value: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text.primary,
    fontWeight: theme.fontWeight.medium as any,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.xs,
  },
  signOutButton: {
    marginTop: theme.spacing.md,
  },
});
