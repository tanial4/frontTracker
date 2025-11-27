// src/screens/home/HomeScreen.tsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../../components/navigation/types';

import { MainLayout } from '../../components/layout/MainLayout';


import { MOCK_CATEGORIES } from '../../data/Categories';

import HomeGoalsSection from '../../components/home/HomeGoalsSection';
import HomeTodayCheckins from '../../components/home/HomeTodayCheckins';
import { Button } from '../../components/ui/button';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

// 👇 importa tu servicio de auth
import { getMe, PublicUser } from '../../services/authApi'; // ajusta la ruta real
import { listGoals,GoalResponse } from '../../services/goalsApi';

import {GoalCheckinResponse,createGoalCheckin, listCheckinsForGoal,} from "../../services/checkinsApi"



import type { GoalTargetType } from '../../services/goalsApi'; // o repetir el union
import { getGoalProgress, GoalProgressResponse } from '../../services/statsApi';

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

type GoalProgressItem = {
  id: string;
  label: string;
  percentage: number; // 0–100
  color: string;
  categoryId?: string | null;
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

type HomeNavProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;

const MAX_SELECTED = 6;

export function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();

  const [currentUser, setCurrentUser] = useState<PublicUser | null>(null);
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [realGoals, setRealGoals] = useState<GoalResponse[]>([]);
  const [realCheckins, setRealCheckins] = useState<GoalCheckinResponse[]>([]);
  const [goalStats, setGoalStats] = useState<Record<string, GoalProgressResponse>>({});



  // 1) Obtener /auth/me al montar
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const user = await getMe();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error al obtener /auth/me', error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchMe();
  }, []);

  //Estadisticas

  useEffect(() => {
  if (!currentUser) return;
  if (realGoals.length === 0) return;

  const fetchStats = async () => {
    try {
      // opcional: definir explícitamente un rango, o dejar que el back use el default (últimos 30 días)
      const now = new Date();
      const to = now.toISOString().slice(0, 10); // YYYY-MM-DD
      const fromDate = new Date();
      fromDate.setDate(now.getDate() - 30);
      const from = fromDate.toISOString().slice(0, 10);

      const entries = await Promise.all(
        realGoals.map(async (g) => {
          const stats = await getGoalProgress(g.id, { from, to });
          return [g.id, stats] as const;
        })
      );

      setGoalStats(Object.fromEntries(entries));
      console.log('Stats desde backend:', entries);
    } catch (err) {
      console.error('Error al cargar stats de metas', err);
    }
  };

  fetchStats();
}, [currentUser, realGoals]);


  useEffect(() => {
    if (!currentUser) return; // todavía no sabemos quién es

    const fetchGoals = async () => {
      try {
        const goals = await listGoals(); // llama GET /goals
        setRealGoals(goals);
        console.log('Metas desde backend:', goals);
      } catch (error) {
        console.error('Error al obtener /goals', error);
      }
    };

    fetchGoals();
  }, [currentUser]);

  useEffect(() => {
  if (!currentUser) return;
  if (realGoals.length === 0) return;

  const fetchAllCheckins = async () => {
    try {
      const allByGoal = await Promise.all(
        realGoals.map((g) => listCheckinsForGoal(g.id))
      );
      const all = allByGoal.flat();
      setRealCheckins(all);
      console.log('Checkins globales desde backend:', all);
    } catch (error) {
      console.error('Error al obtener historial de checkins:', error);
    }
  };

  fetchAllCheckins();
}, [currentUser, realGoals])

const checkinsForProgress = useMemo<FrontCheckin[]>(() => {
  if (!currentUser) return [];

  return realCheckins.map((c) => {
    return {
      id: c.id,
      goalId: c.goalId,
      user: {
        id: c.userId,                // 👈 importantísimo
        email: currentUser.email,    // no lo usa el cálculo, pero no estorba
        username: currentUser.username,
      },
      date: new Date(c.date),
      value: c.value ?? null,
      done: c.done,
    };
  });
}, [realCheckins, currentUser]);

