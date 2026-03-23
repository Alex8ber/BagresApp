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
    SafeAreaView
} from 'react-native';

export default function StudentRegisterScreen({ navigation }) {
    const [fullName, setFullName] = useState('');
    const [classCode, setClassCode] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const handleRegister = () => {
        const newErrors = {};
        if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!classCode.trim()) newErrors.classCode = 'Class Code is required';
        if (!password.trim()) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        // Proceed with register
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, width: '100%' }}
            >
                <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.formHeader}>
                        <Text style={styles.roleEmoji}>👨‍🎓</Text>
                        <Text style={styles.headerTitle}>Student Register</Text>
                        <Text style={styles.headerSubtitle}>Create an account to join a class</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <TextInput
                            style={[styles.input, errors.fullName && styles.inputError]}
                            placeholder="e.g. John Doe"
                            placeholderTextColor="#A0AEC0"
                            value={fullName}
                            onChangeText={(text) => {
                                setFullName(text);
                                if (errors.fullName) setErrors({ ...errors, fullName: null });
                            }}
                            autoCapitalize="words"
                        />
                        {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Class Code</Text>
                        <TextInput
                            style={[styles.input, errors.classCode && styles.inputError]}
                            placeholder="6 characters (e.g. AB12CD)"
                            placeholderTextColor="#A0AEC0"
                            value={classCode}
                            onChangeText={(text) => {
                                setClassCode(text);
                                if (errors.classCode) setErrors({ ...errors, classCode: null });
                            }}
                            maxLength={6}
                            autoCapitalize="characters"
                        />
                        {errors.classCode ? <Text style={styles.errorText}>{errors.classCode}</Text> : null}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <TextInput
                            style={[styles.input, errors.password && styles.inputError]}
                            placeholder="Create a password"
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
                        style={styles.primaryButton}
                        activeOpacity={0.8}
                        onPress={handleRegister}
                    >
                        <Text style={styles.primaryButtonText}>Register</Text>
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
        backgroundColor: '#38A169',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#38A169',
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
