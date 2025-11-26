// src/components/goals/GoalsStreaksSegmentBar.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

// Definimos las claves para manejar el estado de la vista (Metas vs Rachas)
export type SegmentKey = 'goals' | 'streaks';

interface GoalsStreaksSegmentBarProps {
  // Estado actual seleccionado
  activeSegment: SegmentKey;
  // Callback para cambiar la pestaña
  onChange: (segment: SegmentKey) => void;
  // Contadores para mostrar en los badges (números pequeños al lado del texto)
  goalsCount: number;
  streaksCount: number;
}

// Componente de navegación tipo "Toggle" o pestañas.
// Permite alternar la lista principal entre las Metas activas y el historial de Rachas.
export function GoalsStreaksSegmentBar({
  activeSegment,
  onChange,
  goalsCount,
  streaksCount,
}: GoalsStreaksSegmentBarProps) {
  return (
    <View style={styles.container}>
      
      {/* Pestaña: Metas */}
      <TouchableOpacity
        style={[
          styles.segment,
          // Estilo condicional: Fondo blanco si está activo, transparente si no
          activeSegment === 'goals' && styles.segmentActive,
        ]}
        activeOpacity={0.8}
        onPress={() => onChange('goals')}
      >
        <Text
          style={[
            styles.segmentText,
            // Estilo condicional: Texto más oscuro y grueso si está activo
            activeSegment === 'goals' && styles.segmentTextActive,
          ]}
        >
          Metas
        </Text>

        {/* Badge con contador de metas */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{goalsCount}</Text>
        </View>
      </TouchableOpacity>

      {/* Pestaña: Rachas */}
      <TouchableOpacity
        style={[
          styles.segment,
          activeSegment === 'streaks' && styles.segmentActive,
        ]}
        activeOpacity={0.8}
        onPress={() => onChange('streaks')}
      >
        <Text
          style={[
            styles.segmentText,
            activeSegment === 'streaks' && styles.segmentTextActive,
          ]}
        >
          Rachas
        </Text>

        {/* Badge con contador de rachas */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{streaksCount}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// -------------------------------------------------------------
// ESTILOS
// -------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    borderRadius: 999, // Bordes completamente redondos (estilo cápsula)
    padding: 4,
    marginHorizontal: 20,
  },
  segment: {
    flex: 1, // Divide el espacio equitativamente (50% cada uno)
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 8,
    paddingVertical: 8,
    borderRadius: 999,
  },
  segmentActive: {
    backgroundColor: COLORS.BACKGROUND_DEFAULT, // Fondo blanco para indicar selección
  },
  segmentText: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
  },
  segmentTextActive: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  badge: {
    minWidth: 22,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: COLORS.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default GoalsStreaksSegmentBar;