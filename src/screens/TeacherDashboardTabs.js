import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import TeacherMainScreen from './TeacherMainScreen';
import TeacherClassesScreen from './TeacherClassesScreen';
import TeacherLibraryScreen from './TeacherLibraryScreen';
import TeacherProfileScreen from './TeacherProfileScreen';

const Tab = createBottomTabNavigator();

export default function TeacherDashboardTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Main') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Classes') {
                        iconName = focused ? 'business' : 'business-outline';
                    } else if (route.name === 'Library') {
                        iconName = focused ? 'library' : 'library-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#4299E1',
                tabBarInactiveTintColor: '#A0AEC0',
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#E2E8F0',
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 65,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: -5,
                }
            })}
        >
            <Tab.Screen name="Main" component={TeacherMainScreen} />
            <Tab.Screen name="Classes" component={TeacherClassesScreen} />
            <Tab.Screen name="Library" component={TeacherLibraryScreen} />
            <Tab.Screen name="Profile" component={TeacherProfileScreen} />
        </Tab.Navigator>
    );
}
