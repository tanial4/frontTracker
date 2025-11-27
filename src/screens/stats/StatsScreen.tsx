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

import { MOCK_CATEGORIES } from '../../data/Categories';

import { buildWeekCheckinMapForGoal } from '../../lib/weekHelpers';
import { Button } from '../../components/ui/button';
import GoalsStreaksSegmentBar from '../../components/goals/goalsStreakSegmentBar';
import { MOCK_STREAKS_UI } from '../../data/TestStreakData';
import StatsGoalsSection from '../../components/stats/StatsGoalsSection';
import StatsStreaksSection from '../../components/stats/StatsStreaksSection';

// navegación tipada para esta pantalla dentro del stack
import { StatsStackParamList } from '../../components/navigation/StatsStack';

// 👇 nuevos imports: servicios reales
import { getMe, PublicUser } from '../../services/authApi';
import { listGoals, GoalResponse, GoalTargetType } from '../../services/goalsApi';
import {
  listCheckinsForGoal,
  GoalCheckinResponse,
} from '../../services/checkinsApi';
import {
  getGoalProgress,
  GoalProgressResponse,
} from '../../services/statsApi';

const MAX_SELECTED = 6;

type SegmentKey = 'goals' | 'streaks';

type StatsScreenNavProp = NativeStackNavigationProp<
  StatsStackParamList,
  'StatsMain'
>;

// Tipos locales SOLO para esta pantalla (independientes de Home)
type FrontGoal = {
  id: string;
  title: string;
  description?: string | null;
  categoryId?: string | null;
  targetType: GoalTargetType;
  targetValue?: number | null;
  startDate: Date;
  endDate: Date | null;
  isArchived: boolean;
  user: {
    id: string;
    email: string;
    username: string;
  };
};

type FrontCheckin = {
  id: string;
  goalId: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
  date: Date;
  value?: number | null;
  done: boolean;
};

type GoalProgressItem = {
  id: string;
  label: string;
  percentage: number; // 0–100
  color: string;
  categoryId?: string | null;
};

export function StatsScreen() {
  const navigation = useNavigation<StatsScreenNavProp>();

  // --- 1) usuario real ---
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // --- 2) metas y checkins reales ---
  const [realGoals, setRealGoals] = useState<GoalResponse[]>([]);
  const [realCheckins, setRealCheckins] = useState<GoalCheckinResponse[]>([]);
  const [goalStats, setGoalStats] = useState<
    Record<string, GoalProgressResponse>
  >({});

  const [activeSegment, setActiveSegment] = useState<SegmentKey>('goals');

  // ids seleccionados para la gráfica
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);

  // 1) /auth/me
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const user = await getMe();
        setCurrentUser(user);
      } catch (err) {
        console.error('Error al obtener /auth/me en StatsScreen', err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchMe();
  }, []);

  // 2) /goals
  useEffect(() => {
    if (!currentUser) return;

    const fetchGoals = async () => {
      try {
        const goals = await listGoals();
        setRealGoals(goals);
      } catch (err) {
        console.error('Error al obtener /goals en StatsScreen', err);
      }
    };

    fetchGoals();
  }, [currentUser]);

  // 3) /goals/:id/checkins (todas las metas)
  useEffect(() => {
    if (!currentUser) return;
    if (realGoals.length === 0) return;

    const fetchAllCheckins = async () => {
      try {
        const allByGoal = await Promise.all(
          realGoals.map((g) => listCheckinsForGoal(g.id))
        );
        setRealCheckins(allByGoal.flat());
      } catch (err) {
        console.error(
          'Error al obtener historial de checkins en StatsScreen:',
          err
        );
      }
    };

    fetchAllCheckins();
  }, [currentUser, realGoals]);

  // 4) /stats/goals/:id/progress
