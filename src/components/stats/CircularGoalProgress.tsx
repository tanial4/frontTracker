// src/components/stats/CircularGoalsProgress.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Circle, Text as SvgText } from 'react-native-svg';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

export type GoalProgressItem = {
  categoryId: any;
  id: string;
  label: string;      // Ej: "Pomodoro"
  percentage: number; // 0–100
  color: string;      // Color del anillo
};

interface CircularGoalsProgressProps {
  goals: GoalProgressItem[];  // Máx 5 metas (el componente corta solo)
  size?: number;              // Tamaño del gráfico (px)
}

export const CircularGoalsProgress: React.FC<CircularGoalsProgressProps> = ({
  goals,
  size = 320,
}) => {
  // Enforzar máximo de 5 metas
  const visibleGoals = goals.slice(0, 5);

  const center = size / 2;
  const ringWidth = 12;
  const ringGap = 6;
  const baseRadius = center - 20; // radio del anillo más externo

  // Ángulo visible: usamos 270° para que quede "abierto" abajo
  const sweepAngle = 270;
  const rotationOffset = -225; // arranca abajo-izquierda

  const average =
    visibleGoals.length > 0
      ? Math.round(
          visibleGoals.reduce((acc, g) => acc + g.percentage, 0) /
            visibleGoals.length
        )
      : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progreso hacia tus metas</Text>

      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          {visibleGoals.map((goal, index) => {
            const radius =
              baseRadius - index * (ringWidth + ringGap);

            const circumference = 2 * Math.PI * radius;
            const progress = Math.max(
              0,
              Math.min(goal.percentage, 100)
            );
            const strokeDasharray = circumference;

            // Para el fondo (gris) solo dibujamos el arco de 270°
            const baseOffset =
              circumference * (1 - sweepAngle / 360);

            // Para el progreso, tomamos fracción del sweepAngle según porcentaje
            const progressFactor = (progress * sweepAngle) / (360 * 100);
            const strokeDashoffset =
              strokeDasharray * (1 - progressFactor);

            return (
              <G
                key={goal.id}
                rotation={rotationOffset}
                originX={center}
                originY={center}
              >
                {/* Fondo gris del anillo (arco incompleto) */}
                <Circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={COLORS.INPUT_BACKGROUND}
                  strokeWidth={ringWidth}
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={baseOffset}
                />

                {/* Progreso de la meta */}
                <Circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={goal.color}
                  strokeWidth={ringWidth}
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                />
              </G>
            );
          })}

          {/* Círculo central */}
          <Circle
            cx={center}
            cy={center}
            r={center * 0.22}
            fill={COLORS.BACKGROUND_DEFAULT}
          />

          {/* Texto central: promedio general */}
          <SvgText
            x={center}
            y={center - 4}
            fontSize={30}
            fontWeight="700"
            fill={COLORS.PRIMARY}
            textAnchor="middle"
          >
            {average}%
          </SvgText>
          <SvgText
            x={center}
            y={center + 20}
            fontSize={13}
            fill={COLORS.TEXT_MUTED}
            textAnchor="middle"
          >
            General
          </SvgText>
        </Svg>
      </View>

      {/* Leyenda inferior */}
      <View style={styles.legendContainer}>
        {visibleGoals.map((goal) => (
          <View key={goal.id} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: goal.color },
              ]}
            />
            <Text style={styles.legendLabel}>{goal.label}</Text>
            <Text style={styles.legendPercentage}>
              {goal.percentage}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ------------------ ESTILOS ------------------ //

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  legendContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
    marginVertical: 2,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 12,
    color: COLORS.TEXT_PRIMARY,
    marginRight: 4,
  },
  legendPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
});

export default CircularGoalsProgress;
