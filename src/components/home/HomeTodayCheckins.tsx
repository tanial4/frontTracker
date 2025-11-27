import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SimpleCheckinButton from '../../components/goals/simpleCheckinCard';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { GoalCheckinResponse } from '../../services/checkinsApi';

interface Props {
  visibleItems: any[];
  allGoals: any[];
  allCategories: any[];
  allCheckins: GoalCheckinResponse[];
  currentUserId: string;
  onCheckin: (goalId: string) => void;
}

// helper: compara sólo por YYYY-MM-DD (sin husos horarios)
const isToday = (dateStr: string) => {
  if (!dateStr) return false;

  // lo que viene del backend: '2025-11-27T00:00:00.000Z' → '2025-11-27'
  const checkinDate = dateStr.slice(0, 10);

  // hoy en local, formateado manualmente a 'YYYY-MM-DD'
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayLocal = `${year}-${month}-${day}`;

  return checkinDate === todayLocal;
};

export default function HomeTodayCheckins({
  visibleItems,
  allGoals,
  allCategories,
  allCheckins,
  currentUserId,
  onCheckin,
}: Props) {
  return (
    <View style={styles.todaySection}>
      <Text style={styles.todaySectionTitle}>Tus metas hoy</Text>

      {visibleItems.length === 0 ? (
        <Text style={styles.emptyText}>Selecciona metas para verlas aquí.</Text>
      ) : (
        visibleItems.map((goalItem) => {
          // Checkins de ESTA meta y ESTE usuario
          const goalCheckinsForUser = allCheckins.filter(
            (c) => c.goalId === goalItem.id && c.userId === currentUserId
          );

          // Solo los de HOY (comparando por fecha sin hora)
          const goalCheckinsToday = goalCheckinsForUser.filter((c) =>
            isToday(c.date)
          );

          // 🔍 Debug si quieres seguir viendo
          console.log('Goal', goalItem.id, 'checkins user', currentUserId, {
            goalCheckinsForUser,
            goalCheckinsToday,
          });

          // Si hay al menos uno hoy (y opcionalmente done === true), la meta ya está marcada
          const doneToday =
            goalCheckinsToday.length > 0 &&
            goalCheckinsToday.some((c) => c.done === true);

          // Resolver color
          const goal = allGoals.find((g) => g.id === goalItem.id);
          const category = goal
            ? allCategories.find(
                (c) => c.id === goal.category?.id || c.id === goal.categoryId
              )
            : undefined;

          const categoryColor =
            category?.color ?? goalItem.color ?? COLORS.PRIMARY;

          return (
            <View key={goalItem.id} style={styles.goalCheckinRow}>
              <Text style={styles.goalName}>{goalItem.label}</Text>

              <SimpleCheckinButton
                hasCheckedInToday={doneToday}
                categoryColor={categoryColor}
                onCheckin={() => {
                  if (!doneToday) {
                    onCheckin(goalItem.id);
                  }
                }}
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
