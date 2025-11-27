// src/services/statsApi.ts
import { api } from './apiClient';
import type { GoalTargetType } from './goalsApi';

export interface GoalProgressResponse {
  goalId: string;
  targetType: GoalTargetType;
  targetValue: number | null;
  from: string;   // ISO
  to: string;     // ISO
  totalCheckins: number;
  doneCount: number;
  valueSum: number;
  completion: number | null; // 0–1 o null si no aplica
}

// GET /stats/goals/:goalId/progress?from=&to=
export async function getGoalProgress(
  goalId: string,
  params?: { from?: string; to?: string }
) {
  const { data } = await api.get<GoalProgressResponse>(
    `/stats/goals/${goalId}/progress`,
    { params }
  );
  return data;
}
