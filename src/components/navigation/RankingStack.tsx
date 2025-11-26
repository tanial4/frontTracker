// src/navigation/stacks/RankingStack.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RankingsScreen from '../../screens/rankings/RankingScreen';



const Stack = createNativeStackNavigator();

export default function RankingStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Pantalla principal de rankings */}
      <Stack.Screen name="RankingsMain" component={RankingsScreen} />

      {/* Pantalla de detalles por categoría, meta o usuario */}
      {/* <Stack.Screen name="RankingDetails" component={RankingDetailsScreen} /> */}
    </Stack.Navigator>
  );
}
