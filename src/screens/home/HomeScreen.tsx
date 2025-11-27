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

import { MOCK_GOALS, MOCK_GOAL_CHECKINS } from '../../data/TestGoalsData';
import { MOCK_CATEGORIES } from '../../data/Categories';

import { buildGoalProgressForUser } from '../../lib/goalProgress';
import HomeGoalsSection from '../../components/home/HomeGoalsSection';
import HomeTodayCheckins from '../../components/home/HomeTodayCheckins';
import { Button } from '../../components/ui/button';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

// 👇 importa tu servicio de auth
import { getMe, PublicUser } from '../../services/authApi'; // ajusta la ruta real
import { listGoals,GoalResponse } from '../../services/goalsApi';

type FrontGoal = (typeof MOCK_GOALS)[number]

type HomeNavProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;

const MAX_SELECTED = 6;

export function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();

  const [currentUser, setCurrentUser] = useState<PublicUser | null>(null);
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [realGoals, setRealGoals] = useState<GoalResponse[]>([]);

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
  const goalProgressItems = useMemo(() => {
    if (!currentUser) return [];
    return buildGoalProgressForUser(
      currentUser.id,       // 👈 equivalente a CURRENT_USER_ID
      goalsForProgress,
      MOCK_GOAL_CHECKINS,
      MOCK_CATEGORIES
    );
  }, [currentUser,goalsForProgress]);

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
              allGoals={MOCK_GOALS}
              allCategories={MOCK_CATEGORIES}
              allCheckins={MOCK_GOAL_CHECKINS}
              currentUserId={currentUser?.id ?? ''} // por ahora
              onCheckin={(goalId) => {
                console.log('Check-in realizado para meta:', goalId);
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
