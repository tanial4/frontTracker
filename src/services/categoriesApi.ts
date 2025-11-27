import { api } from './apiClient';

export interface CategoryResponse {
  id: string;
  name: string;
  color?: string | null;
}

export async function listCategories() {
  const { data } = await api.get<CategoryResponse[]>('/activity-categories');
  return data;
}
