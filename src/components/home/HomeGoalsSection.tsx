import React from 'react';
import { View, StyleSheet } from 'react-native';
import CircularGoalsProgress from '../../components/stats/CircularGoalProgress';
import GoalSelectionList from '../../components/goals/GoalSelectionList';
import { Button } from '../../components/ui/button';

interface Props {
  allItems: any[]; // goal progress items
  visibleItems: any[]; // items currently selected to show in chart/checkin
  selectedIds: string[];
  onToggle: (id: string) => void;
  maxSelected: number;
  onCreate: () => void;
}

export default function HomeGoalsSection({
  allItems,
  visibleItems,
  selectedIds,
  onToggle,
  maxSelected,
  onCreate,
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

      <Button style={styles.createGoalButton} onPress={onCreate}>
        Crear nueva meta
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  chartWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  createGoalButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
});
