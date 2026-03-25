/**
 * TeacherScheduleScreen
 * 
 * Screen for scheduling classes and tests with automatic student notifications.
 * Allows teachers to create, view, and manage scheduled events.
 * 
 * Requirements: 1.9, 2.1, 5.2, 5.9, 10.14, 11.1, 11.9
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackScreenProps } from '@/types/navigation';

// ============================================================================
// Types
// ============================================================================

type EventType = 'Test' | 'Class';

interface ScheduledEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time: string;
  description: string;
}

interface NewEventForm {
  title: string;
  type: EventType;
  date: string;
  time: string;
  description: string;
}

type Props = RootStackScreenProps<'TeacherSchedule'>;

// ============================================================================
// Component
// ============================================================================

export default function TeacherScheduleScreen({ navigation }: Props) {
  const [events, setEvents] = useState<ScheduledEvent[]>([
    {
      id: '1',
      title: 'Algebra Midterm Test',
      type: 'Test',
      date: '2026-03-20',
      time: '10:00 AM',
      description: 'Covers chapters 1-4',
    },
    {
      id: '2',
      title: 'Calculus Review Class',
      type: 'Class',
      date: '2026-03-22',
      time: '02:00 PM',
      description: 'Review session for the upcoming final.',
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newEvent, setNewEvent] = useState<NewEventForm>({
    title: '',
    type: 'Test',
    date: '',
    time: '',
    description: '',
  });

  // Configure navigation header with add button
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{ marginRight: 15 }}
        >
          <Ionicons name="add" size={28} color="#4285F4" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      return; // Simple validation
    }

    const eventToAdd: ScheduledEvent = {
      ...newEvent,
      id: Date.now().toString(),
    };

    setEvents(
      [...events, eventToAdd].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );
    setNewEvent({
      title: '',
      type: 'Test',
      date: '',
      time: '',
      description: '',
    });
    setModalVisible(false);
  };

  const renderEvent = ({ item }: { item: ScheduledEvent }) => {
    const isTest = item.type === 'Test';

    return (
      <View style={styles.cardContainer}>
        <View
          style={[
            styles.cardAccent,
            { backgroundColor: isTest ? '#EA4335' : '#34A853' },
          ]}
        />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.typeBadge,
                { backgroundColor: isTest ? '#FCE8E6' : '#E6F4EA' },
              ]}
            >
              <Text
                style={[
                  styles.typeText,
                  { color: isTest ? '#EA4335' : '#34A853' },
                ]}
              >
                {item.type}
              </Text>
            </View>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={14} color="#718096" />
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
          </View>

          <Text style={styles.eventTitle}>{item.title}</Text>

          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={16} color="#4A5568" />
            <Text style={styles.timeText}>{item.time}</Text>
          </View>

          {item.description ? (
            <Text style={styles.descriptionText}>{item.description}</Text>
          ) : null}

          <View style={styles.notificationBanner}>
            <Ionicons name="notifications" size={16} color="#4285F4" />
            <Text style={styles.notificationText}>
              Students will be notified
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const keyExtractor = (item: ScheduledEvent) => item.id;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.infoBanner}>
        <Ionicons name="information-circle-outline" size={24} color="#4285F4" />
        <Text style={styles.bannerText}>
          Schedule classes and tests. Students will receive an automatic
          notification.
        </Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={keyExtractor}
        renderItem={renderEvent}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-clear-outline" size={64} color="#CBD5E0" />
            <Text style={styles.emptyText}>No events scheduled yet.</Text>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Event</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#4A5568" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Event Type</Text>
                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      newEvent.type === 'Test' && styles.typeOptionActiveTest,
                    ]}
                    onPress={() => setNewEvent({ ...newEvent, type: 'Test' })}
                  >
                    <Text
                      style={[
                        styles.typeOptionText,
                        newEvent.type === 'Test' &&
                          styles.typeOptionTextActiveTest,
                      ]}
                    >
                      Test
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      newEvent.type === 'Class' && styles.typeOptionActiveClass,
                    ]}
                    onPress={() => setNewEvent({ ...newEvent, type: 'Class' })}
                  >
                    <Text
                      style={[
                        styles.typeOptionText,
                        newEvent.type === 'Class' &&
                          styles.typeOptionTextActiveClass,
                      ]}
                    >
                      Class
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Event Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Algebra Midterm"
                  value={newEvent.title}
                  onChangeText={(text) =>
                    setNewEvent({ ...newEvent, title: text })
                  }
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={newEvent.date}
                    onChangeText={(text) =>
                      setNewEvent({ ...newEvent, date: text })
                    }
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                  <Text style={styles.inputLabel}>Time</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="10:00 AM"
                    value={newEvent.time}
                    onChangeText={(text) =>
                      setNewEvent({ ...newEvent, time: text })
                    }
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Add details about the event..."
                  value={newEvent.description}
                  onChangeText={(text) =>
                    setNewEvent({ ...newEvent, description: text })
                  }
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddEvent}
              >
                <Text style={styles.submitButtonText}>
                  Schedule & Notify Students
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFBFD' },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#E8F0FE',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  bannerText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#1A73E8',
    fontWeight: '500',
    lineHeight: 20,
  },
  listContainer: { padding: 20, paddingBottom: 100 },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardAccent: { width: 6 },
  cardContent: { flex: 1, padding: 16 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: 12, fontWeight: '700' },
  dateContainer: { flexDirection: 'row', alignItems: 'center' },
  dateText: {
    fontSize: 13,
    color: '#718096',
    fontWeight: '600',
    marginLeft: 4,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
    marginLeft: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
    marginBottom: 16,
  },
  notificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notificationText: {
    fontSize: 13,
    color: '#4285F4',
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#A0AEC0',
    fontWeight: '500',
    marginTop: 16,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: { fontSize: 22, fontWeight: '700', color: '#2D3748' },
  inputGroup: { marginBottom: 20 },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#2D3748',
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  typeSelector: { flexDirection: 'row', justifyContent: 'space-between' },
  typeOption: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  typeOptionActiveTest: { backgroundColor: '#FCE8E6', borderColor: '#EA4335' },
  typeOptionActiveClass: { backgroundColor: '#E6F4EA', borderColor: '#34A853' },
  typeOptionText: { fontSize: 16, fontWeight: '600', color: '#718096' },
  typeOptionTextActiveTest: { color: '#EA4335' },
  typeOptionTextActiveClass: { color: '#34A853' },
  submitButton: {
    backgroundColor: '#4285F4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
