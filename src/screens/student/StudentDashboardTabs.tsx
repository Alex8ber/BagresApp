/**
 * StudentDashboardTabs
 * 
 * Bottom tab navigator for student dashboard with main sections.
 * Provides navigation between Home, Library, and Profile.
 * Note: Students join only one class, so no Classes tab needed.
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/styles';
import type { StudentTabParamList } from '@/types/navigation';

// Student Screens
import StudentMainScreen from './StudentMainScreen';
import StudentProfileScreen from './StudentProfileScreen';
import StudentLibraryScreen from './StudentLibraryScreen';

const Tab = createBottomTabNavigator<StudentTabParamList>();

/**
 * StudentDashboardTabs Component
 * 
 * Configures the bottom tab navigator for student dashboard with typed routes.
 */
export function StudentDashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Main') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Library') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.student.main,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background.primary,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border.light,
          paddingBottom: theme.spacing.xs,
          paddingTop: theme.spacing.xs,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: theme.fontSize.xs,
          fontWeight: theme.fontWeight.semibold as any,
          marginTop: -5,
        },
      })}
    >
      <Tab.Screen 
        name="Main" 
        component={StudentMainScreen}
        options={{ title: 'Inicio' }}
      />
      <Tab.Screen 
        name="Library" 
        component={StudentLibraryScreen}
        options={{ title: 'Biblioteca' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={StudentProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

export default StudentDashboardTabs;
