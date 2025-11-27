// src/services/homeApi.ts
import { listGoals, GoalResponse } from './goalsApi';
import { listGoalCheckins, GoalCheckinResponse } from './goalCheckinsApi';
import { listCategories, CategoryResponse } from './categoriesApi';

export interface HomeData {
  goals: GoalResponse[];
  checkins: GoalCheckinResponse[];
  categories: CategoryResponse[];
}

export async function fetchHomeData(userId: string): Promise<HomeData> {
  const [goals, checkins, categories] = await Promise.all([
    listGoals({ archived: false }),
    listGoalCheckins({ userId }),
    listCategories(),
  ]);

  return { goals, checkins, categories };
}
