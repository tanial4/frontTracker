// src/screens/stats/StatsScreen.tsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { MainLayout } from '../../components/layout/MainLayout';

import { MOCK_USERS } from '../../data/TestUserData';
import { MOCK_GOALS, MOCK_GOAL_CHECKINS } from '../../data/TestGoalsData';
import { MOCK_CATEGORIES } from '../../data/Categories';

import { buildGoalProgressForUser } from '../../lib/goalProgress';
import { buildWeekCheckinMapForGoal } from '../../lib/weekHelpers';
import { Button } from '../../components/ui/button';
import GoalsStreaksSegmentBar from '../../components/goals/goalsStreakSegmentBar';
import { MOCK_STREAKS_UI } from '../../data/TestStreakData';
import StatsGoalsSection from '../../components/stats/StatsGoalsSection';
import StatsStreaksSection from '../../components/stats/StatsStreaksSection';

// 👇 importa el tipo del stack de Stats
import { StatsStackParamList } from '../../components/navigation/StatsStack';

const CURRENT_USER_ID = MOCK_USERS[0].id;
const MAX_SELECTED = 6;

type SegmentKey = 'goals' | 'streaks';

// navegación tipada para esta pantalla dentro del stack
type StatsScreenNavProp = NativeStackNavigationProp<
  StatsStackParamList,
  'StatsMain'
>;

export function StatsScreen() {
  const navigation = useNavigation<StatsScreenNavProp>();

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

  const visibleGoals = goalProgressItems.filter((g) =>
    selectedGoalIds.includes(g.id)
  );

  // Streaks UI data
  const streakItems = MOCK_STREAKS_UI;
  const hasStreaks = streakItems.length > 0;

  return (
    <MainLayout headerTitle="Estadísticas" activeRoute="Stats" onNavigate={(route) => navigation.navigate(route as any)}>
      <View style={styles.segmentWrapper}>
        <GoalsStreaksSegmentBar activeSegment={activeSegment} onChange={setActiveSegment} goalsCount={goalProgressItems.length} streaksCount={streakItems.length} />
      </View>

      <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeSegment === 'goals' ? (
          !hasGoals ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Aún no tienes metas</Text>
              <Text style={styles.emptySubtitle}>Crea tu primera meta para empezar a trackear tu progreso diario.</Text>

              <Button style={styles.createGoalButton} onPress={() => navigation.navigate('CreateGoal' as any)}>Crear nueva meta</Button>
            </View>
          ) : (
            <StatsGoalsSection
              allItems={goalProgressItems}
              visibleItems={visibleGoals}
              selectedIds={selectedGoalIds}
              onToggle={handleToggleGoal}
              maxSelected={MAX_SELECTED}
              onCreate={() => (navigation as any).navigate('CreateGoal')}
              allGoals={MOCK_GOALS}
              allCheckins={MOCK_GOAL_CHECKINS}
              allCategories={MOCK_CATEGORIES}
              buildWeekMap={buildWeekCheckinMapForGoal}
            />
          )
        ) : (
          <StatsStreaksSection streakItems={streakItems} onContinue={(id) => navigation.navigate('StreakDetail' as any, { streakId: id })} />
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

  // Streaks
  streaksTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
});

export default StatsScreen;
