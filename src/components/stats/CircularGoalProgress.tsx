// src/components/stats/CircularGoalProgress.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Circle, Text as SvgText } from 'react-native-svg';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

export type GoalProgressItem = {
  categoryId: any;
  id: string;
  label: string;      // Nombre corto para la leyenda (Ej: "Correr")
  percentage: number; // Valor de 0 a 100 que representa el progreso actual
  color: string;      // Color temático para el anillo
};

interface CircularGoalsProgressProps {
  // Lista de metas a graficar. El componente corta automáticamente a las primeras 5.
  goals: GoalProgressItem[];  
  // Tamaño total del canvas cuadrado (ancho y alto en píxeles). Default: 320.
  size?: number;              
}

// Componente de visualización de datos complejo.
// Dibuja múltiples anillos concéntricos usando SVG para mostrar el progreso simultáneo de varias metas.
// Inspirado en los anillos de actividad de Apple Watch.
export const CircularGoalsProgress: React.FC<CircularGoalsProgressProps> = ({
  goals,
  size = 320,
}) => {
  // Limitamos a 5 anillos para mantener la legibilidad y evitar que el radio interior sea negativo
  const visibleGoals = goals.slice(0, 5);

  const center = size / 2;
  const ringWidth = 12; // Grosor del trazo
  const ringGap = 6;    // Espacio entre anillos
  const baseRadius = center - 20; // Radio inicial (anillo más externo)

  // Configuración del arco:
  // Usamos 270 grados (3/4 de círculo) para dejar una apertura en la parte inferior,
  // lo que da un aspecto de "tacómetro" y evita solapamiento visual en los extremos.
  const sweepAngle = 270;
  
  // Rotación inicial para que el arco empiece abajo a la izquierda (-225 grados)
  const rotationOffset = -225; 

  // Cálculo del promedio general para mostrar en el centro
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
            
            // 1. Cálculo geométrico del anillo actual
            // Cada iteración reduce el radio para dibujar el siguiente anillo más adentro
            const radius = baseRadius - index * (ringWidth + ringGap);
            const circumference = 2 * Math.PI * radius;
            
            // Aseguramos que el progreso esté entre 0 y 100
            const progress = Math.max(0, Math.min(goal.percentage, 100));
            
            // Dasharray define la longitud total del trazo disponible (la circunferencia completa)
            const strokeDasharray = circumference;

            // 2. Fondo del anillo (Gris estático)
            // Calculamos cuánto "esconder" del trazo para que solo se dibuje el arco de 270 grados.
            // (1 - 270/360) = 0.25 -> Ocultamos el 25% del círculo.
            const baseOffset = circumference * (1 - sweepAngle / 360);

            // 3. Progreso (Color dinámico)
            // Calculamos qué fracción del arco visible (sweepAngle) representa el porcentaje de la meta.
            // Ejemplo: Si progress es 50%, queremos llenar la mitad de los 270 grados.
            const progressFactor = (progress * sweepAngle) / (360 * 100);
            
            // Offset final para la animación del progreso
            const strokeDashoffset = strokeDasharray * (1 - progressFactor);

            return (
              <G
                key={goal.id}
                rotation={rotationOffset}
                originX={center}
                originY={center}
              >
                {/* Capa de Fondo (Track): Muestra el recorrido total disponible en gris tenue */}
                <Circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={COLORS.INPUT_BACKGROUND}
                  strokeWidth={ringWidth}
                  strokeLinecap="round" // Bordes redondeados para estética suave
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={baseOffset}
                />

                {/* Capa de Progreso (Fill): Muestra el avance actual en color */}
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

          {/* Elemento decorativo central (Círculo blanco sólido) */}
          <Circle
            cx={center}
            cy={center}
            r={center * 0.22}
            fill={COLORS.BACKGROUND_DEFAULT}
          />

          {/* Texto Central: Promedio General */}
          <SvgText
            x={center}
            y={center - 4} // Ajuste fino vertical
            fontSize={30}
            fontWeight="700"
            fill={COLORS.PRIMARY}
            textAnchor="middle" // Centrado horizontal SVG
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

      {/* Leyenda inferior para identificar qué color corresponde a qué meta */}
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
    flexWrap: 'wrap', // Permite que los items bajen de línea si no caben
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