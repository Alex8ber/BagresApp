import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { AdminTabParamList } from '@/navigation/types';

// Admin screens
import AdminOverviewScreen from './AdminOverviewScreen';
import AdminContentScreen from './AdminContentScreen';
import AdminQualificationsScreen from './AdminQualificationsScreen';

const Tab = createBottomTabNavigator<AdminTabParamList>();

export default function AdminDashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#333',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen 
        name="Overview" 
        component={AdminOverviewScreen} 
        options={{
          tabBarLabel: 'Resumen',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pie-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Content" 
        component={AdminContentScreen} 
        options={{
          tabBarLabel: 'Contenido',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="folder-open-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Qualifications" 
        component={AdminQualificationsScreen} 
        options={{
          tabBarLabel: 'Calificaciones',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
