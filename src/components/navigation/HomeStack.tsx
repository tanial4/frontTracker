// src/components/navigation/HomeStack.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../../screens/home/HomeScreen';
import CreateGoalScreen from '../../screens/goals/CreateGoalScreen';

// 🧠 Rutas internas del stack de Home
export type HomeStackParamList = {
  HomeMain: undefined;
  CreateGoalScreen: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // usamos tus propios headers/layouts
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="CreateGoalScreen" component={CreateGoalScreen} />
    </Stack.Navigator>
  );
}

export default HomeStackNavigator;