const todayCheckinsForUi = useMemo<FrontCheckin[]>(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return checkinsForProgress.filter((c) => {
    const d = new Date(c.date as any);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });
}, [checkinsForProgress]);

  const goalsForProgress = useMemo<FrontGoal[]>(() => {
  if (!currentUser) return [];
  return realGoals.map((g) => {
    return {
      ...(g as any),
      startDate:new Date(g.startDate),
      endDate:g.endDate?new Date(g.endDate):null,
      // buildGoalProgressForUser necesita esto
      user: {
        id: currentUser.id,
        email: currentUser.email,
        username: currentUser.username,
      } as any,
    } as FrontGoal;
  });
}, [realGoals, currentUser]);

  // 2) Construir progreso de metas SOLO cuando ya tengamos usuario
const goalProgressItems = useMemo<GoalProgressItem[]>(() => {
  if (!currentUser) return [];
  if (realGoals.length === 0) return [];

  return realGoals.map((goal) => {
    const category = MOCK_CATEGORIES.find((c) => c.id === goal.categoryId);
    const stats = goalStats[goal.id];

    let percentage = 0;

    if (stats) {
      if (stats.completion !== null && stats.completion !== undefined) {
        // el back ya calculó completion normalizado 0–1
        percentage = stats.completion * 100;
      } else if (stats.totalCheckins > 0) {
        // fallback: porcentaje de checkins marcados como "hechos"
        percentage = (stats.doneCount / stats.totalCheckins) * 100;
      }
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



  // 3) Inicializar selección con las primeras metas
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

  const handleGoToCreateGoal = () => {
    (navigation as any).navigate('CreateGoalScreen');
  };

  const visibleGoals = goalProgressItems.filter((g) =>
    selectedGoalIds.includes(g.id)
  );

  // 4) Mientras carga el usuario, algo simple
  if (loadingUser) {
    return (
      <MainLayout
        headerTitle="Inicio"
        activeRoute="Home"
        onNavigate={(route) => navigation.navigate(route)}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.emptySubtitle}>Cargando tu información...</Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      headerTitle="Inicio"
      activeRoute="Home"
      onNavigate={(route) => navigation.navigate(route)}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!hasGoals ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Aún no tienes metas</Text>
            <Text style={styles.emptySubtitle}>
              Crea tu primera meta para empezar a trackear tu progreso diario.
            </Text>

            <Button
              style={styles.createGoalButton}
              onPress={handleGoToCreateGoal}
            >
              Crear nueva meta
            </Button>
          </View>
          
        ) : (
          <>
            <HomeGoalsSection
              allItems={goalProgressItems}
              visibleItems={visibleGoals}
              selectedIds={selectedGoalIds}
              onToggle={handleToggleGoal}
              maxSelected={MAX_SELECTED}
              onCreate={handleGoToCreateGoal}
            />
            
            <HomeTodayCheckins
              visibleItems={visibleGoals}
              allGoals={goalsForProgress}
              allCategories={MOCK_CATEGORIES}
              allCheckins={todayCheckinsForUi}
              currentUserId={currentUser?.id ?? ''}
              onCheckin={async (goalId) => {       // 👈 AQUÍ va el async
                try {
                // 1️⃣ Buscar la meta real por ID
                const goal = realGoals.find((g) => g.id === goalId);
                if (!goal) {
                  console.warn('Meta no encontrada para check-in', goalId);
                  return;
                }

                const newCheckin = await createGoalCheckin(goal);

                setRealCheckins((prev) => [...prev, newCheckin]);

                // Esto recalcula:
                // - checkinsForProgress
                // - goalProgressItems
                // => gráfica y lista de hoy se actualizan
              } catch (err: any) {
                console.error('Error al hacer check-in:', err?.response?.data ?? err);
              }
              }}
            />
          </>
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
  chartWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
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
    alignSelf: 'center',
  },
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
  loadingContainer: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
  },
});

export default HomeScreen;
