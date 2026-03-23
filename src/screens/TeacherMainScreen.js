import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function TeacherMainScreen({ navigation }) {
    const fastAccessOptions = [
        { id: '1', title: 'Students List', icon: 'people', color: '#E8F0FE', iconColor: '#4285F4' },
        { id: '2', title: 'Create Test', icon: 'document-text', color: '#FCE8E6', iconColor: '#EA4335' },
        { id: '3', title: 'Create Class', icon: 'school', color: '#E6F4EA', iconColor: '#34A853' },
        { id: '4', title: 'Schedule', icon: 'calendar', color: '#FEF7E0', iconColor: '#FBBC04' },
        { id: '5', title: 'Reports', icon: 'bar-chart', color: '#F3E8FF', iconColor: '#9333EA' },
    ];

    const handlePress = (title) => {
        if (title === 'Students List') {
            navigation.navigate('TeacherStudentsList');
        } else if (title === 'Create Test') {
            navigation.navigate('TeacherCreateTest');
        } else if (title === 'Create Class') {
            navigation.navigate('TeacherCreateClass');
        } else if (title === 'Reports') {
            navigation.navigate('TeacherReports');
        } else if (title === 'Schedule') {
            navigation.navigate('TeacherSchedule');
        } else {
            console.log(`Navigating to ${title}`);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.greetingTitle}>Welcome, Teacher 👋</Text>
                    <Text style={styles.greetingSubtitle}>Here's your quick access dashboard</Text>
                </View>

                <View style={styles.quickAccessContainer}>
                    <Text style={styles.sectionTitle}>Fast Access</Text>
                    <View style={styles.gridContainer}>
                        {fastAccessOptions.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.gridItem, { backgroundColor: item.color }]}
                                onPress={() => handlePress(item.title)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: 'white' }]}>
                                    <Ionicons name={item.icon} size={32} color={item.iconColor} />
                                </View>
                                <Text style={[styles.itemTitle, { color: '#2D3748' }]}>{item.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FAFBFD' },
    container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
    headerContainer: { marginBottom: 30, marginTop: 20 },
    greetingTitle: { fontSize: 28, fontWeight: '800', color: '#2D3748', marginBottom: 8 },
    greetingSubtitle: { fontSize: 16, color: '#718096', fontWeight: '500' },
    quickAccessContainer: { flex: 1 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: '#4A5568', marginBottom: 20 },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    gridItem: {
        width: (width - 60) / 2, // 2 items per row, 20 padding each side + 20 gap
        aspectRatio: 1,
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    itemTitle: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
});
