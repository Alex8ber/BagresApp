import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getAllClasses, getAllMaterials, getAllQuizzes, deleteClassByAdmin, deleteMaterialByAdmin, deleteQuizByAdmin } from '@/services/supabase/admin';

type ContentType = 'classes' | 'materials' | 'quizzes';

export default function AdminContentScreen() {
  const [activeTab, setActiveTab] = useState<ContentType>('classes');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'classes') {
        const classes = await getAllClasses();
        setData(classes);
      } else if (activeTab === 'materials') {
        const materials = await getAllMaterials();
        setData(materials);
      } else if (activeTab === 'quizzes') {
        const quizzes = await getAllQuizzes();
        setData(quizzes);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo cargar el contenido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este elemento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              if (activeTab === 'classes') await deleteClassByAdmin(id);
              if (activeTab === 'materials') await deleteMaterialByAdmin(id);
              if (activeTab === 'quizzes') await deleteQuizByAdmin(id);
              loadData();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'No se pudo eliminar');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.itemCard}>
        <View style={styles.itemInfo}>
          <TouchableOpacity onPress={() => setSelectedItem(item)}>
            <Text style={styles.itemTitle}>{item.name || item.title}</Text>
          </TouchableOpacity>
          {item.teachers && (
            <Text style={styles.itemSubtitle}>Profesor: {item.teachers.full_name}</Text>
          )}
          {item.classes?.teachers && (
            <Text style={styles.itemSubtitle}>Profesor: {item.classes.teachers.full_name}</Text>
          )}
          {item.classes?.name && (
            <Text style={styles.itemSubtitle}>Clase: {item.classes.name}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#dc3545" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Control de Contenido</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'classes' && styles.activeTab]}
          onPress={() => setActiveTab('classes')}
        >
          <Text style={[styles.tabText, activeTab === 'classes' && styles.activeTabText]}>Clases</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'materials' && styles.activeTab]}
          onPress={() => setActiveTab('materials')}
        >
          <Text style={[styles.tabText, activeTab === 'materials' && styles.activeTabText]}>Materiales</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'quizzes' && styles.activeTab]}
          onPress={() => setActiveTab('quizzes')}
        >
          <Text style={[styles.tabText, activeTab === 'quizzes' && styles.activeTabText]}>Quizzes</Text>
        </TouchableOpacity>
      </View>

      <View style={{padding:12, backgroundColor:'#fff'}}>
        <TextInput placeholder="Buscar por nombre/autor..." value={query} onChangeText={setQuery} style={styles.searchInput} />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#333" />
      ) : (
        <FlatList
          data={data.filter(d => {
            if (!query) return true;
            const name = (d.name || d.title || '').toString().toLowerCase();
            return name.includes(query.toLowerCase());
          })}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay contenido para mostrar.</Text>}
        />
      )}

      {selectedItem && (
        <Modal transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedItem.name || selectedItem.title}</Text>
              <Text style={{marginBottom:8}}>{selectedItem.description || selectedItem.title}</Text>
              <Text>Id: {selectedItem.id}</Text>
              <Text>Creado: {selectedItem.created_at || selectedItem.createdAt}</Text>
              <View style={{flexDirection:'row', justifyContent:'flex-end', marginTop:12}}>
                <TouchableOpacity style={{padding:10}} onPress={() => setSelectedItem(null)}>
                  <Text style={{color:'#666'}}>Cerrar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => { setSelectedItem(null); handleDelete(selectedItem.id); }}>
                  <Text style={{color:'#fff'}}>Eliminar</Text>
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
  tabsContainer: { flexDirection: 'row', backgroundColor: '#fff', elevation: 2 },
  tab: { flex: 1, padding: 15, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#333' },
  tabText: { color: '#666', fontWeight: '500' },
  activeTabText: { color: '#333', fontWeight: 'bold' },
  loader: { flex: 1, justifyContent: 'center' },
  list: { padding: 20 },
  searchInput: { backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center' },
  modalContent: { backgroundColor:'#fff', padding:20, borderRadius:8, width:'85%' },
  modalTitle: { fontSize:18, fontWeight:'bold', marginBottom:8 },
  itemCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
  },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  itemSubtitle: { fontSize: 14, color: '#666' },
  deleteButton: { padding: 10 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },
});
