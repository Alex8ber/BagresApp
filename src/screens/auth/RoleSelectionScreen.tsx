/**
 * RoleSelectionScreen
 * 
 * Initial screen where users select their role (Teacher or Student).
 * Provides navigation to respective login and registration screens.
 * 
 * Requirements: 1.9, 2.1, 2.2, 5.2, 11.1
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
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
          <View style={styles.titleContainer}>
            <Text style={styles.titleEmoji}>🐟</Text>
            <Text style={styles.title}>Bagres</Text>
            <Text style={styles.titleAccent}>App</Text>
          </View>
          <Text style={styles.subtitle}>Choose your role to get started</Text>
        </View>

        {/* Role Cards */}
        <View style={styles.rolesContainer}>
          {/* Teacher Card */}
          <View style={[styles.roleCard, styles.teacherCard]}>
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>👨‍🏫</Text>
            </View>
            <Text style={styles.roleTitle}>Teacher</Text>
            
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.loginButton, styles.teacherLoginButton]}
                onPress={() => navigation.navigate('TeacherLogin')}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.registerButton, styles.teacherRegisterButton]}
                onPress={() => navigation.navigate('TeacherRegister')}
                activeOpacity={0.8}
              >
                <Text style={[styles.registerButtonText, styles.teacherRegisterText]}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Student Card */}
          <View style={[styles.roleCard, styles.studentCard]}>
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>👨‍🎓</Text>
            </View>
            <Text style={styles.roleTitle}>Student</Text>
            
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.loginButton, styles.studentLoginButton]}
                onPress={() => navigation.navigate('StudentLogin')}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.registerButton, styles.studentRegisterButton]}
                onPress={() => navigation.navigate('StudentRegister')}
                activeOpacity={0.8}
              >
                <Text style={[styles.registerButtonText, styles.studentRegisterText]}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    backgroundColor: '#F5F7FA',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  header: {
    alignItems: 'center',
    marginBottom: 48,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  titleEmoji: {
    fontSize: 42,
    marginRight: 8,
  },

  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#2C3E50',
    letterSpacing: -1,
  },

  titleAccent: {
    fontSize: 42,
    fontWeight: '800',
    color: '#3498DB',
    letterSpacing: -1,
  },

  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    fontWeight: '500',
  },

  rolesContainer: {
    width: '100%',
    maxWidth: 420,
    gap: 20,
  },

  roleCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },

  teacherCard: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: theme.colors.teacher.main,
  },

  studentCard: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: theme.colors.student.main,
  },

  emojiContainer: {
    alignSelf: 'center',
    marginBottom: 16,
  },

  emoji: {
    fontSize: 64,
  },

  roleTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
  },

  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },

  button: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  loginButton: {
    backgroundColor: '#fff',
  },

  teacherLoginButton: {
    backgroundColor: theme.colors.teacher.main,
  },

  studentLoginButton: {
    backgroundColor: theme.colors.student.main,
  },

  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    shadowOpacity: 0,
    elevation: 0,
  },

  teacherRegisterButton: {
    borderColor: theme.colors.teacher.main,
  },

  studentRegisterButton: {
    borderColor: theme.colors.student.main,
  },

  registerButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },

  teacherRegisterText: {
    color: theme.colors.teacher.main,
  },

  studentRegisterText: {
    color: theme.colors.student.main,
  },
});
