import { api } from './apiClient';

// 👉 Esto refleja lo que espera tu CreateGoalDto en Nest
export type GoalTargetType = 'DAILY' | 'WEEKLY' | 'COUNT' | 'BOOLEAN';

export interface CreateGoalPayload {
  title: string;
  description?: string;
  categoryId?: string | null;
  targetType: GoalTargetType;
  targetValue?: number | null;
  startDate: string;        // ISO string
  endDate?: string | null;  // ISO o null
  isArchived?: boolean;
}

export interface GoalResponse extends CreateGoalPayload {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  // + lo que tengas en el modelo (category, etc.)
}

// Crear meta
export async function createGoal(payload: CreateGoalPayload) {
  const { data } = await api.post<GoalResponse>('/goals', payload);
  return data;
}

// Listar metas
export async function listGoals(params?: { archived?: boolean; q?: string }) {
  const { data } = await api.get<GoalResponse[]>('/goals', {
    params: {
      archived: params?.archived,
      q: params?.q,
    },
  });
  return data;
}

// Obtener una meta
export async function getGoal(id: string) {
  const { data } = await api.get<GoalResponse>(`/goals/${id}`);
  return data;
}

// Actualizar meta
export async function updateGoal(
  id: string,
  payload: Partial<CreateGoalPayload>
) {
  const { data } = await api.patch<GoalResponse>(`/goals/${id}`, payload);
  return data;
}

// Archivar (soft-delete)
export async function archiveGoal(id: string) {
  const { data } = await api.delete<GoalResponse>(`/goals/${id}`);
  return data;
}