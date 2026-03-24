/**
 * TeacherDashboardTabs
 * 
 * Bottom tab navigator for the teacher dashboard.
 * Provides navigation between Main, Classes, Library, and Profile screens.
 * 
 * Requirements: 1.9, 5.2, 5.8, 5.9, 10.14, 11.1, 11.9
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { TeacherTabParamList } from '@/types/navigation';
import { theme } from '@/styles';

import TeacherMainScreen from './TeacherMainScreen';
import TeacherClassesScreen from './TeacherClassesScreen';
import TeacherLibraryScreen from './TeacherLibraryScreen';
import TeacherProfileScreen from './TeacherProfileScreen';

const Tab = createBottomTabNavigator<TeacherTabParamList>();

/**
 * TeacherDashboardTabs Component
 * 
 * Configures the bottom tab navigator for teacher dashboard with typed routes.
 */
export default function TeacherDashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Main') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Classes') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'Library') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary[500],
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
      <Tab.Screen name="Main" component={TeacherMainScreen} />
      <Tab.Screen name="Classes" component={TeacherClassesScreen} />
      <Tab.Screen name="Library" component={TeacherLibraryScreen} />
      <Tab.Screen name="Profile" component={TeacherProfileScreen} />
    </Tab.Navigator>
  );
}
