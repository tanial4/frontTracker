import { api } from './apiClient';
import { GoalResponse } from './goalsApi';

export interface GoalCheckinResponse {
  id: string;
  goalId: string;
  userId: string;
  date: string;      // ISO string
  value?: number | null;
  done: boolean;
  createdAt: string;
}

export async function getTodayCheckins(date?: string) {
  const params = date ? { date } : undefined;
  const { data } = await api.get<GoalCheckinResponse[]>('/checkins/today', {
    params,
  });
  return data;
}

export async function createGoalCheckin(goal: GoalResponse) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalizado a medianoche

  // Payload base
  let payload: {
    goalId: string;
    date: string;
    value?: number;
    done?: boolean;
  } = {
    goalId: goal.id,
    date: today.toISOString(), // ✅ IsDateString válido
  };

  if (goal.targetType === 'COUNT' || goal.targetType === 'WEEKLY') {
    // Estas metas requieren `value >= 1`
    const value = goal.targetValue ?? 1;
    payload.value = value;
    // `done` lo calcula el backend según value >= targetValue
  } else {
    // DAILY / BOOLEAN
    // Aquí NO mandamos value (para no violar validateAccordingToGoal)
    payload.done = true;
  }

  const { data } = await api.post<GoalCheckinResponse>('/checkins', payload);
  return data;
}

export async function listCheckinsForGoal(goalId: string, params?: { from?: string; to?: string }) {
  const { data } = await api.get<GoalCheckinResponse[]>('/checkins', {
    params: {
      goalId,
      from: params?.from,
      to: params?.to,
    },
  });
  return data;
}