import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getAllQuizSubmissions, updateSubmissionScore } from '@/services/supabase/admin';

export default function AdminQualificationsScreen() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [newScore, setNewScore] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllQuizSubmissions();
      setSubmissions(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo cargar las calificaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEditScore = (sub: any) => {
    setSelectedSubmission(sub);
    setNewScore(sub.score !== null ? sub.score.toString() : '');
  };

  const saveScore = async () => {
    if (!selectedSubmission) return;
    const scoreNum = parseInt(newScore, 10);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      Alert.alert('Error', 'Por favor ingresa un puntaje válido entre 0 y 100');
      return;
    }

    try {
      await updateSubmissionScore(selectedSubmission.id, scoreNum);
      setSelectedSubmission(null);
      loadData();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo actualizar el puntaje');
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.studentName}>{item.students?.full_name || 'Desconocido'}</Text>
        <Text style={styles.quizTitle}>Quiz: {item.quizzes?.title}</Text>
        <Text style={styles.className}>Clase: {item.quizzes?.classes?.name}</Text>
        <Text style={styles.date}>Fecha: {new Date(item.submitted_at).toLocaleDateString()}</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>{item.score !== null ? `${item.score}%` : 'N/A'}</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEditScore(item)}>
          <Ionicons name="pencil" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calificaciones</Text>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#333" />
      ) : (
        <FlatList
          data={submissions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay entregas para mostrar.</Text>}
        />
      )}

      {/* Edit Score Modal */}
      {selectedSubmission && (
        <Modal transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Puntaje</Text>
              <Text style={styles.modalSubtitle}>
                Estudiante: {selectedSubmission.students?.full_name}
              </Text>
              <TextInput
                style={styles.input}
                value={newScore}
                onChangeText={setNewScore}
                keyboardType="numeric"
                placeholder="0 - 100"
              />
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setSelectedSubmission(null)}>
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={saveScore}>
                  <Text style={styles.saveBtnText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, backgroundColor: '#333' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  loader: { flex: 1, justifyContent: 'center' },
  list: { padding: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
  },
  cardInfo: { flex: 1 },
  studentName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  quizTitle: { fontSize: 14, color: '#444' },
  className: { fontSize: 12, color: '#666' },
  date: { fontSize: 12, color: '#999', marginTop: 4 },
  scoreContainer: { alignItems: 'center' },
  scoreText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  editButton: { backgroundColor: '#3498db', padding: 8, borderRadius: 20 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 8, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 16, marginBottom: 20, textAlign: 'center' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelBtn: { padding: 10 },
  cancelBtnText: { color: '#666', fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#333', padding: 10, borderRadius: 8 },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
});
