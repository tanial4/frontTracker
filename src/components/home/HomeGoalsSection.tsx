import React from 'react';
import { View, StyleSheet } from 'react-native';
import CircularGoalsProgress from '../../components/stats/CircularGoalProgress';
import GoalSelectionList from '../../components/goals/GoalSelectionList';
import { Button } from '../../components/ui/button';

interface Props {
  // Lista completa de metas con su progreso calculado
  allItems: any[]; 
  
  // Subconjunto de metas que se están mostrando actualmente en la gráfica
  // (basado en la selección de selectedIds)
  visibleItems: any[]; 
  
  selectedIds: string[];
  // Función para manejar la selección/deselección de metas
  onToggle: (id: string) => void;
  // Límite de metas seleccionables simultáneamente
  maxSelected: number;
  
  // Acción para navegar al flujo de creación
  onCreate: () => void;
}

// Componente orquestador para la sección de "Mis Metas" en el Home.
// Estructura visualmente la relación entre la gráfica de progreso y la lista de control.
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
      {/* 1. Visualización de Datos (Gráfica) */}
      <View style={styles.chartWrapper}>
        {/* Solo pasamos los items visibles para no saturar la visualización circular */}
        <CircularGoalsProgress goals={visibleItems} />
      </View>

      {/* 2. Control de Datos (Lista de Selección) */}
      <GoalSelectionList
        items={allItems}
        selectedIds={selectedIds}
        onToggle={onToggle}
        maxSelected={maxSelected}
      />

      {/* 3. Acción Principal (Crear) */}
      <Button style={styles.createGoalButton} onPress={onCreate}>
        Crear nueva meta
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  chartWrapper: {
    alignItems: 'center',
    marginBottom: 16, // Separación entre la gráfica y la lista
  },
  createGoalButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    alignSelf: 'center', // Centrado horizontalmente en el contenedor padre
  },
});