/**
 * TeacherMainScreen
 * 
 * Main dashboard screen for teachers with quick access to common actions.
 * Provides navigation to Students List, Create Test, Create Class, Schedule, and Reports.
 * 
 * Requirements: 1.9, 2.1, 5.2, 5.9, 10.14, 11.1, 11.9
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { TeacherTabScreenProps } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/types/navigation';
import { theme } from '@/styles';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface FastAccessOption {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  iconColor: string;
  route: keyof RootStackParamList;
}

type Props = TeacherTabScreenProps<'Main'>;

/**
 * TeacherMainScreen Component
 * 
 * Displays a grid of quick access options for common teacher actions.
 */
export default function TeacherMainScreen(_props: Props) {
  const navigation = useNavigation<NavigationProp>();

  const fastAccessOptions: FastAccessOption[] = [
    {
      id: '1',
      title: 'Students List',
      icon: 'people',
      color: '#E8F0FE',
      iconColor: '#4285F4',
      route: 'TeacherStudentsList',
    },
    {
      id: '2',
      title: 'Create Test',
      icon: 'document-text',
      color: '#FCE8E6',
      iconColor: '#EA4335',
      route: 'TeacherCreateTest',
    },
    {
      id: '3',
      title: 'Create Class',
      icon: 'school',
      color: '#E6F4EA',
      iconColor: '#34A853',
      route: 'TeacherCreateClass',
    },
    {
      id: '4',
      title: 'Schedule',
      icon: 'calendar',
      color: '#FEF7E0',
      iconColor: '#FBBC04',
      route: 'TeacherSchedule',
    },
    {
      id: '5',
      title: 'Reports',
      icon: 'bar-chart',
      color: '#F3E8FF',
      iconColor: '#9333EA',
      route: 'TeacherReports',
    },
  ];

  const handlePress = (option: FastAccessOption) => {
    // Navigate to the appropriate screen based on the route
    if (option.route === 'TeacherStudentsList') {
      // This requires a classId parameter, so we'll need to handle it differently
      // For now, navigate with a placeholder or show a class selection
      console.log('Navigate to Students List - requires class selection');
    } else if (option.route === 'TeacherCreateTest') {
      navigation.navigate('TeacherCreateTest', {});
    } else if (option.route === 'TeacherCreateClass') {
      navigation.navigate('TeacherCreateClass');
    } else if (option.route === 'TeacherReports') {
      navigation.navigate('TeacherReports', {});
    } else if (option.route === 'TeacherSchedule') {
      navigation.navigate('TeacherSchedule');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
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
                  onPress={() => handlePress(item)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: 'white' }]}>
                    <Ionicons name={item.icon} size={28} color={item.iconColor} />
                  </View>
                  <Text style={[styles.itemTitle, { color: theme.colors.text.primary }]}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 600,
  },
  headerContainer: {
    marginBottom: theme.spacing.xl,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: theme.fontWeight.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  greetingSubtitle: {
    fontSize: theme.fontSize.base,
    color: theme.colors.text.secondary,
    fontWeight: theme.fontWeight.medium as any,
  },
  quickAccessContainer: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold as any,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: width > 768 ? 'flex-start' : 'space-between',
    gap: width > 768 ? theme.spacing.md : theme.spacing.sm,
  },
  gridItem: {
    width: width > 768 ? 180 : (width - theme.spacing.lg * 2 - theme.spacing.sm) / 2,
    height: width > 768 ? 160 : (width - theme.spacing.lg * 2 - theme.spacing.sm) / 2,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  itemTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold as any,
    textAlign: 'center',
    lineHeight: 18,
  },
});
