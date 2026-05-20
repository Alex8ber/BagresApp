/**
 * Root Navigator
 * 
 * Main navigation stack for the application with type-safe routing.
 * Configures all screens and navigation options with TypeScript validation.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { colors } from '@/styles/theme';
import { useAuth } from '@/hooks/useAuth';

// Auth Screens
import {
  RoleSelectionScreen,
  StudentLoginScreen,
  TeacherLoginScreen,
  TeacherRegisterScreen,
  TeacherVerificationScreen,
} from '@/screens/auth';

// Teacher Screens
import { TeacherDashboardTabs } from '@/screens/teacher';
import TeacherStudentsListScreen from '@/screens/teacher/TeacherStudentsListScreen';
import TeacherCreateTestScreen from '@/screens/teacher/TeacherCreateTestScreen';
import TeacherCreateClassScreen from '@/screens/teacher/TeacherCreateClassScreen';
import TeacherCreateMaterialScreen from '@/screens/teacher/TeacherCreateMaterialScreen';
import TeacherCreateQuizScreen from '@/screens/teacher/TeacherCreateQuizScreen';
import QuizEditorScreen from '@/screens/teacher/QuizEditorScreen';
import QuizDetailScreen from '@/screens/teacher/QuizDetailScreen';
import TeacherMaterialDetailScreen from '@/screens/teacher/TeacherMaterialDetailScreen';
import TeacherReportsScreen from '@/screens/teacher/TeacherReportsScreen';
import TeacherSubmissionDetailScreen from '@/screens/teacher/TeacherSubmissionDetailScreen';
import TeacherScheduleScreen from '@/screens/teacher/TeacherScheduleScreen';
import TeacherEditProfileScreen from '@/screens/teacher/TeacherEditProfileScreen';
import TeacherNotificationsScreen from '@/screens/teacher/TeacherNotificationsScreen';

// Student Screens
import { StudentDashboardTabs } from '@/screens/student';
import StudentTakeQuizScreen from '@/screens/student/StudentTakeQuizScreen';
import StudentQuizResultsScreen from '@/screens/student/StudentQuizResultsScreen';

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
  const { role, loading } = useAuth();

  // Always render the navigator, never return null
  return (
    <Stack.Navigator 
      screenOptions={defaultScreenOptions}
    >
      {loading ? (
        // Loading screen
        <Stack.Screen
          name="RoleSelection"
          options={{ headerShown: false }}
        >
          {() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA' }}>
              <Text style={{ fontSize: 18, color: '#666' }}>Cargando...</Text>
            </View>
          )}
        </Stack.Screen>
      ) : !role ? (
        // Auth Stack - shown when not authenticated (no role assigned)
        <>
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
        </>
      ) : role === 'teacher' ? (
        // Teacher Stack - shown when authenticated as teacher
        <>
          <Stack.Screen
            name="TeacherDashboard"
            component={TeacherDashboardTabs}
            options={{
              headerShown: false,
            }}
          />

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
            name="TeacherCreateMaterial"
            component={TeacherCreateMaterialScreen}
            options={{
              title: 'Nuevo Material',
              headerStyle: {
                backgroundColor: colors.teacher.main,
              },
            }}
          />
          
          <Stack.Screen
            name="TeacherCreateQuiz"
            component={TeacherCreateQuizScreen}
            options={{
              title: 'Nuevo Cuestionario',
              headerStyle: {
                backgroundColor: colors.teacher.main,
              },
            }}
          />
          
          <Stack.Screen
            name="QuizEditor"
            component={QuizEditorScreen}
            options={{
              title: 'Editor de Preguntas',
              headerStyle: {
                backgroundColor: colors.teacher.main,
              },
            }}
          />
          
          <Stack.Screen
            name="QuizDetail"
            component={QuizDetailScreen}
            options={{
              title: 'Detalle del Cuestionario',
              headerStyle: {
                backgroundColor: colors.teacher.main,
              },
            }}
          />
          
          <Stack.Screen
            name="TeacherMaterialDetail"
            component={TeacherMaterialDetailScreen}
            options={{
              title: 'Detalle del Material',
              headerStyle: {
                backgroundColor: colors.teacher.main,
              },
            }}
          />
          
          <Stack.Screen
            name="TeacherReports"
            component={TeacherReportsScreen}
            options={{
              title: 'Reportes',
              headerShown: false,
            }}
          />
          
          <Stack.Screen
            name="TeacherSubmissionDetail"
            component={TeacherSubmissionDetailScreen}
            options={{
              title: 'Detalle de Respuestas',
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

          <Stack.Screen
            name="TeacherEditProfile"
            component={TeacherEditProfileScreen}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="TeacherNotifications"
            component={TeacherNotificationsScreen}
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : role === 'student' ? (
        // Student Stack - shown when authenticated as student
        <>
          <Stack.Screen
            name="StudentDashboard"
            component={StudentDashboardTabs}
            options={{
              headerShown: false,
            }}
          />
          
          <Stack.Screen
            name="StudentTakeQuiz"
            component={StudentTakeQuizScreen}
            options={{
              headerShown: false,
            }}
          />
          
          <Stack.Screen
            name="StudentQuizResults"
            component={StudentQuizResultsScreen}
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : null}
    </Stack.Navigator>
  );
}

export default RootNavigator;
