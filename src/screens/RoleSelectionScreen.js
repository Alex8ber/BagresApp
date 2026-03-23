import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

export default function RoleSelectionScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>BagresApp</Text>
                    <Text style={styles.headerSubtitle}>Choose your role to get started</Text>
                </View>

                {/* Roles Container */}
                <View style={styles.rolesContainer}>
                    <View style={[styles.roleCard, styles.teacherCard]}>
                        <Text style={styles.roleEmoji}>👨‍🏫</Text>
                        <Text style={styles.roleTitle}>Teacher</Text>
                        <View style={styles.actionRow}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.teacherButton]}
                                onPress={() => navigation.navigate('TeacherLogin')}
                            >
                                <Text style={styles.teacherButtonText}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.teacherButtonOutline]}
                                onPress={() => navigation.navigate('TeacherRegister')}
                            >
                                <Text style={styles.teacherButtonTextOutline}>Register</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.roleCard, styles.studentCard]}>
                        <Text style={styles.roleEmoji}>👨‍🎓</Text>
                        <Text style={styles.roleTitle}>Student</Text>
                        <View style={styles.actionRow}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.studentButton]}
                                onPress={() => navigation.navigate('StudentLogin')}
                            >
                                <Text style={styles.studentButtonText}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.studentButtonOutline]}
                                onPress={() => navigation.navigate('StudentRegister')}
                            >
                                <Text style={styles.studentButtonTextOutline}>Register</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 50,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    headerTitle: {
        fontSize: 42,
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
    rolesContainer: {
        width: '100%',
        flexDirection: 'column', // Changed to column to stack the larger cards
        alignItems: 'center',
    },
    roleCard: {
        width: width * 0.8, // Make it wider to fit two buttons comfortably
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    teacherCard: {
        backgroundColor: '#E8F0FE',
        borderWidth: 1,
        borderColor: '#D2E3FC',
    },
    studentCard: {
        backgroundColor: '#E6F4EA',
        borderWidth: 1,
        borderColor: '#CEEAD6',
    },
    roleEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    roleTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2D3748',
        marginBottom: 20,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 6,
    },
    teacherButton: {
        backgroundColor: '#4299E1',
    },
    teacherButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    teacherButtonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#4299E1',
    },
    teacherButtonTextOutline: {
        color: '#4299E1',
        fontWeight: '700',
        fontSize: 14,
    },
    studentButton: {
        backgroundColor: '#38A169',
    },
    studentButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    studentButtonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#38A169',
    },
    studentButtonTextOutline: {
        color: '#38A169',
        fontWeight: '700',
        fontSize: 14,
    },
});
