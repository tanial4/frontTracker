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
  // Lista de metas disponibles para mostrar en la gráfica
  items: GoalProgressItem[];
  // Array de IDs que están actualmente activos/visibles
  selectedIds: string[];
  // Función para agregar o quitar un ID del array
  onToggle: (id: string) => void;
  // Límite máximo de elementos seleccionables (por defecto 6 para no saturar la UI)
  maxSelected?: number;
}

// Componente de lista de selección múltiple con límite.
// Se usa para filtrar qué metas aparecen en las gráficas de estadísticas o en el resumen del home.
export function GoalSelectionList({
  items,
  selectedIds,
  onToggle,
  maxSelected = 6,
}: GoalSelectionListProps) {
  
  const selectedCount = selectedIds.length;

  return (
    <View style={styles.container}>
      {/* Cabecera con contador de selección (ej: 3/6) */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Metas en la gráfica</Text>
        <Text style={styles.counter}>
          {selectedCount}/{maxSelected}
        </Text>
      </View>

      <View style={styles.list}>
        {items.map((goal) => {
          const isSelected = selectedIds.includes(goal.id);
          
          // Lógica de bloqueo:
          // Si ya alcanzamos el límite Y este ítem NO está seleccionado,
          // entonces debe bloquearse para impedir nuevas selecciones.
          const isLimitReached = selectedCount >= maxSelected && !isSelected;

          return (
            <TouchableOpacity
              key={goal.id}
              // Quitamos el feedback táctil si está deshabilitado para indicar que no es interactuable
              activeOpacity={isLimitReached ? 1 : 0.8}
              onPress={() => {
                // Prevenir acción si se alcanzó el límite y no es un item seleccionado
                if (isLimitReached) return;
                onToggle(goal.id);
              }}
              style={[
                styles.item,
                isSelected && styles.itemSelected,
                // Aplicamos estilo visual de "deshabilitado" (opacidad reducida)
                isLimitReached && !isSelected && styles.itemDisabled,
              ]}
            >
              <View style={styles.leftRow}>
                {/* Punto de color que corresponde a la línea en la gráfica circular */}
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

              {/* Checkbox visual a la derecha */}
              <View style={styles.rightRow}>
                {isSelected ? (
                  <CheckCircle2
                    size={20}
                    color={goal.color}
                  />
                ) : (
                  <Circle
                    size={20}
                    // Color tenue si está deshabilitado, normal si es seleccionable
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

// Definición estricta de tipos para los estilos
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
    // Fondo sutil usando opacidad hexadecimal sobre el color primario
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