// src/components/goals/GoalSelectionList.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { CheckCircle2, Circle } from 'lucide-react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { GoalProgressItem } from '../stats/CircularGoalProgress';

interface GoalSelectionListProps {
  items: GoalProgressItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  maxSelected?: number;
}

export function GoalSelectionList({
  items,
  selectedIds,
  onToggle,
  maxSelected = 6,
}: GoalSelectionListProps) {
  const selectedCount = selectedIds.length;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Metas en la gráfica</Text>
        <Text style={styles.counter}>
          {selectedCount}/{maxSelected}
        </Text>
      </View>

      <View style={styles.list}>
        {items.map((goal) => {
          const isSelected = selectedIds.includes(goal.id);
          const isLimitReached = selectedCount >= maxSelected && !isSelected;

          return (
            <TouchableOpacity
              key={goal.id}
              activeOpacity={isLimitReached ? 1 : 0.8}
              onPress={() => {
                if (isLimitReached) return;
                onToggle(goal.id);
              }}
              style={[
                styles.item,
                isSelected && styles.itemSelected,
                isLimitReached && !isSelected && styles.itemDisabled,
              ]}
            >
              <View style={styles.leftRow}>
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: goal.color },
                  ]}
                />

                <View>
                  <Text
                    style={[
                      styles.label,
                      isSelected && styles.labelSelected,
                      isLimitReached && !isSelected && styles.labelDisabled,
                    ]}
                    numberOfLines={1}
                  >
                    {goal.label}
                  </Text>
                  <Text style={styles.subText}>
                    {goal.percentage}% completado
                  </Text>
                </View>
              </View>

              <View style={styles.rightRow}>
                {isSelected ? (
                  <CheckCircle2
                    size={20}
                    color={goal.color}
                  />
                ) : (
                  <Circle
                    size={20}
                    color={
                      isLimitReached
                        ? COLORS.TEXT_MUTED
                        : COLORS.BORDER_COLOR
                    }
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

interface Style {
  container: ViewStyle;
  headerRow: ViewStyle;
  title: TextStyle;
  counter: TextStyle;
  list: ViewStyle;
  item: ViewStyle;
  itemSelected: ViewStyle;
  itemDisabled: ViewStyle;
  leftRow: ViewStyle;
  rightRow: ViewStyle;
  colorDot: ViewStyle;
  label: TextStyle;
  labelSelected: TextStyle;
  labelDisabled: TextStyle;
  subText: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  counter: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  list: {
    gap: 6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  itemSelected: {
    backgroundColor: COLORS.PRIMARY + '10',
  },
  itemDisabled: {
    opacity: 0.5,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightRow: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    marginRight: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  labelSelected: {
    color: COLORS.PRIMARY,
  },
  labelDisabled: {
    color: COLORS.TEXT_MUTED,
  },
  subText: {
    fontSize: 11,
    color: COLORS.TEXT_MUTED,
  },
});

export default GoalSelectionList;
