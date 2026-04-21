/**
 * TeacherStudentsListScreen
 * 
 * Screen for displaying and managing students in a specific class.
 * Allows teachers to view student list and search students.
 * 
 * Requirements: 1.9, 5.3, 5.6, 5.9, 10.14, 11.1, 11.8, 11.9, 12.5, 12.8
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackScreenProps } from '@/types/navigation';
import { theme } from '@/styles';
import { getClassStudents } from '@/services/supabase/classes';

// ============================================================================
// Types
// ============================================================================

interface Student {
  student_id: string;
  enrolled_at: string;
  students: {
    id: string;
    full_name: string;
  };
}

type Props = RootStackScreenProps<'TeacherStudentsList'>;

// ============================================================================
// Component
// ============================================================================

export default function TeacherStudentsListScreen({ route, navigation }: Props) {
  const { classId } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, [classId]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const studentsData = await getClassStudents(classId);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sort students alphabetically and filter by search query
  const filteredStudents = useMemo(() => {
    return students
      .filter((student) =>
        student.students?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => 
        (a.students?.full_name || '').localeCompare(b.students?.full_name || '')
      );
  }, [students, searchQuery]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const renderStudentItem = ({ item }: { item: Student }) => (
    <View style={styles.studentItem}>
      <View style={styles.studentInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.students?.full_name?.charAt(0) || '?'}
          </Text>
        </View>
        <View style={styles.studentDetails}>
          <Text style={styles.studentName}>{item.students?.full_name || 'Sin nombre'}</Text>
          <Text style={styles.studentMeta}>
            Inscrito: {formatDate(item.enrolled_at)}
          </Text>
        </View>
      </View>
    </View>
  );

  const keyExtractor = (item: Student) => item.student_id;

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.teacher.main} />
          <Text style={styles.loadingText}>Cargando estudiantes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Info */}
        <View style={styles.headerInfo}>
          <View style={styles.statsCard}>
            <Ionicons name="people" size={32} color={theme.colors.teacher.main} />
            <View style={styles.statsContent}>
              <Text style={styles.statsNumber}>{students.length}</Text>
              <Text style={styles.statsLabel}>
                {students.length === 1 ? 'Estudiante' : 'Estudiantes'}
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#A0AEC0"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar estudiantes..."
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
          keyExtractor={keyExtractor}
          renderItem={renderStudentItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>
                {searchQuery ? 'No se encontraron estudiantes' : 'No hay estudiantes en esta clase'}
              </Text>
              <Text style={styles.emptySubtext}>
                Los estudiantes pueden unirse usando el código de clase
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerInfo: {
    marginBottom: 20,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    gap: 16,
  },
  statsContent: {
    flex: 1,
  },
  statsNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
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
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2D3748',
  },
  listContainer: {
    paddingBottom: 20,
  },
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
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F0FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.teacher.main,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  studentMeta: {
    fontSize: 13,
    color: '#718096',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
