import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getAllQuizSubmissions, updateSubmissionScore, getAllClasses, getAllQuizzes } from '@/services/supabase/admin';
import * as Clipboard from 'expo-clipboard';

export default function AdminQualificationsScreen() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [newScore, setNewScore] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterQuiz, setFilterQuiz] = useState('');
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportCsvText, setExportCsvText] = useState('');

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

      <View style={{padding:12, backgroundColor:'#fff', flexDirection:'row', gap:8}}>
        <TextInput placeholder="Filtrar por class_id" value={filterClass} onChangeText={setFilterClass} style={styles.filterInput} />
        <TextInput placeholder="Filtrar por quiz_id" value={filterQuiz} onChangeText={setFilterQuiz} style={styles.filterInput} />
        <TouchableOpacity style={styles.exportBtn} onPress={async () => {
          const filtered = submissions.filter(s => {
            if (filterClass && s.quizzes?.class_id !== filterClass) return false;
            if (filterQuiz && s.quiz_id !== filterQuiz) return false;
            return true;
          });
          const csv = await generateCSV(filtered);
          setExportCsvText(csv);
          try {
            await Clipboard.setStringAsync(csv);
            Alert.alert('CSV copiado', 'El CSV ha sido copiado al portapapeles.');
          } catch (_) {
            setExportModalVisible(true);
          }
        }}><Text style={{color:'#fff'}}>Exportar CSV</Text></TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#333" />
      ) : (
        <FlatList
          data={submissions.filter(s => {
            if (filterClass && s.quizzes?.class_id !== filterClass) return false;
            if (filterQuiz && s.quiz_id !== filterQuiz) return false;
            return true;
          })}
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

      <Modal transparent visible={exportModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>CSV generado</Text>
            <TextInput value={exportCsvText} multiline style={{height:200, borderWidth:1, borderColor:'#eee', padding:8}} />
            <View style={{flexDirection:'row', justifyContent:'flex-end', marginTop:12}}>
              <TouchableOpacity style={{padding:10}} onPress={()=>setExportModalVisible(false)}><Text style={{color:'#666'}}>Cerrar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

async function generateCSV(rows: any[]) {
  const header = ['submission_id','student','quiz','class','score','submitted_at'];
  const lines = rows.map(r => [r.id, r.students?.full_name || '', r.quizzes?.title || '', r.quizzes?.classes?.name || '', r.score ?? '', r.submitted_at || ''].map(v => `"${String(v).replace(/"/g,'""')}"`).join(','));
  return [header.join(','), ...lines].join('\n');
}

async function exportCSV() {
  // placeholder, actual function is bound in component to access current filtered rows
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, backgroundColor: '#333' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  loader: { flex: 1, justifyContent: 'center' },
  filterInput: { flex:1, backgroundColor:'#fff', padding:8, borderRadius:8, borderWidth:1, borderColor:'#eee' },
  exportBtn: { backgroundColor:'#333', padding:10, borderRadius:8 },
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
