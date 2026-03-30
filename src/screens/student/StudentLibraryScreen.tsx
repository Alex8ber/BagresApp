/**
 * StudentLibraryScreen
 * 
 * Library screen for students showing available quizzes and study materials.
 * Displays tests to take and class materials uploaded by teachers.
 * 
 * Requirements: 2.3, 2.6, 5.3, 6.7, 8.1, 8.2, 11.8
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/styles';

interface Quiz {
  id: string;
  title: string;
  questions: number;
  duration: string;
  status: 'available' | 'completed' | 'locked';
  score?: number;
}

interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'document';
  uploadedBy: string;
  date: string;
}

/**
 * StudentLibraryScreen Component
 * 
 * Shows quizzes and study materials in a kid-friendly interface.
 */
export default function StudentLibraryScreen() {
  const [activeTab, setActiveTab] = useState<'quizzes' | 'materials'>('quizzes');

  // Mock data
  const quizzes: Quiz[] = [
    {
      id: '1',
      title: 'Quiz de Fracciones',
      questions: 10,
      duration: '15 min',
      status: 'available',
    },
    {
      id: '2',
      title: 'Examen de Suma y Resta',
      questions: 15,
      duration: '20 min',
      status: 'completed',
      score: 95,
    },
    {
      id: '3',
      title: 'Quiz de Multiplicación',
      questions: 12,
      duration: '18 min',
      status: 'locked',
    },
  ];

  const materials: Material[] = [
    {
      id: '1',
      title: 'Guía de Fracciones.pdf',
      type: 'pdf',
      uploadedBy: 'Prof. García',
      date: 'Hace 2 días',
    },
    {
      id: '2',
      title: 'Video: Cómo sumar fracciones',
      type: 'video',
      uploadedBy: 'Prof. García',
      date: 'Hace 1 semana',
    },
    {
      id: '3',
      title: 'Ejercicios de práctica.docx',
      type: 'document',
      uploadedBy: 'Prof. García',
      date: 'Hace 3 días',
    },
  ];

  const getQuizStatusColor = (status: Quiz['status']) => {
    switch (status) {
      case 'available':
        return theme.colors.student.main;
      case 'completed':
        return '#4CAF50';
      case 'locked':
        return '#9E9E9E';
    }
  };

  const getQuizStatusText = (status: Quiz['status']) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'completed':
        return 'Completado';
      case 'locked':
        return 'Bloqueado';
    }
  };

  const getQuizStatusIcon = (status: Quiz['status']) => {
    switch (status) {
      case 'available':
        return 'play-circle';
      case 'completed':
        return 'checkmark-circle';
      case 'locked':
        return 'lock-closed';
    }
  };

  const getMaterialIcon = (type: Material['type']) => {
    switch (type) {
      case 'pdf':
        return { icon: 'document-text', color: '#E74C3C', bg: '#FFEBEE' };
      case 'video':
        return { icon: 'play-circle', color: '#9C27B0', bg: '#F3E5F5' };
      case 'document':
        return { icon: 'document', color: '#2196F3', bg: '#E3F2FD' };
    }
  };

  const renderQuizzes = () => (
    <View style={styles.content}>
      {quizzes.map((quiz) => (
        <TouchableOpacity
          key={quiz.id}
          style={styles.quizCard}
          activeOpacity={0.8}
          disabled={quiz.status === 'locked'}
        >
          {/* Quiz Header */}
          <View style={styles.quizHeader}>
            <View style={[
              styles.quizStatusBadge,
              { backgroundColor: getQuizStatusColor(quiz.status) + '20' }
            ]}>
              <Ionicons
                name={getQuizStatusIcon(quiz.status) as any}
                size={16}
                color={getQuizStatusColor(quiz.status)}
              />
              <Text style={[
                styles.quizStatusText,
                { color: getQuizStatusColor(quiz.status) }
              ]}>
                {getQuizStatusText(quiz.status)}
              </Text>
            </View>
            {quiz.score !== undefined && (
              <View style={styles.scoreChip}>
                <Ionicons name="star" size={14} color="#FFA000" />
                <Text style={styles.scoreChipText}>{quiz.score} pts</Text>
              </View>
            )}
          </View>

          {/* Quiz Title */}
          <Text style={styles.quizTitle}>{quiz.title}</Text>

          {/* Quiz Info */}
          <View style={styles.quizInfo}>
            <View style={styles.quizInfoItem}>
              <Ionicons name="help-circle-outline" size={16} color="#666" />
              <Text style={styles.quizInfoText}>{quiz.questions} preguntas</Text>
            </View>
            <View style={styles.quizInfoItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.quizInfoText}>{quiz.duration}</Text>
            </View>
          </View>

          {/* Action Button */}
          {quiz.status === 'available' && (
            <View style={styles.quizAction}>
              <Text style={styles.quizActionText}>Comenzar Quiz</Text>
              <Ionicons name="arrow-forward" size={20} color={theme.colors.student.main} />
            </View>
          )}
          {quiz.status === 'completed' && (
            <View style={styles.quizAction}>
              <Text style={styles.quizActionText}>Ver Resultados</Text>
              <Ionicons name="arrow-forward" size={20} color="#4CAF50" />
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderMaterials = () => (
    <View style={styles.content}>
      {materials.map((material) => {
        const iconData = getMaterialIcon(material.type);
        return (
          <TouchableOpacity
            key={material.id}
            style={styles.materialCard}
            activeOpacity={0.8}
          >
            <View style={[styles.materialIcon, { backgroundColor: iconData.bg }]}>
              <Ionicons name={iconData.icon as any} size={28} color={iconData.color} />
            </View>
            <View style={styles.materialContent}>
              <Text style={styles.materialTitle}>{material.title}</Text>
              <View style={styles.materialMeta}>
                <Ionicons name="person-outline" size={14} color="#666" />
                <Text style={styles.materialMetaText}>{material.uploadedBy}</Text>
                <Text style={styles.materialMetaDot}>•</Text>
                <Text style={styles.materialMetaText}>{material.date}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Biblioteca</Text>
          <Text style={styles.headerSubtitle}>Matemáticas • 2do Grado</Text>
        </View>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'quizzes' && styles.tabActive]}
          onPress={() => setActiveTab('quizzes')}
        >
          <Ionicons
            name="clipboard"
            size={20}
            color={activeTab === 'quizzes' ? theme.colors.student.main : '#999'}
          />
          <Text style={[
            styles.tabText,
            activeTab === 'quizzes' && styles.tabTextActive
          ]}>
            Quizzes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'materials' && styles.tabActive]}
          onPress={() => setActiveTab('materials')}
        >
          <Ionicons
            name="book"
            size={20}
            color={activeTab === 'materials' ? theme.colors.student.main : '#999'}
          />
          <Text style={[
            styles.tabText,
            activeTab === 'materials' && styles.tabTextActive
          ]}>
            Materiales
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'quizzes' ? renderQuizzes() : renderMaterials()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  // Header
  header: {
    backgroundColor: theme.colors.student.main,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  headerContent: {
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },

  // Tab Selector
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },

  tabActive: {
    backgroundColor: '#E8F5E9',
  },

  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#999',
  },

  tabTextActive: {
    color: theme.colors.student.main,
  },

  // Content
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Quiz Card
  quizCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  quizStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },

  quizStatusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  scoreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },

  scoreChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F57C00',
  },

  quizTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },

  quizInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },

  quizInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  quizInfoText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },

  quizAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
  },

  quizActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.student.main,
  },

  // Material Card
  materialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  materialIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  materialContent: {
    flex: 1,
  },

  materialTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 6,
  },

  materialMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  materialMetaText: {
    fontSize: 12,
    color: '#666',
  },

  materialMetaDot: {
    fontSize: 12,
    color: '#999',
  },
});
