/**
 * App Entry Point
 * 
 * Main application component that sets up navigation and global providers.
 * Wraps the app with AuthProvider (outer) and TeacherProvider (inner).
 * 
 * Requirements: 1.9, 10.14, 11.1, 11.4, 11.8, 11.14
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '@/context/AuthContext';
import { TeacherProvider } from '@/context/TeacherContext';
import { RootNavigator } from '@/navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <TeacherProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </TeacherProvider>
    </AuthProvider>
  );
}
