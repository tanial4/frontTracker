import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import StreakCard from '../../components/goals/goalCheckinCard';

interface Props {
  streakItems: any[];
  onContinue: (id: string) => void;
  onCreateStreak: () => void; // Nuevo handler para navegación
}

export default function StatsStreaksSection({
  streakItems,
  onContinue,
  onCreateStreak,
}: Props) {
  const hasStreaks = streakItems.length > 0;

  // Si NO hay rachas, mostramos mensaje + botón
  if (!hasStreaks) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Aún no tienes rachas</Text>
        <Text style={styles.emptySubtitle}>
          Crea o únete a una racha para empezar a competir con tus amigos.
        </Text>

        <TouchableOpacity style={styles.createButton} onPress={onCreateStreak}>
          <Text style={styles.createButtonText}>Crear racha</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Si hay rachas, mostramos listado + botón arriba
  return (
    <>
      <View style={styles.headerRow}>
        <Text style={styles.streaksTitle}>Tus rachas</Text>

        <TouchableOpacity style={styles.createSmallBtn} onPress={onCreateStreak}>
          <Text style={styles.createSmallBtnText}>Nueva</Text>
        </TouchableOpacity>
      </View>

      {streakItems.map((streak) => (
        <StreakCard
          key={streak.id}
          streak={streak}
          onContinue={(id: string) => onContinue(id)}
        />
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
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    marginBottom: 16,
  },

  // Botón principal dentro del estado vacío
  createButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 10,
  },
  createButtonText: {
    color: COLORS.BACKGROUND_DEFAULT,
    fontWeight: '700',
    fontSize: 15,
  },

  // Header cuando hay rachas
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  streaksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },

  // Botón pequeño "Nueva"
  createSmallBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: COLORS.PRIMARY,
  },
  createSmallBtnText: {
    color: COLORS.BACKGROUND_DEFAULT,
    fontSize: 14,
    fontWeight: '600',
  },
});
