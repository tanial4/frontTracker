// src/types/streak.ts

export type StreakVisibility = 'PRIVATE' | 'FRIENDS' | 'PUBLIC';

export type StreakMemberRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export type StreakCheckinSource = 'MANUAL' | 'GOAL_LINKED';

export interface StreakRuleJson {
  minCheckinsPerWeek?: number;
  maxMissedDays?: number;
  allowBackfill?: boolean;
  // espacio para reglas futuras
  [key: string]: any;
}

export interface Streak {
  id: string;
  name: string;
  description?: string | null;

  ownerUserId: string;

  // opcional: link a categoría (Pomodoro, Ejercicio, etc.)
  categoryId?: string | null;

  visibility: StreakVisibility;

  startDate: string;           // ISO string
  endDate?: string | null;     // ISO string o null

  ruleJson?: StreakRuleJson | null;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface StreakUI {
  id: string;
  name: string;
  description?: string | null;

  categoryColor: string;     // se obtiene desde categoría real
  isJoined: boolean;         // si el usuario está en la racha
  membersCount: number;      // count de streakMembers
  currentStreakDays: number; // días consecutivos
}

export interface StreakMembership {
  id: string;
  streakId: string;
  userId: string;

  role: StreakMemberRole;      // OWNER / ADMIN / MEMBER
  joinedAt: string;
  leftAt?: string | null;

  // para UI (silenciar notis de esta racha)
  isMuted: boolean;

  // último check-in de este usuario en esta racha
  lastCheckinAt?: string | null;
}

export interface StreakCheckin {
  id: string;
  streakId: string;
  userId: string;

  createdAt: string;           // fecha del check-in (ISO)

  // opcional: comentario o nota corta
  note?: string | null;

  // de dónde viene el check-in
  source: StreakCheckinSource; // MANUAL | GOAL_LINKED

  // si viene de una goal específica
  goalId?: string | null;
}

export interface streakBackEnd {
  title: string;
  description?: string;
  startdate: string; // ISO
  endDate?: string; // ISO
}