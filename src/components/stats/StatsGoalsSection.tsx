
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CircularGoalsProgress from '../../components/stats/CircularGoalProgress';
import GoalSelectionList from '../../components/goals/GoalSelectionList';
import WeeklyCheckinsBar from '../../components/goals/WeeklyCheckinsBar';
import { Button } from '../../components/ui/button';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

interface Props {
  allItems: any[];
  visibleItems: any[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  maxSelected: number;
  onCreate: () => void;
  allGoals: any[];
  allCheckins: any[];
  allCategories: any[];
  buildWeekMap: (goalId: string, checkins: any[]) => any;
}

export default function StatsGoalsSection({
  allItems,
  visibleItems,
  selectedIds,
  onToggle,
  maxSelected,
  onCreate,
  allGoals,
  allCheckins,
  allCategories,
  buildWeekMap,
}: Props) {
  return (
    <View>
      <View style={styles.chartWrapper}>
        <CircularGoalsProgress goals={visibleItems} />
      </View>

      <GoalSelectionList
        items={allItems}
        selectedIds={selectedIds}
        onToggle={onToggle}
        maxSelected={maxSelected}
      />

      <View style={styles.weekSection}>
        <Text style={styles.weekSectionTitle}>Check-ins de esta semana</Text>

        {visibleItems.length === 0 && (
          <Text style={styles.emptyText}>Selecciona al menos una meta para ver sus check-ins.</Text>
        )}

        {visibleItems.map((goalItem) => {
          const weekMap = buildWeekMap(goalItem.id, allCheckins);

          const goal = allGoals.find((g) => g.id === goalItem.id);
          const category = goal ? allCategories.find((c) => c.id === goal.category?.id) : undefined;
          const categoryColor = category?.color ?? goalItem.color ?? COLORS.PRIMARY;

          return (
            <View key={goalItem.id} style={styles.goalWeekCard}>
              <View style={styles.goalHeaderRow}>
                <View style={styles.goalColorDotWrapper}>
                  <View style={[styles.goalColorDot, { backgroundColor: categoryColor }]} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.goalTitle}>{goal?.title ?? goalItem.label}</Text>
                </View>

                <Text style={styles.goalPercentage}>{goalItem.percentage}%</Text>
              </View>

              <WeeklyCheckinsBar weekMap={weekMap} categoryColor={categoryColor} />
            </View>
          );
        })}
      </View>

      <Button style={styles.createGoalButton} onPress={onCreate}>Crear nueva meta</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  chartWrapper: { alignItems: 'center', marginBottom: 16 },
  weekSection: { marginTop: 8 },
  weekSectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.TEXT_PRIMARY, marginBottom: 12 },
  goalWeekCard: { borderRadius: 12, borderWidth: 1, borderColor: COLORS.BORDER_COLOR, backgroundColor: COLORS.BACKGROUND_SECONDARY, paddingVertical: 12, paddingHorizontal: 12, marginBottom: 12 },
  goalHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  goalColorDotWrapper: { marginRight: 8 },
  goalColorDot: { width: 14, height: 14, borderRadius: 999 },
  goalTitle: { fontSize: 14, fontWeight: '600', color: COLORS.TEXT_PRIMARY },
  goalPercentage: { fontSize: 14, fontWeight: '700', color: COLORS.PRIMARY, marginLeft: 8 },
  emptyText: { marginBottom: 8, fontSize: 13, color: COLORS.TEXT_MUTED, fontStyle: 'italic' },
  createGoalButton: { marginTop: 8, paddingHorizontal: 20 },
});
