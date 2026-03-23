import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView
} from 'react-native';

export default function TeacherVerificationScreen({ route, navigation }) {
    const [code, setCode] = useState('');
    // We'll safely get the email from the route parameters, or use a fallback for testing
    const email = route?.params?.email || 'teacher@school.edu';

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, width: '100%' }}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.icon}>✉️</Text>
                        <Text style={styles.title}>Check your email</Text>
                        <Text style={styles.subtitle}>
                            We have sent a verification email to
                            <Text style={styles.emailText}> {email}</Text>.{'\n'}
                            Please enter the 6-character code below.
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.codeInput}
                            placeholder="000000"
                            placeholderTextColor="#CBD5E0"
                            value={code}
                            onChangeText={setCode}
                            maxLength={6}
                            keyboardType="number-pad"
                            autoFocus={true}
                        />
                    </View>

                    <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
                        <Text style={styles.primaryButtonText}>Verify & Continue</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.6}>
                        <Text style={styles.secondaryButtonText}>Resend Code</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FAFBFD',
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    icon: {
        fontSize: 48,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#2D3748',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#718096',
        textAlign: 'center',
        lineHeight: 24,
    },
    emailText: {
        fontWeight: '700',
        color: '#4A5568',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 32,
        alignItems: 'center',
    },
    codeInput: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        paddingHorizontal: 24,
        paddingVertical: 18,
        fontSize: 32,
        fontWeight: '700',
        color: '#2D3748',
        textAlign: 'center',
        letterSpacing: 8,
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    primaryButton: {
        backgroundColor: '#4299E1', // Teacher Blue
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        width: '100%',
        marginBottom: 16,
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
    secondaryButton: {
        paddingVertical: 12,
    },
    secondaryButtonText: {
        color: '#4299E1',
        fontSize: 16,
        fontWeight: '600',
    },
});
