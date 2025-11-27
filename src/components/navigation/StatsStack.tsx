// src/components/navigation/StatsStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StatsScreen from '../../screens/stats/StatsScreen';
import CreateGoalScreen from '../../screens/goals/CreateGoalScreen';
import StreakDetailScreen from '../../screens/streaks/StreakDetailScreen';


// Todas las rutas internas del stack de Stats
export type StatsStackParamList = {
  StatsMain: undefined;
  CreateGoal: undefined;
  StreakDetail: { streakId: string }; // pasas la racha que quieras ver
};

const Stack = createNativeStackNavigator<StatsStackParamList>();

export default function StatsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StatsMain" component={StatsScreen} />
      <Stack.Screen name="CreateGoal" component={CreateGoalScreen} />
      <Stack.Screen name="StreakDetail" component={StreakDetailScreen} />
    </Stack.Navigator>
  );
}
