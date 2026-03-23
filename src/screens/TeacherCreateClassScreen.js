import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TeacherContext } from '../context/TeacherContext';

export default function TeacherCreateClassScreen({ navigation }) {
  const { classes, addClass } = useContext(TeacherContext);
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');

  // Function to generate a random 6-character alphanumeric code
  const generateClassCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateClass = () => {
    if (!className.trim()) {
      Alert.alert('Missing Field', 'Please provide a Class Name.');
      return;
    }

    const newCode = generateClassCode();
    const newClass = {
        id: Date.now().toString(),
        name: className.trim(),
        description: description.trim(),
        code: newCode,
        createdAt: new Date().toISOString()
    };

    addClass(newClass);

    Alert.alert(
      'Class Created Successfully!',
      `Your class code is:\n\n${newCode}\n\nShare this code with your students.`,
      [{ text: 'OK' }]
    );

    // Reset form
    setClassName('');
    setDescription('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#2D3748" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create a New Class</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Class Details</Text>

            <Text style={styles.label}>Class Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mathematics 101"
              placeholderTextColor="#A0AEC0"
              value={className}
              onChangeText={setClassName}
            />

            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g. Advanced algebra and calculus"
              placeholderTextColor="#A0AEC0"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity style={styles.createBtn} onPress={handleCreateClass}>
              <Ionicons name="school-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.createBtnText}>Generate Class Code</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>
            Created Classes ({classes.length})
          </Text>

          {classes.length === 0 ? (
              <Text style={styles.emptyText}>You haven't created any classes yet.</Text>
          ) : (
            classes.map((cls) => (
                <View key={cls.id} style={styles.classCard}>
                    <View style={styles.classHeader}>
                        <Text style={styles.classNameText}>{cls.name}</Text>
                        <View style={styles.codeBadge}>
                            <Text style={styles.codeText}>{cls.code}</Text>
                        </View>
                    </View>
                    {cls.description ? <Text style={styles.classDescText}>{cls.description}</Text> : null}
                </View>
            ))
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    backgroundColor: '#FAFBFD',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#2D3748' },
  content: { flex: 1, paddingHorizontal: 20 },
  
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#2D3748', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#4A5568', marginBottom: 8 },
  input: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#2D3748',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  createBtn: {
    backgroundColor: '#4285F4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  createBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#4A5568', marginTop: 10, marginBottom: 15 },
  emptyText: { color: '#A0AEC0', fontSize: 15, textAlign: 'center', marginTop: 20, fontStyle: 'italic' },

  classCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#34A853',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  classNameText: { fontSize: 18, fontWeight: '700', color: '#2D3748', flex: 1, marginRight: 10 },
  codeBadge: {
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  codeText: {
      color: '#0D652D',
      fontWeight: '800',
      fontSize: 16,
      letterSpacing: 1,
  },
  classDescText: { fontSize: 14, color: '#718096' },
});
