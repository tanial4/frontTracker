export type RankingEntryUI = {
  id: string;
  userId: string;
  displayName: string;
  period: string;
  score: number;
  rank: number;          // posición en el ranking (1-based)
  avatarURL?: string | null;
};
