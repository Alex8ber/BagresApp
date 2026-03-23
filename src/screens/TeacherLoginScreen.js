import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    SafeAreaView,
    Alert
} from 'react-native';

export default function TeacherLoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const handleLogin = () => {
        const newErrors = {};
        if (!email.trim()) newErrors.email = 'Email Address is required';
        if (!password.trim()) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        // Proceed with login
        navigation.navigate('TeacherDashboard');
    };

    const handleForgotPassword = () => {
        // Handle forgot password logic
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, width: '100%' }}
            >
                <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.formHeader}>
                        <Text style={styles.roleEmoji}>👨‍🏫</Text>
                        <Text style={styles.headerTitle}>Welcome back</Text>
                        <Text style={styles.headerSubtitle}>Enter your details to manage your classes</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email Address</Text>
                        <TextInput
                            style={[styles.input, errors.email && styles.inputError]}
                            placeholder="e.g. teacher@school.edu"
                            placeholderTextColor="#A0AEC0"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (errors.email) setErrors({ ...errors, email: null });
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <TextInput
                            style={[styles.input, errors.password && styles.inputError]}
                            placeholder="Enter your password"
                            placeholderTextColor="#A0AEC0"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (errors.password) setErrors({ ...errors, password: null });
                            }}
                            secureTextEntry
                        />
                        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                    </View>

                    <TouchableOpacity
                        style={styles.forgotPasswordButton}
                        onPress={handleForgotPassword}
                    >
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.primaryButton}
                        activeOpacity={0.8}
                        onPress={handleLogin}
                    >
                        <Text style={styles.primaryButtonText}>Login</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FAFBFD',
    },
    formContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
    formHeader: {
        alignItems: 'center',
        marginBottom: 40,
    },
    roleEmoji: {
        fontSize: 40,
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#2D3748',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#718096',
        marginTop: 8,
        textAlign: 'center',
        fontWeight: '500',
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginTop: -10,
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: '#4299E1',
        fontSize: 14,
        fontWeight: '600',
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A5568',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        color: '#2D3748',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    inputError: {
        borderColor: '#E53E3E',
        borderWidth: 1.5,
    },
    errorText: {
        color: '#E53E3E',
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
        fontWeight: '500',
    },
    primaryButton: {
        backgroundColor: '#4299E1', // A distinct blue for teachers
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#4299E1',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
