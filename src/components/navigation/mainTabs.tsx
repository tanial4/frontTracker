// src/components/navigation/MainTabs.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigationBar } from './navBar'; 


import ProfileScreen from '../../screens/profile/ProfileScreen';

import { RootTabParamList } from './types';
import MessagesStack from './MessagesStack';
import { StatsScreen } from '../../screens/stats/StatsScreen';
import { CreateGoalScreen } from '../../screens/goals/CreateGoalScreen';
import HomeScreen from '../../screens/home/HomeScreen';
import { Home } from 'lucide-react-native';
import HomeStackNavigator from './HomeStack';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigation }) => (
        <BottomNavigationBar
          activeRoute={state.routeNames[state.index] as any}
          onNavigate={(route) => navigation.navigate(route)}
        />
      )}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Messages" component={MessagesStack} />
      <Tab.Screen name="Rankings">
        {() => (
          <CreateGoalScreen onGoBack={() => {}} onGoalCreated={() => {}} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Profile">
        {() => (
          <ProfileScreen
            user={undefined as any}
            stats={{ achievements: 0, longestStreak: 0 }}
            onLogout={() => {}}
            onNavigate={() => {}}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
