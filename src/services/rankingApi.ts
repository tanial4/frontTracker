// src/services/rankingsApi.ts
import { api } from './apiClient';

export interface BackendRankingUser {
  id: string;
  username: string | null;
  email: string;
}

export interface BackendRankingEntry {
  id: string;
  period: string;
  userId: string;
  score: number;
  extra: any | null;
  user: BackendRankingUser;
}

export interface ListRankingsResponse {
  period: string;
  totalUsers: number;
  rankings: BackendRankingEntry[];
}

// helper para tener el mismo period que usa el scheduler (YYYY-MM-DD en UTC)
export function getTodayPeriod(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function listRankings(params?: {
  period?: string;
  limit?: number;
}): Promise<ListRankingsResponse> {
  const period = params?.period ?? getTodayPeriod();

  const res = await api.get<ListRankingsResponse>('/rankings', {
    params: {
      period,
      limit: params?.limit,
    },
  });

  return res.data;
}
