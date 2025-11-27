import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import StreakCard from '../../components/goals/goalCheckinCard';

interface Props {
  streakItems: any[];
  onContinue: (id: string) => void;
}

export default function StatsStreaksSection({ streakItems, onContinue }: Props) {
  const hasStreaks = streakItems.length > 0;

  if (!hasStreaks) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Aún no tienes rachas</Text>
        <Text style={styles.emptySubtitle}>Crea o únete a una racha para empezar a competir con tus amigos.</Text>
      </View>
    );
  }

  return (
    <>
      <Text style={styles.streaksTitle}>Tus rachas</Text>
      {streakItems.map((streak) => (
        <StreakCard key={streak.id} streak={streak} onContinue={(id: string) => onContinue(id)} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 24,
  },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: COLORS.TEXT_PRIMARY, marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: COLORS.TEXT_MUTED, textAlign: 'center' },
  streaksTitle: { fontSize: 18, fontWeight: '600', color: COLORS.TEXT_PRIMARY, marginBottom: 12 },
});
