import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data: Students list
const initialStudents = [
    { id: '1', name: 'Alice Smith', grade: '10th' },
    { id: '2', name: 'Bob Johnson', grade: '10th' },
    { id: '3', name: 'Charlie Brown', grade: '10th' },
    { id: '4', name: 'Diana Prince', grade: '10th' },
    { id: '5', name: 'Evan Peters', grade: '10th' },
    { id: '6', name: 'Fiona Gallagher', grade: '10th' },
    { id: '7', name: 'George Michael', grade: '10th' },
    { id: '8', name: 'Hannah Abbott', grade: '10th' },
    { id: '9', name: 'Ian Somerhalder', grade: '10th' },
    { id: '10', name: 'Julia Roberts', grade: '10th' },
];

export default function TeacherStudentsListScreen() {
    const [searchQuery, setSearchQuery] = useState('');

    // Sort students alphabetically and filter by search query
    const filteredStudents = useMemo(() => {
        return initialStudents
            .filter(student => student.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [searchQuery]);

    const handleDownloadAll = () => {
        // Mock download all functionality
        console.log('Downloading all qualifications PDF...');
        alert('Downloading general class qualifications...');
    };

    const handleDownloadStudent = (studentName) => {
        // Mock download specific student functionality
        console.log(`Downloading qualifications for ${studentName}...`);
        alert(`Downloading qualifications for ${studentName}...`);
    };

    const renderStudentItem = ({ item }) => (
        <View style={styles.studentItem}>
            <View style={styles.studentInfo}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                </View>
                <View>
                    <Text style={styles.studentName}>{item.name}</Text>
                    <Text style={styles.studentGrade}>Grade: {item.grade}</Text>
                </View>
            </View>
            <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => handleDownloadStudent(item.name)}
            >
                <Ionicons name="download-outline" size={24} color="#4A5568" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* General Actions */}
                <View style={styles.generalActionsContainer}>
                    <TouchableOpacity style={styles.mainActionButton} onPress={handleDownloadAll}>
                        <Ionicons name="document-text" size={20} color="white" style={styles.buttonIcon} />
                        <Text style={styles.mainActionButtonText}>Download Class Qualifications</Text>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#A0AEC0" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search students..."
                        placeholderTextColor="#A0AEC0"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color="#A0AEC0" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Students List */}
                <FlatList
                    data={filteredStudents}
                    keyExtractor={(item) => item.id}
                    renderItem={renderStudentItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No students found</Text>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FAFBFD' },
    container: { flex: 1, paddingHorizontal: 20, paddingTop: 100 }, // Ensure it starts below the transparent header
    generalActionsContainer: { marginBottom: 20 },
    mainActionButton: {
        backgroundColor: '#4285F4',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonIcon: { marginRight: 8 },
    mainActionButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 16, color: '#2D3748' },
    listContainer: { paddingBottom: 20 },
    studentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    studentInfo: { flexDirection: 'row', alignItems: 'center' },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E8F0FE',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    avatarText: { fontSize: 20, fontWeight: '700', color: '#4285F4' },
    studentName: { fontSize: 16, fontWeight: '600', color: '#2D3748', marginBottom: 4 },
    studentGrade: { fontSize: 14, color: '#718096' },
    downloadButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F7FAFC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: { alignItems: 'center', paddingVertical: 40 },
    emptyText: { fontSize: 16, color: '#A0AEC0', fontWeight: '500' },
});
