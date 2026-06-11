import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import type { RootStackScreenProps } from '@/navigation/types';

type Props = RootStackScreenProps<'AdminLogin'>;

export default function AdminLoginScreen({ navigation }: Props) {
  const { signIn, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      Alert.alert('Campos requeridos', 'Por favor ingresa el nombre de usuario y la contraseña.');
      return;
    }

    try {
      await signIn(username.trim(), password, 'admin');
    } catch (error: any) {
      Alert.alert(
        'Acceso denegado',
        error.message || 'No se pudo iniciar sesión como administrador. Verifica las credenciales.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={48} color="#fff" />
            </View>
            <Text style={styles.title}>Acceso Administrador</Text>
            <Text style={styles.subtitle}>Panel de Control · BagresApp</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Iniciar Sesión</Text>
            <Text style={styles.cardSubtitle}>
              Ingresa tus credenciales de administrador
            </Text>

            {/* Username Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nombre de usuario</Text>
              <View style={styles.inputRow}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color="#6B7280"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Ej: admin"
                  placeholderTextColor="#9CA3AF"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputRow}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#6B7280"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.inputFlex]}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(prev => !prev)}
                  style={styles.eyeButton}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="log-in-outline" size={20} color="#fff" style={styles.btnIcon} />
                  <Text style={styles.loginButtonText}>Ingresar al Panel</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Security Note */}
            <View style={styles.securityNote}>
              <Ionicons name="information-circle-outline" size={14} color="#9CA3AF" />
              <Text style={styles.securityNoteText}>
                Acceso restringido. Las credenciales se almacenan de forma segura.
              </Text>
            </View>
          </View>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back-outline" size={18} color="#6B7280" />
            <Text style={styles.backButtonText}>Volver a selección de rol</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const ADMIN_DARK = '#1A1D23';
const ADMIN_ACCENT = '#4F46E5'; // Indigo

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: ADMIN_DARK,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  // ── Header ──────────────────────────────────────────────────
  header: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    backgroundColor: ADMIN_DARK,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: ADMIN_ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: ADMIN_ACCENT,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // ── Card ────────────────────────────────────────────────────
  card: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 28,
  },

  // ── Fields ──────────────────────────────────────────────────
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  inputFlex: {
    flex: 1,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },

  // ── Login Button ─────────────────────────────────────────────
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ADMIN_ACCENT,
    borderRadius: 12,
    height: 54,
    marginTop: 8,
    shadowColor: ADMIN_ACCENT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  btnIcon: {
    marginRight: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // ── Security Note ────────────────────────────────────────────
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    gap: 6,
  },
  securityNoteText: {
    flex: 1,
    fontSize: 11,
    color: '#9CA3AF',
    lineHeight: 16,
  },

  // ── Back Button ──────────────────────────────────────────────
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    paddingVertical: 12,
    gap: 6,
  },
  backButtonText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