useEffect(() => {
  if (!currentUser) return;
  if (realGoals.length === 0) return;

  const fetchStats = async () => {
    try {
      const now = new Date();
      const to = now.toISOString().slice(0, 10); // YYYY-MM-DD
      const fromDate = new Date();
      fromDate.setDate(now.getDate() - 30);
      const from = fromDate.toISOString().slice(0, 10);

      const entries = await Promise.all(
        realGoals.map(async (g) => {
          const stats = await getGoalProgress(g.id, { from, to });
          console.log('Stats goal', g.id, g.title, stats); // 👈 LOG
          return [g.id, stats] as const;
        })
      );

      const statsMap = Object.fromEntries(entries);
      console.log('Stats map en StatsScreen:', statsMap); // 👈 LOG
      setGoalStats(statsMap);
    } catch (err) {
      console.error('Error al cargar stats de metas en StatsScreen', err);
    }
  };

  fetchStats();
}, [currentUser, realGoals]);


  // 5) Adaptar metas y checkins al formato que usan los helpers/UI de stats
  const goalsForUi = useMemo<FrontGoal[]>(() => {
    if (!currentUser) return [];
    return realGoals.map((g) => ({
      ...(g as any),
      startDate: new Date(g.startDate),
      endDate: g.endDate ? new Date(g.endDate) : null,
      user: {
        id: currentUser.id,
        email: currentUser.email,
        username: currentUser.username,
      },
    }));
  }, [realGoals, currentUser]);

  const checkinsForUi = useMemo<FrontCheckin[]>(() => {
    if (!currentUser) return [];
    return realCheckins.map((c) => ({
      id: c.id,
      goalId: c.goalId,
      user: {
        id: c.userId,
        email: currentUser.email,
        username: currentUser.username,
      },
      date: new Date(c.date),
      value: c.value ?? null,
      done: c.done,
    }));
  }, [realCheckins, currentUser]);

  // 6) Progreso general de las metas (solo para stats screen)
  const goalProgressItems = useMemo<GoalProgressItem[]>(() => {
    if (!currentUser) return [];
    if (realGoals.length === 0) return [];

    return realGoals.map((goal) => {
      const category = MOCK_CATEGORIES.find((c) => c.id === goal.categoryId);
      const stats = goalStats[goal.id];

      let percentage = 0;

      if (stats && stats.completion !== null && stats.completion !== undefined) {
        // completion viene 0–1 desde el backend (global)
        percentage = Math.round(stats.completion * 100)
      }
        
      return {
        id: goal.id,
        label: goal.title,
        percentage,
        color: category?.color ?? '#6C5CE7',
        categoryId: goal.categoryId ?? null,
      };
    });
  }, [currentUser, realGoals, goalStats]);

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

  // Streaks UI data (por ahora seguimos usando mocks)
  const streakItems = MOCK_STREAKS_UI;
  const hasStreaks = streakItems.length > 0;

  // Loading simple (puedes hacerlo más fino si quieres)
  if (loadingUser) {
    return (
      <MainLayout
        headerTitle="Estadísticas"
        activeRoute="Stats"
        onNavigate={(route) => navigation.navigate(route as any)}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.emptySubtitle}>Cargando tus estadísticas...</Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      headerTitle="Estadísticas"
      activeRoute="Stats"
      onNavigate={(route) => navigation.navigate(route as any)}
    >
      <View style={styles.segmentWrapper}>
        <GoalsStreaksSegmentBar
          activeSegment={activeSegment}
          onChange={setActiveSegment}
          goalsCount={goalProgressItems.length}
          streaksCount={streakItems.length}
        />
      </View>

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeSegment === 'goals' ? (
          !hasGoals ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Aún no tienes metas</Text>
              <Text style={styles.emptySubtitle}>
                Crea tu primera meta para empezar a trackear tu progreso diario.
              </Text>

              <Button
                style={styles.createGoalButton}
                onPress={() => navigation.navigate('CreateGoal' as any)}
              >
                Crear nueva meta
              </Button>
            </View>
          ) : (
            <StatsGoalsSection
              allItems={goalProgressItems}
              visibleItems={visibleGoals}
              selectedIds={selectedGoalIds}
              onToggle={handleToggleGoal}
              maxSelected={MAX_SELECTED}
              onCreate={() => (navigation as any).navigate('CreateGoal')}
              allGoals={goalsForUi}
              allCheckins={checkinsForUi}
              allCategories={MOCK_CATEGORIES}
              buildWeekMap={buildWeekCheckinMapForGoal}
            />
          )
        ) : (
          <StatsStreaksSection
            streakItems={streakItems}
            onContinue={(id) =>
              navigation.navigate('StreakDetail' as any, { streakId: id })
            }
          />
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

  loadingContainer: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
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
