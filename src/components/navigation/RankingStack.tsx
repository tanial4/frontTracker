import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import PublicProfileScreen from '../../screens/profile/PublicProfileScreen';
import RankingsScreen from '../../screens/rankings/RankingScreen';

export type RankingsStackParamList = {
  RankingsHome: undefined;
  PublicProfile: { userId: string };
};

const Stack = createNativeStackNavigator<RankingsStackParamList>();

export default function RankingsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RankingsHome" component={RankingsScreen} />
      <Stack.Screen name="PublicProfile" component={PublicProfileScreen} />
    </Stack.Navigator>
  );
}
