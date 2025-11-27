// src/types/ranking.ts
export interface RankingEntryUI {
  id: string;
  period: string;     // '2025-W37', '2025-09', etc.
  userId: string;
  displayName: string;
  avatarURL?: string | null;
  score: number;
  rank: number;       // 1, 2, 3...
}
