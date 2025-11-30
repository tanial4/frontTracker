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
  const iso = today.toISOString();; // normalizado a medianoche

  // Payload base
  let payload: {
    goalId: string;
    date: string;
    value?: number;
    done?: boolean;
  } = {
    goalId: goal.id,
    date: iso, // ✅ IsDateString válido
  };

  if (goal.targetType === 'WEEKLY' || goal.targetType === 'COUNT') {
    payload.value = 1; // un "paso" cumplido
  }

  // Para DAILY / BOOLEAN podemos mandar done = true directamente
  if (goal.targetType === 'DAILY' || goal.targetType === 'BOOLEAN') {
    payload.done = true;
  }

  console.log('[createGoalCheckin] Enviando DTO:', payload);

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