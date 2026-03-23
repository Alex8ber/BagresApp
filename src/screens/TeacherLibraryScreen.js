import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function TeacherLibraryScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Library Screen</Text>
                <Text style={styles.subtitle}>Coming soon!</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FAFBFD' },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 24, fontWeight: '700', color: '#2D3748', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#718096' },
});
