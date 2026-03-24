/**
 * Root Navigator
 * 
 * Main navigation stack for the application with type-safe routing.
 * Configures all screens and navigation options with TypeScript validation.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { colors } from '@/styles/theme';
import { useAuth } from '@/hooks/useAuth';

// Auth Screens
import {
  RoleSelectionScreen,
  StudentLoginScreen,
  StudentRegisterScreen,
  TeacherLoginScreen,
  TeacherRegisterScreen,
  TeacherVerificationScreen,
} from '@/screens/auth';

// Teacher Screens
import { TeacherDashboardTabs } from '@/screens/teacher';
import TeacherStudentsListScreen from '@/screens/teacher/TeacherStudentsListScreen';
import TeacherCreateTestScreen from '@/screens/teacher/TeacherCreateTestScreen';
import TeacherCreateClassScreen from '@/screens/teacher/TeacherCreateClassScreen';
import TeacherReportsScreen from '@/screens/teacher/TeacherReportsScreen';
import TeacherScheduleScreen from '@/screens/teacher/TeacherScheduleScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Default screen options applied to all screens
 */
const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: colors.primary[500],
  },
  headerTintColor: colors.text.inverse,
  headerTitleStyle: {
    fontWeight: '600' as const,
  },
  headerBackTitleVisible: false,
  animation: 'slide_from_right' as const,
};

export function RootNavigator() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <Stack.Navigator
      initialRouteName={user && role === 'teacher' ? 'TeacherDashboard' : 'RoleSelection'}
      screenOptions={defaultScreenOptions}
    >
      {/* Auth Screens */}
      <Stack.Screen
        name="RoleSelection"
        component={RoleSelectionScreen}
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="StudentLogin"
        component={StudentLoginScreen}
        options={{
          title: 'Student Login',
          headerStyle: {
            backgroundColor: colors.student.main,
          },
        }}
      />
      
      <Stack.Screen
        name="StudentRegister"
        component={StudentRegisterScreen}
        options={{
          title: 'Student Registration',
          headerStyle: {
            backgroundColor: colors.student.main,
          },
        }}
      />
      
      <Stack.Screen
        name="TeacherLogin"
        component={TeacherLoginScreen}
        options={{
          title: 'Teacher Login',
          headerStyle: {
            backgroundColor: colors.teacher.main,
          },
        }}
      />
      
      <Stack.Screen
        name="TeacherRegister"
        component={TeacherRegisterScreen}
        options={{
          title: 'Teacher Registration',
          headerStyle: {
            backgroundColor: colors.teacher.main,
          },
        }}
      />
      
      <Stack.Screen
        name="TeacherVerification"
        component={TeacherVerificationScreen}
        options={{
          title: 'Verify Email',
          headerStyle: {
            backgroundColor: colors.teacher.main,
          },
        }}
      />

      {/* Teacher Dashboard */}
      <Stack.Screen
        name="TeacherDashboard"
        component={TeacherDashboardTabs}
        options={{
          headerShown: false,
        }}
      />

      {/* Teacher Feature Screens */}
      <Stack.Screen
        name="TeacherStudentsList"
        component={TeacherStudentsListScreen}
        options={{
          title: 'Students',
          headerStyle: {
            backgroundColor: colors.teacher.main,
          },
        }}
      />
      
      <Stack.Screen
        name="TeacherCreateTest"
        component={TeacherCreateTestScreen}
        options={{
          title: 'Create Test',
          headerStyle: {
            backgroundColor: colors.teacher.main,
          },
        }}
      />
      
      <Stack.Screen
        name="TeacherCreateClass"
        component={TeacherCreateClassScreen}
        options={{
          title: 'Nueva Clase',
          headerStyle: {
            backgroundColor: colors.teacher.main,
          },
        }}
      />
      
      <Stack.Screen
        name="TeacherReports"
        component={TeacherReportsScreen}
        options={{
          title: 'Reports',
          headerStyle: {
            backgroundColor: colors.teacher.main,
          },
        }}
      />
      
      <Stack.Screen
        name="TeacherSchedule"
        component={TeacherScheduleScreen}
        options={{
          title: 'Schedule',
          headerStyle: {
            backgroundColor: colors.teacher.main,
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default RootNavigator;
