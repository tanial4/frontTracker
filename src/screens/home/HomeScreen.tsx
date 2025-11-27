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

import { MOCK_USERS } from '../../data/TestUserData';
import { MOCK_GOALS, MOCK_GOAL_CHECKINS } from '../../data/TestGoalsData';
import { MOCK_CATEGORIES } from '../../data/Categories';

import { buildGoalProgressForUser } from '../../lib/goalProgress';
import HomeGoalsSection from '../../components/home/HomeGoalsSection';
import HomeTodayCheckins from '../../components/home/HomeTodayCheckins';
import { Button } from '../../components/ui/button';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';


type HomeNavProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;

const CURRENT_USER_ID = MOCK_USERS[0].id;
const MAX_SELECTED = 6;

export function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();

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

  const handleGoToCreateGoal = () => {
    (navigation as any).navigate('CreateGoalScreen');
  };

  // Metas visibles en el gráfico (máx 6) — la misma lista será usada para los checkins
  const visibleGoals = goalProgressItems.filter((g) =>
    selectedGoalIds.includes(g.id)
  );

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
          // 🔹 Estado vacío cuando no hay metas
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
              currentUserId={CURRENT_USER_ID}
              onCheckin={(goalId) => {
                // placeholder: later call backend / mutation
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
    alignSelf: 'center',
  },

  // Sección "Tus metas hoy"
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
});

export default HomeScreen;
