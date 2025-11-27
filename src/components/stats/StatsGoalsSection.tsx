import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CircularGoalsProgress from '../../components/stats/CircularGoalProgress';
import GoalSelectionList from '../../components/goals/GoalSelectionList';
import WeeklyCheckinsBar from '../../components/goals/WeeklyCheckinsBar'; // Asegúrate de que la ruta de importación sea correcta
import { Button } from '../../components/ui/button';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

interface Props {
  // Datos para la gráfica y la lista de selección
  allItems: any[];
  visibleItems: any[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  maxSelected: number;
  
  // Acción de navegación
  onCreate: () => void;

  // Datos crudos necesarios para calcular el detalle semanal
  allGoals: any[];
  allCheckins: any[];
  allCategories: any[];
  
  // Función inyectada desde el padre para transformar el historial de check-ins
  // en un mapa de días { L: true, M: false... } para la barra visual.
  buildWeekMap: (goalId: string, checkins: any[]) => any;
}

// Componente organizador para la pantalla de Estadísticas.
// Combina la visión macro (Gráfica Circular) con la visión micro (Barras semanales por meta).
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
      {/* 1. Gráfica Circular: Muestra el % general de las metas seleccionadas */}
      <View style={styles.chartWrapper}>
        <CircularGoalsProgress goals={visibleItems} />
      </View>

      {/* 2. Filtro: Permite al usuario elegir qué metas analizar */}
      <GoalSelectionList
        items={allItems}
        selectedIds={selectedIds}
        onToggle={onToggle}
        maxSelected={maxSelected}
      />

      {/* 3. Desglose Semanal: Muestra el detalle día a día para cada meta visible */}
      <View style={styles.weekSection}>
        <Text style={styles.weekSectionTitle}>Check-ins de esta semana</Text>

        {visibleItems.length === 0 && (
          <Text style={styles.emptyText}>Selecciona al menos una meta para ver sus check-ins.</Text>
        )}

        {visibleItems.map((goalItem) => {
          // Calculamos el mapa de la semana usando la función utilitaria
          const weekMap = buildWeekMap(goalItem.id, allCheckins);

          // Resolución de datos completos (título real y categoría) para el estilo
          const goal = allGoals.find((g) => g.id === goalItem.id);
          const category = goal ? allCategories.find((c) => c.id === goal.category?.id) : undefined;
          
          // Fallback de color: Categoría -> Color del Item -> Primario
          const categoryColor = category?.color ?? goalItem.color ?? COLORS.PRIMARY;

          return (
            <View key={goalItem.id} style={styles.goalWeekCard}>
              {/* Encabezado de la tarjeta: Punto de color, Título y % */}
              <View style={styles.goalHeaderRow}>
                <View style={styles.goalColorDotWrapper}>
                  <View style={[styles.goalColorDot, { backgroundColor: categoryColor }]} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.goalTitle}>{goal?.title ?? goalItem.label}</Text>
                </View>

                <Text style={styles.goalPercentage}>{goalItem.percentage}%</Text>
              </View>

              {/* Barra visual de los 7 días (L M X J V S D) */}
              <WeeklyCheckinsBar weekMap={weekMap} categoryColor={categoryColor} />
            </View>
          );
        })}
      </View>

      {/* 4. Botón inferior para añadir nuevas metas */}
      <Button style={styles.createGoalButton} onPress={onCreate}>Crear nueva meta</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  chartWrapper: { 
    alignItems: 'center', 
    marginBottom: 16 
  },
  
  weekSection: { 
    marginTop: 8 
  },
  weekSectionTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: COLORS.TEXT_PRIMARY, 
    marginBottom: 12 
  },
  
  // Tarjeta individual para el detalle semanal
  goalWeekCard: { 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: COLORS.BORDER_COLOR, 
    backgroundColor: COLORS.BACKGROUND_SECONDARY, 
    paddingVertical: 12, 
    paddingHorizontal: 12, 
    marginBottom: 12 
  },
  
  goalHeaderRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  goalColorDotWrapper: { 
    marginRight: 8 
  },
  goalColorDot: { 
    width: 14, 
    height: 14, 
    borderRadius: 999 
  },
  goalTitle: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: COLORS.TEXT_PRIMARY 
  },
  goalPercentage: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: COLORS.PRIMARY, 
    marginLeft: 8 
  },
  
  emptyText: { 
    marginBottom: 8, 
    fontSize: 13, 
    color: COLORS.TEXT_MUTED, 
    fontStyle: 'italic' 
  },
  createGoalButton: { 
    marginTop: 8, 
    paddingHorizontal: 20 
  },
});