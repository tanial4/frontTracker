import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SimpleCheckinButton from '../../components/goals/simpleCheckinCard';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

interface Props {
  // Items simplificados que se muestran en la gráfica circular
  visibleItems: any[]; 
  // Objetos completos de meta para buscar relaciones (categorías, descripciones, etc.)
  allGoals: any[]; 
  // Lista de categorías para resolver colores temáticos
  allCategories: any[];
  // Historial completo de registros (mocks o reales)
  allCheckins: any[]; 
  currentUserId: string;
  // Acción al pulsar el botón de check-in
  onCheckin: (goalId: string) => void;
}

// Sección de "Agenda Diaria" en el Home.
// Muestra una lista plana de las metas seleccionadas con un botón de acción rápida para marcar el progreso del día.
export default function HomeTodayCheckins({
  visibleItems,
  allGoals,
  allCategories,
  allCheckins,
  currentUserId,
  onCheckin,
}: Props) {
  return (
    <View style={styles.todaySection}>
      <Text style={styles.todaySectionTitle}>Tus metas hoy</Text>

      {/* Estado vacío: Si el usuario desmarcó todas las metas en el filtro */}
      {visibleItems.length === 0 ? (
        <Text style={styles.emptyText}>Selecciona metas para verlas aquí.</Text>
      ) : (
        visibleItems.map((goalItem) => {
          
          // 1. Lógica de Estado: Determinar si la meta ya se cumplió hoy.
          // Filtramos el historial buscando registros de este usuario para esta meta específica.
          const goalCheckins = allCheckins.filter(
            (c) => c.goalId === goalItem.id && c.userId === currentUserId
          );

          // Si existe algún registro con fecha válida (date/createdAt) o marcado como done, consideramos la meta como hecha.
          const doneToday = goalCheckins.some((c) => !!(c.checkedAt || c.date || c.createdAt || c.done));

          // 2. Lógica de Diseño: Resolver el color de la categoría.
          // Buscamos el objeto "Goal" completo y luego su categoría asociada.
          const goal = allGoals.find((g) => g.id === goalItem.id);
          const category = goal
            ? allCategories.find((c) => c.id === goal.category?.id)
            : undefined;

          // Cadena de fallback para el color: Categoría -> Color del Item -> Color Primario por defecto
          const categoryColor = category?.color ?? goalItem.color ?? COLORS.PRIMARY;

          return (
            <View key={goalItem.id} style={styles.goalCheckinRow}>
              <Text style={styles.goalName}>{goalItem.label}</Text>

              {/* Botón modular que maneja la interacción visual del check/uncheck */}
              <SimpleCheckinButton
                hasCheckedInToday={doneToday}
                categoryColor={categoryColor}
                onCheckin={() => onCheckin(goalItem.id)}
              />
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  todaySection: {
    marginTop: 16,
  },
  todaySectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  goalCheckinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    // Línea divisoria sutil entre filas
    borderBottomWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
  },
  goalName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
  },
  emptyText: {
    marginTop: 4,
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    fontStyle: 'italic',
  },
});