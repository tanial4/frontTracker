import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigationBar } from './navBar'; 


import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout as apiLogout } from '../../services/authApi';
import { useNavigation } from '@react-navigation/native';

import { RootTabParamList } from './types';
import MessagesStack from './MessagesStack';
import { StatsScreen } from '../../screens/stats/StatsScreen';
import { CreateGoalScreen } from '../../screens/goals/CreateGoalScreen';
import HomeStackNavigator from './HomeStack';
import { ProfileScreenContainer } from '../../screens/profile/ProfileScreenContainer';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function MainTabs() {
  const navigation = useNavigation();

  async function logoutFunction() {
    try {
      // call backend logout if available
      await apiLogout();
    } catch (e) {
      // ignore network errors but log
      console.warn('api logout failed', e);
    }

    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'currentUser']);
    } catch (e) {
      console.warn('clear storage failed', e);
    }

    // Reset navigation to the auth/login screen. If the root navigator registers a 'Login'
    // route this will move the user there. Use a best-effort approach.
    try {
      (navigation as any).reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (e) {
      // Fallback: try navigate
      try {
        (navigation as any).navigate('Login');
      } catch (err) {
        console.warn('navigation to Login failed', err);
      }
    }
  }
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
        {(props) => (
          <ProfileScreenContainer
            {...props}
            onLogout={logoutFunction}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
