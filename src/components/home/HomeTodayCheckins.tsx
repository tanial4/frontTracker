// src/components/home/HomeTodayCheckins.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SimpleCheckinButton from '../../components/goals/simpleCheckinCard';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

interface Props {
  visibleItems: any[];
  allGoals: any[];
  allCategories: any[];
  allCheckins: any[];    // 👈 ahora son TODOS los checkins normalizados
  currentUserId: string;
  onCheckin: (goalId: string) => void;
}

export default function HomeTodayCheckins({
  visibleItems,
  allGoals,
  allCategories,
  allCheckins,
  onCheckin,
}: Props) {
  // referencias de tiempo
  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const weekStart = React.useMemo(() => {
    const d = new Date(today);
    // inicio de semana: hoy - 6 días (últimos 7 días)
    d.setDate(d.getDate() - 6);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [today]);

  return (
    <View style={styles.todaySection}>
      <Text style={styles.todaySectionTitle}>Tus metas hoy</Text>

      {visibleItems.length === 0 ? (
        <Text style={styles.emptyText}>Selecciona metas para verlas aquí.</Text>
      ) : (
        visibleItems.map((goalItem) => {
          // encontrar la meta completa para saber su targetType
          const goal = allGoals.find((g) => g.id === goalItem.id);
          const targetType = goal?.targetType ?? 'DAILY';

          // 🔹 Filtrar checkins relevantes SEGÚN el tipo de meta
          const goalCheckins = allCheckins.filter((c) => {
            if (c.goalId !== goalItem.id) return false;

            const d = new Date(c.date);
            d.setHours(0, 0, 0, 0);

            if (targetType === 'DAILY') {
              // daily: solo cuenta si es HOY
              return d.getTime() === today.getTime();
            } else {
              // weekly: cuenta si está dentro de los últimos 7 días
              return d.getTime() >= weekStart.getTime() && d.getTime() <= today.getTime();
            }
          });

          const doneToday = goalCheckins.length > 0;

          // resolver color de categoría
          const category = goal
            ? allCategories.find((c) => c.id === goal.categoryId || c.id === goal.category?.id)
            : undefined;

          const categoryColor =
            category?.color ?? goalItem.color ?? COLORS.PRIMARY;

          return (
            <View key={goalItem.id} style={styles.goalCheckinRow}>
              <Text style={styles.goalName}>{goalItem.label}</Text>

              <SimpleCheckinButton
                hasCheckedInToday={doneToday}
                categoryColor={categoryColor}
                onCheckin={() => onCheckin(goalItem.id)}
              />
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  todaySection: {
    marginTop: 16,
  },
  todaySectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  goalCheckinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
  },
  goalName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
  },
  emptyText: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    fontStyle: 'italic',
  },
});
