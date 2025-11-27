import { api } from './apiClient';

export interface GoalCheckinResponse {
  id: string;
  goalId: string;
  userId: string;
  date: string;
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

export async function createGoalCheckin(goalId: string) {
  const { data } = await api.post<GoalCheckinResponse>('/checkins', {
    goalId,
  });
  return data;
}
