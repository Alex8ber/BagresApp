import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getAllTeachers, verifyTeacher, deleteTeacher, getAllStudents, deleteStudent, reassignStudentToClass } from '@/services/supabase/admin';

export default function AdminUsersScreen() {
  const [active, setActive] = useState<'teachers'|'students'>('teachers');
  const [teachers, setTeachers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [newClassId, setNewClassId] = useState('');

  const loadTeachers = async () => {
    setLoading(true);
    try {
      const t = await getAllTeachers();
      setTeachers(t);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo cargar profesores');
    } finally { setLoading(false); }
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const s = await getAllStudents();
      setStudents(s);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo cargar estudiantes');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (active === 'teachers') loadTeachers(); else loadStudents();
  }, [active]);

  const handleVerify = (id: string) => {
    Alert.alert('Verificar', 'Confirmar verificación de profesor?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Verificar', onPress: async () => {
        try { await verifyTeacher(id); loadTeachers(); } catch (err: any) { Alert.alert('Error', err.message || 'No se pudo verificar'); }
      }}
    ]);
  };

  const handleDeleteTeacher = (id: string) => {
    Alert.alert('Eliminar', 'Eliminar profesor permanentemente?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => { try { await deleteTeacher(id); loadTeachers(); } catch (err: any) { Alert.alert('Error', err.message || 'No se pudo eliminar'); } } }
    ]);
  };

  const handleDeleteStudent = (id: string) => {
    Alert.alert('Eliminar', 'Eliminar estudiante permanentemente?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => { try { await deleteStudent(id); loadStudents(); } catch (err: any) { Alert.alert('Error', err.message || 'No se pudo eliminar'); } } }
    ]);
  };

  const openReassign = (student: any) => {
    setSelectedStudent(student);
    setNewClassId(student.class_id || '');
  };

  const saveReassign = async () => {
    if (!selectedStudent) return;
    try {
      await reassignStudentToClass(selectedStudent.id, newClassId);
      setSelectedStudent(null);
      loadStudents();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo reasignar');
    }
  };

  const renderTeacher = ({ item }: { item: any }) => (
    <View style={styles.itemCard}>
      <View style={{flex:1}}>
        <Text style={styles.itemTitle}>{item.full_name}</Text>
        <Text style={styles.itemSubtitle}>{item.email}</Text>
        <Text style={styles.itemSubtitle}>Verificado: {item.verified ? 'Sí' : 'No'}</Text>
      </View>
      <View style={{flexDirection:'row'}}>
        {!item.verified && (
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleVerify(item.id)}>
            <Ionicons name="checkmark-done-outline" size={20} color="#2ecc71" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeleteTeacher(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStudent = ({ item }: { item: any }) => (
    <View style={styles.itemCard}>
      <View style={{flex:1}}>
        <Text style={styles.itemTitle}>{item.full_name}</Text>
        <Text style={styles.itemSubtitle}>Clase: {item.classes?.name || 'N/A'}</Text>
      </View>
      <View style={{flexDirection:'row'}}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => openReassign(item)}>
          <Ionicons name="swap-horizontal-outline" size={20} color="#3498db" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeleteStudent(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Gestión de Usuarios</Text></View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, active==='teachers' && styles.activeTab]} onPress={() => setActive('teachers')}>
          <Text style={[styles.tabText, active==='teachers' && styles.activeTabText]}>Profesores</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, active==='students' && styles.activeTab]} onPress={() => setActive('students')}>
          <Text style={[styles.tabText, active==='students' && styles.activeTabText]}>Estudiantes</Text>
        </TouchableOpacity>
      </View>

      {active === 'teachers' ? (
        <FlatList data={teachers} keyExtractor={(i)=>i.id} renderItem={renderTeacher} contentContainerStyle={styles.list} ListEmptyComponent={<Text style={styles.emptyText}>No hay profesores.</Text>} />
      ) : (
        <FlatList data={students} keyExtractor={(i)=>i.id} renderItem={renderStudent} contentContainerStyle={styles.list} ListEmptyComponent={<Text style={styles.emptyText}>No hay estudiantes.</Text>} />
      )}

      <Modal visible={!!selectedStudent} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reasignar estudiante</Text>
            <Text style={{marginBottom:8}}>Estudiante: {selectedStudent?.full_name}</Text>
            <TextInput placeholder="Nuevo class_id" value={newClassId} onChangeText={setNewClassId} style={styles.input} />
            <View style={{flexDirection:'row', justifyContent:'flex-end', gap:10}}>
              <TouchableOpacity style={{padding:10}} onPress={()=>setSelectedStudent(null)}><Text style={{color:'#666'}}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveReassign}><Text style={{color:'#fff'}}>Guardar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f5f5f5'},
  header: { padding:16, backgroundColor:'#333' },
  title: { color:'#fff', fontSize:20, fontWeight:'bold' },
  tabsContainer: { flexDirection:'row', backgroundColor:'#fff', elevation:2 },
  tab: { flex:1, padding:12, alignItems:'center' },
  activeTab: { borderBottomColor:'#333', borderBottomWidth:2 },
  tabText: { color:'#666' },
  activeTabText: { color:'#333', fontWeight:'bold' },
  list: { padding:16 },
  itemCard: { backgroundColor:'#fff', padding:12, borderRadius:8, marginBottom:12, flexDirection:'row', alignItems:'center' },
  itemTitle: { fontSize:16, fontWeight:'bold' },
  itemSubtitle: { color:'#666' },
  actionBtn: { padding:8, marginLeft:8 },
  emptyText: { textAlign:'center', color:'#999', marginTop:20 },
  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center' },
  modalContent: { width:'85%', backgroundColor:'#fff', padding:16, borderRadius:8 },
  modalTitle: { fontSize:18, fontWeight:'bold', marginBottom:8 },
  input: { borderWidth:1, borderColor:'#ddd', borderRadius:8, padding:10, marginBottom:12 },
  saveBtn: { backgroundColor:'#333', padding:10, borderRadius:6 }
});
