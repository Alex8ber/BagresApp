import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RoleSelectionScreen from './src/screens/RoleSelectionScreen';
import StudentLoginScreen from './src/screens/StudentLoginScreen';
import StudentRegisterScreen from './src/screens/StudentRegisterScreen';
import TeacherLoginScreen from './src/screens/TeacherLoginScreen';
import TeacherRegisterScreen from './src/screens/TeacherRegisterScreen';
import TeacherVerificationScreen from './src/screens/TeacherVerificationScreen';
import TeacherDashboardTabs from './src/screens/TeacherDashboardTabs';
import TeacherStudentsListScreen from './src/screens/TeacherStudentsListScreen';
import TeacherCreateTestScreen from './src/screens/TeacherCreateTestScreen';
import TeacherCreateClassScreen from './src/screens/TeacherCreateClassScreen';
import TeacherReportsScreen from './src/screens/TeacherReportsScreen';
import TeacherScheduleScreen from './src/screens/TeacherScheduleScreen';
import { TeacherProvider } from './src/context/TeacherContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TeacherProvider>
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="RoleSelection"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FAFBFD' }
        }}
      >
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen
          name="StudentLogin"
          component={StudentLoginScreen}
          options={{
            headerShown: true,
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#4A5568',
            headerBackTitleVisible: false,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="StudentRegister"
          component={StudentRegisterScreen}
          options={{
            headerShown: true,
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#4A5568',
            headerBackTitleVisible: false,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="TeacherRegister"
          component={TeacherRegisterScreen}
          options={{
            headerShown: true,
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#4A5568',
            headerBackTitleVisible: false,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="TeacherLogin"
          component={TeacherLoginScreen}
          options={{
            headerShown: true,
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#4A5568',
            headerBackTitleVisible: false,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="TeacherVerification"
          component={TeacherVerificationScreen}
          options={{
            headerShown: true,
            headerTitle: '',
            headerTransparent: true,
            headerTintColor: '#4A5568',
            headerBackTitleVisible: false,
            headerShadowVisible: false,
          }}
        />
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
            headerShown: true,
            headerTitle: 'Students List',
            headerTransparent: true,
            headerTintColor: '#4A5568',
            headerBackTitleVisible: false,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="TeacherCreateTest"
          component={TeacherCreateTestScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TeacherCreateClass"
          component={TeacherCreateClassScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TeacherReports"
          component={TeacherReportsScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TeacherSchedule"
          component={TeacherScheduleScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </TeacherProvider>
  );
}
