import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { useMemo, useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import GoalCheckinCard from "../../components/goals/goalCheckinCard";
import GoalSelectionList from "../../components/goals/GoalSelectionList";
import { MainLayout } from "../../components/layout/MainLayout";
import { RootTabParamList } from "../../components/navigation/types";
import CircularGoalsProgress from "../../components/stats/CircularGoalProgress";
import { MOCK_CATEGORIES } from "../../data/Categories";
import { MOCK_GOALS, MOCK_GOAL_CHECKINS } from "../../data/TestGoalsData";
import { MOCK_USERS } from "../../data/TestUserData";
import { buildGoalProgressForUser } from "../../lib/goalProgress";
import { Button } from "../../components/ui/button";
import { BRAND_COLORS as COLORS } from "../../styles/Colors";



type HomeNav = BottomTabNavigationProp<RootTabParamList, 'Home'>;

const CURRENT_USER_ID = MOCK_USERS[0].id;
const MAX_SELECTED = 6;

export function HomeScreen() {
  const navigation = useNavigation<HomeNav>();

  // Progreso general de las metas (para gráfica + cards)
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

  const hasGoals = goalProgressItems.length > 0;

  // ids de metas seleccionadas para la gráfica y la lista de cards
  const [selectedGoalIds, setSelectedGoalIds] = useState<string[]>([]);

  // Inicializar selección con las primeras 6 metas
  useEffect(() => {
    if (hasGoals && selectedGoalIds.length === 0) {
      setSelectedGoalIds(
        goalProgressItems.slice(0, MAX_SELECTED).map((g) => g.id)
      );
    }
  }, [hasGoals, goalProgressItems, selectedGoalIds.length]);

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

  // Metas visibles (para gráfica + cards)
  const visibleGoals = goalProgressItems.filter((g) =>
    selectedGoalIds.includes(g.id)
  );

  const handleGoToCreateGoal = () => {
    (navigation as any).navigate('CreateGoal');
  };

  const handleCheckin = (goalId: string) => {
    // Aquí después vas a llamar a tu endpoint / mutation de check-in
    console.log('Hacer check-in para goal:', goalId);
  };

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
          // ---------- ESTADO VACÍO ----------
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
            {/* ---------- GRÁFICA CIRCULAR ---------- */}
            <View style={styles.chartWrapper}>
              <CircularGoalsProgress goals={visibleGoals} />
            </View>

            {/* ---------- SELECTOR DE METAS (MÁX 6) ---------- */}
            <GoalSelectionList
              items={goalProgressItems}
              selectedIds={selectedGoalIds}
              onToggle={handleToggleGoal}
              maxSelected={MAX_SELECTED}
            />

            <Button
              style={styles.createGoalButton}
              onPress={handleGoToCreateGoal}
            >
              Crear nueva meta
            </Button>

            {/* ---------- CARDS DE CHECK-IN POR META ---------- */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Tus metas activas</Text>
            </View>

            {visibleGoals.length === 0 && (
              <Text style={styles.emptyText}>
                Selecciona hasta 6 metas para ver su progreso aquí.
              </Text>
            )}

            {visibleGoals.map((goalItem) => {
              const goal = MOCK_GOALS.find((g) => g.id === goalItem.id);
              const category = goal
                ? MOCK_CATEGORIES.find((c) => c.id === goal.category?.id)
                : undefined;

              const accentColor =
                category?.color ?? goalItem.color ?? COLORS.PRIMARY;

              return (
                <GoalCheckinCard
                  key={goalItem.id}
                  title={goal?.title ?? goalItem.label}
                  description={
                    goal?.description ??
                    'Sigue avanzando con esta meta 💪'
                  }
                  daysActive={7}          // luego puedes calcularlo con rachas reales
                  friendsCount={12}       // mock por ahora
                  isActive={!goal?.isArchived}
                  accentColor={accentColor}
                  onContinue={() => handleCheckin(goalItem.id)}
                />
              );
            })}
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
  },

  sectionHeaderRow: {
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  emptyText: {
    marginBottom: 8,
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    fontStyle: 'italic',
  },
});

export default HomeScreen;
