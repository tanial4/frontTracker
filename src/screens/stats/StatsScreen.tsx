// src/screens/stats/StatsScreen.tsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

import { MainLayout } from '../../components/layout/MainLayout';

import { MOCK_USERS } from '../../data/TestUserData';
import { MOCK_GOALS, MOCK_GOAL_CHECKINS } from '../../data/TestGoalsData';
import { MOCK_CATEGORIES } from '../../data/Categories';

import CircularGoalsProgress from '../../components/stats/CircularGoalProgress';
import { buildGoalProgressForUser } from '../../lib/goalProgress';
import { buildWeekCheckinMapForGoal } from '../../lib/weekHelpers';
import WeeklyCheckinsBar from '../../components/goals/WeeklyCheckinsBar';
import GoalSelectionList from '../../components/goals/GoalSelectionList';
import { Button } from '../../components/ui/button';
import GoalsStreaksSegmentBar from '../../components/goals/goalsStreakSegmentBar';



const CURRENT_USER_ID = MOCK_USERS[0].id;
const MAX_SELECTED = 6;

type SegmentKey = 'goals' | 'streaks';

export function StatsScreen() {
  const navigation = useNavigation<any>();

  // Progreso general de las metas
  const goalProgressItems = useMemo(
    () =>
      buildGoalProgressForUser(
        CURRENT_USER_ID,
        MOCK_GOALS,
        MOCK_GOAL_CHECKINS,
        MOCK_CATEGORIES
      ),
    []
  );

  // Segmento activo: goals | streaks
  const [activeSegment, setActiveSegment] = useState<SegmentKey>('goals');

  // ids seleccionados para la gráfica
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);

  // Inicializar selección con las primeras 6 metas disponibles
  useEffect(() => {
    if (goalProgressItems.length > 0 && selectedGoalIds.length === 0) {
      setSelectedGoalIds(
        goalProgressItems.slice(0, MAX_SELECTED).map((g) => g.id)
      );
    }
  }, [goalProgressItems, selectedGoalIds.length]);

  const hasGoals = goalProgressItems.length > 0;

  const handleToggleGoal = (id: string) => {
    setSelectedGoalIds((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        return prev.filter((gId) => gId !== id);
      } else {
        if (prev.length >= MAX_SELECTED) return prev;
        return [...prev, id];
      }
    });
  };

  // Metas visibles por selección (máximo 6)
  const visibleGoals = goalProgressItems.filter((g) =>
    selectedGoalIds.includes(g.id)
  );

  return (
    <MainLayout
      headerTitle="Estadísticas"
      activeRoute="Stats"
      onNavigate={(route) => navigation.navigate(route)}
    >
      {/* 🔹 Barra Goals / Streaks arriba del contenido */}
      <View style={styles.segmentWrapper}>
        <GoalsStreaksSegmentBar
          activeSegment={activeSegment}
          onChange={setActiveSegment}
          goalsCount={goalProgressItems.length}
          streaksCount={0} // Aquí puedes poner la cantidad de rachas si la tienes disponible
        />
      </View>

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔹 Si está en pestaña GOALS, mostramos lo de metas */}
        {activeSegment === 'goals' ? (
          !hasGoals ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Aún no tienes metas</Text>
              <Text style={styles.emptySubtitle}>
                Crea tu primera meta para empezar a trackear tu progreso diario.
              </Text>

              <Button
                style={styles.createGoalButton}
                onPress={() => navigation.navigate('CreateGoal')}
              >
                Crear nueva meta
              </Button>
            </View>
          ) : (
            <>
              {/* Gráfica circular de progreso general */}
              <View style={styles.chartWrapper}>
                <CircularGoalsProgress goals={visibleGoals} />
              </View>

              {/* Selector de metas (máximo 6) */}
              <GoalSelectionList
                items={goalProgressItems}
                selectedIds={selectedGoalIds}
                onToggle={handleToggleGoal}
                maxSelected={MAX_SELECTED}
              />

              {/* Sección de check-ins semanales por meta */}
              <View style={styles.weekSection}>
                <Text style={styles.weekSectionTitle}>
                  Check-ins de esta semana
                </Text>

                {visibleGoals.length === 0 && (
                  <Text style={styles.emptyText}>
                    Selecciona al menos una meta para ver sus check-ins.
                  </Text>
                )}

                {visibleGoals.map((goalItem) => {
                  const weekMap = buildWeekCheckinMapForGoal(
                    goalItem.id,
                    MOCK_GOAL_CHECKINS
                  );

                  const goal = MOCK_GOALS.find((g) => g.id === goalItem.id);
                  const category = goal
                    ? MOCK_CATEGORIES.find((c) => c.id === goal.category?.id)
                    : undefined;

                  const categoryColor =
                    category?.color ?? goalItem.color ?? COLORS.PRIMARY;

                  return (
                    <View key={goalItem.id} style={styles.goalWeekCard}>
                      <View style={styles.goalHeaderRow}>
                        <View style={styles.goalColorDotWrapper}>
                          <View
                            style={[
                              styles.goalColorDot,
                              { backgroundColor: categoryColor },
                            ]}
                          />
                        </View>

                        <View style={{ flex: 1 }}>
                          <Text style={styles.goalTitle}>
                            {goal?.title ?? goalItem.label}
                          </Text>
                        </View>

                        <Text style={styles.goalPercentage}>
                          {goalItem.percentage}%
                        </Text>
                      </View>

                      <WeeklyCheckinsBar
                        weekMap={weekMap}
                        categoryColor={categoryColor}
                      />
                    </View>
                  );
                })}
              </View>

              <Button
                style={styles.createGoalButton}
                onPress={() => navigation.navigate('CreateGoal')}
              >
                Crear nueva meta
              </Button>
            </>
          )
        ) : (
          // 🔹 Pestaña STREAKS (de momento placeholder / luego metes tu data real)
          <View style={styles.streaksPlaceholder}>
            <Text style={styles.streaksTitle}>Rachas</Text>
            <Text style={styles.streaksSubtitle}>
              Aquí vas a ver estadísticas y rankings de tus rachas cuando
              tengamos data de streaks conectada.
            </Text>
          </View>
        )}
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  segmentWrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  chartWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    marginBottom: 16,
  },
  createGoalButton: {
    marginTop: 8,
    paddingHorizontal: 20,
  },

  weekSection: {
    marginTop: 8,
  },
  weekSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  goalWeekCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  goalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalColorDotWrapper: {
    marginRight: 8,
  },
  goalColorDot: {
    width: 14,
    height: 14,
    borderRadius: 999,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  goalPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.PRIMARY,
    marginLeft: 8,
  },
  emptyText: {
    marginBottom: 8,
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    fontStyle: 'italic',
  },

  // STREAKS placeholder
  streaksPlaceholder: {
    marginTop: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  streaksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  streaksSubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
  },
});

export default StatsScreen;
