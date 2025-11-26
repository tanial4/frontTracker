// src/screens/rankings/RankingsScreen.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MainLayout } from '../../components/layout/MainLayout';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

export default function RankingsScreen({ navigation }: any) {
  return (
    <MainLayout
      headerTitle="Rankings"
      activeRoute="Rankings"
      onNavigate={(route) => navigation.navigate(route)}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Ranking general</Text>
        <Text style={styles.subtitle}>
          Aquí luego mostramos tablas de posiciones, amigos, global, etc.
        </Text>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
  },
});
