// src/components/stats/WeeklyCheckinsBar.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

export type WeekDayKey = 'L' | 'M' | 'X' | 'J' | 'V' | 'S' | 'D';

export type WeekCheckinMap = Record<WeekDayKey, boolean>;

interface WeeklyCheckinsBarProps {
  weekMap: WeekCheckinMap;
  categoryColor: string;     // <<–– color de la categoría
}

const DAY_ORDER: WeekDayKey[] = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export const WeeklyCheckinsBar: React.FC<WeeklyCheckinsBarProps> = ({
  weekMap,
  categoryColor,
}) => {
  return (
    <View style={styles.container}>
      {DAY_ORDER.map((dayKey) => {
        const isDone = weekMap[dayKey];

        return (
          <View
            key={dayKey}
            style={[
              styles.dayBox,
              {
                backgroundColor: isDone
                  ? categoryColor
                  : COLORS.INPUT_BACKGROUND,

                borderColor: isDone
                  ? categoryColor
                  : COLORS.BORDER_COLOR,
              },
            ]}
          >
            <Text
              style={[
                styles.dayLabel,
                {
                  color: isDone
                    ? COLORS.BACKGROUND_DEFAULT
                    : COLORS.TEXT_MUTED,
                },
              ]}
            >
              {dayKey}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

// ------------------ ESTILOS ------------------ //

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  dayBox: {
    flex: 1,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default WeeklyCheckinsBar;
