import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TeacherReportsScreen({ navigation }) {
    const [students, setStudents] = useState([
        { id: '1', name: 'Alice Smith', autoScore: '85', manualScore: '', useAuto: true, submitted: true },
        { id: '2', name: 'Bob Jones', autoScore: '70', manualScore: '75', useAuto: false, submitted: true },
        { id: '3', name: 'Charlie Brown', autoScore: '92', manualScore: '', useAuto: true, submitted: true },
        { id: '4', name: 'Diana Prince', autoScore: '-', manualScore: '', useAuto: false, submitted: false },
        { id: '5', name: 'Evan Wright', autoScore: '60', manualScore: '65', useAuto: false, submitted: true },
    ]);

    const toggleScoreType = (id) => {
        setStudents(currentStudents =>
            currentStudents.map(student =>
                student.id === id ? { ...student, useAuto: !student.useAuto } : student
            )
        );
    };

    const updateManualScore = (id, score) => {
        setStudents(currentStudents =>
            currentStudents.map(student =>
                student.id === id ? { ...student, manualScore: score } : student
            )
        );
    };

    const renderStudentMenu = ({ item }) => {
        const finalScore = item.useAuto ? item.autoScore : (item.manualScore || '-');
        
        return (
            <View style={styles.cardContainer}>
                <View style={styles.cardHeader}>
                    <View style={styles.profileIcon}>
                        <Text style={styles.profileInitials}>{item.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.cardHeaderText}>
                        <Text style={styles.studentName}>{item.name}</Text>
                        <Text style={[styles.statusText, { color: item.submitted ? '#34A853' : '#EA4335' }]}>
                            {item.submitted ? 'Test Submitted' : 'Pending'}
                        </Text>
                    </View>
                    <View style={styles.finalScoreBadge}>
                        <Text style={styles.finalScoreText}>{finalScore}</Text>
                        <Text style={styles.finalScoreLabel}>Pts</Text>
                    </View>
                </View>

                {item.submitted && (
                    <View style={styles.qualificationSection}>
                        <View style={styles.toggleRow}>
                            <Text style={styles.toggleLabel}>Use Auto Qualification</Text>
                            <Switch
                                trackColor={{ false: '#CBD5E0', true: '#4285F4' }}
                                thumbColor={'#fff'}
                                onValueChange={() => toggleScoreType(item.id)}
                                value={item.useAuto}
                            />
                        </View>

                        <View style={styles.scoreRow}>
                            <View style={styles.scoreBox}>
                                <Text style={styles.scoreTitle}>Auto Score</Text>
                                <Text style={styles.autoScoreValue}>{item.autoScore}</Text>
                            </View>
                            
                            <View style={[styles.scoreBox, !item.useAuto && styles.activeScoreBox]}>
                                <Text style={styles.scoreTitle}>Manual Score</Text>
                                <TextInput
                                    style={[styles.manualInput, item.useAuto && styles.disabledInput]}
                                    value={item.manualScore}
                                    onChangeText={(text) => updateManualScore(item.id, text)}
                                    keyboardType="numeric"
                                    placeholder="0"
                                    placeholderTextColor="#A0AEC0"
                                    editable={!item.useAuto}
                                />
                            </View>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#2D3748" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Test Reports</Text>
                <View style={styles.placeholderIcon} />
            </View>

            <View style={styles.infoBanner}>
                <Ionicons name="information-circle-outline" size={24} color="#4285F4" />
                <Text style={styles.bannerText}>
                    Review auto-calculated scores or enter manual qualifications for your class.
                </Text>
            </View>

            <FlatList
                data={students}
                keyExtractor={(item) => item.id}
                renderItem={renderStudentMenu}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FAFBFD' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backButton: { padding: 8, marginLeft: -8 },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#2D3748' },
    placeholderIcon: { width: 40 },
    infoBanner: {
        flexDirection: 'row',
        backgroundColor: '#E8F0FE',
        padding: 16,
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    bannerText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        color: '#1A73E8',
        fontWeight: '500',
        lineHeight: 20,
    },
    listContainer: { padding: 20, paddingBottom: 40 },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F3E8FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileInitials: { color: '#9333EA', fontSize: 18, fontWeight: '700' },
    cardHeaderText: { flex: 1, marginLeft: 16 },
    studentName: { fontSize: 18, fontWeight: '700', color: '#2D3748', marginBottom: 4 },
    statusText: { fontSize: 13, fontWeight: '600' },
    finalScoreBadge: {
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    finalScoreText: { fontSize: 18, fontWeight: '800', color: '#2D3748' },
    finalScoreLabel: { fontSize: 12, color: '#718096', fontWeight: '500', marginTop: 2 },
    qualificationSection: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#EDF2F7',
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    toggleLabel: { fontSize: 15, fontWeight: '600', color: '#4A5568' },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    scoreBox: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    activeScoreBox: {
        backgroundColor: '#E6F4EA',
        borderColor: '#34A853',
        borderWidth: 1,
    },
    scoreTitle: { fontSize: 13, color: '#718096', fontWeight: '600', marginBottom: 8 },
    autoScoreValue: { fontSize: 24, fontWeight: '700', color: '#2D3748' },
    manualInput: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2D3748',
        backgroundColor: '#fff',
        width: 80,
        textAlign: 'center',
        borderRadius: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#CBD5E0',
    },
    disabledInput: { backgroundColor: '#EDF2F7', color: '#A0AEC0' },
});
