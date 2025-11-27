import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

// Definimos las claves exactas para los días (Lunes a Domingo)
export type WeekDayKey = 'L' | 'M' | 'X' | 'J' | 'V' | 'S' | 'D';

// Mapa de estado: Relaciona cada día con un booleano (true = completado)
export type WeekCheckinMap = Record<WeekDayKey, boolean>;

interface WeeklyCheckinsBarProps {
  weekMap: WeekCheckinMap;
  // Color temático para rellenar los días completados (se recibe desde la meta/categoría)
  categoryColor: string;    
}

// Array estático para garantizar el orden de renderizado de Lunes a Domingo,
// independientemente del orden de las claves en el objeto weekMap.
const DAY_ORDER: WeekDayKey[] = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

// Componente visual pequeño que muestra una fila de 7 indicadores.
// Útil para tarjetas de resumen o vistas de detalle de meta.
export const WeeklyCheckinsBar: React.FC<WeeklyCheckinsBarProps> = ({
  weekMap,
  categoryColor,
}) => {
  return (
    <View style={styles.container}>
      {DAY_ORDER.map((dayKey) => {
        // Verificamos si el día específico está marcado como completado
        const isDone = weekMap[dayKey];

        return (
          <View
            key={dayKey}
            style={[
              styles.dayBox,
              {
                // Lógica de Estilo Condicional para el contenedor:
                // - Si está hecho: Fondo sólido del color de la categoría.
                // - Si está pendiente: Fondo gris neutro (input background).
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
                  // Lógica de Estilo Condicional para el texto:
                  // - Si está hecho: Texto blanco para contraste sobre color sólido.
                  // - Si está pendiente: Texto gris tenue.
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
    gap: 6, // Espaciado uniforme entre los días
  },
  dayBox: {
    flex: 1, // Permite que cada caja ocupe el mismo ancho disponible
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