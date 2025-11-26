import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SimpleCheckinButton from '../../components/goals/simpleCheckinCard';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

interface Props {
  visibleItems: any[]; // goalProgress items shown in chart and checkin
  allGoals: any[]; // full goal objects to lookup details
  allCategories: any[];
  allCheckins: any[]; // mock checkins
  currentUserId: string;
  onCheckin: (goalId: string) => void;
}

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
          const goalCheckins = allCheckins.filter(
            (c) => c.goalId === goalItem.id && c.userId === currentUserId
          );

          const doneToday = goalCheckins.some((c) => !!c.checkedAt);

          const goal = allGoals.find((g) => g.id === goalItem.id);
          const category = goal
            ? allCategories.find((c) => c.id === goal.category?.id)
            : undefined;

          const categoryColor = category?.color ?? goalItem.color ?? COLORS.PRIMARY;

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
