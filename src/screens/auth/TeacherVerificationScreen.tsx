/**
 * TeacherVerificationScreen
 * 
 * Email verification screen for teachers after registration.
 * Receives email parameter from navigation and validates verification code.
 * 
 * Requirements: 2.9, 5.9, 10.6, 10.7, 11.9
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { theme } from '@/styles/theme';
import type { RootStackScreenProps } from '@/types/navigation';

// ============================================================================
// Types
// ============================================================================

type Props = RootStackScreenProps<'TeacherVerification'>;

// ============================================================================
// Component
// ============================================================================

export default function TeacherVerificationScreen({ route, navigation }: Props) {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleVerify = async () => {
    if (!code.trim()) {
      setError('Verification code is required');
      return;
    }

    if (code.length !== 6) {
      setError('Verification code must be 6 characters');
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      // TODO: Implement verification API call
      // await verifyEmail(email, code);
      
      // Navigate to dashboard on success
      navigation.navigate('TeacherDashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError(undefined);

    try {
      // TODO: Implement resend code API call
      // await resendVerificationCode(email);
      
      // Show success message (could use a toast/alert)
      console.log('Verification code resent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.emoji}>✉️</Text>
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.subtitle}>
              We have sent a verification email to{' '}
              <Text style={styles.emailText}>{email}</Text>.{'\n'}
              Please enter the 6-character code below.
            </Text>
          </View>

          {/* Verification Code Input */}
          <View style={styles.inputContainer}>
            <Input
              placeholder="000000"
              value={code}
              onChangeText={(text) => {
                setCode(text);
                if (error) setError(undefined);
              }}
              error={error}
              maxLength={6}
              keyboardType="number-pad"
              autoFocus
              editable={!loading}
              inputStyle={styles.codeInput}
            />
          </View>

          {/* Verify Button */}
          <Button
            variant="primary"
            size="large"
            fullWidth
            onPress={handleVerify}
            loading={loading}
            style={[styles.verifyButton, { backgroundColor: theme.colors.teacher.main }]}
          >
            Verify & Continue
          </Button>

          {/* Resend Code Button */}
          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendCode}
            disabled={loading}
          >
            <Text style={styles.resendButtonText}>Resend Code</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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

  keyboardView: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 40,
    alignItems: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 40,
  },

  emoji: {
    fontSize: 48,
    marginBottom: theme.spacing.base,
  },

  title: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },

  subtitle: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  emailText: {
    ...theme.typography.subtitle1,
    color: theme.colors.text.primary,
  },

  inputContainer: {
    width: '100%',
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },

  codeInput: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 8,
  },

  verifyButton: {
    marginBottom: theme.spacing.base,
  },

  resendButton: {
    paddingVertical: theme.spacing.md,
  },

  resendButtonText: {
    ...theme.typography.subtitle2,
    color: theme.colors.teacher.main,
  },
});
