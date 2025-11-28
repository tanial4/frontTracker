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

/**
 * Payload que usa el front (por ejemplo, CreateStreakForm).
 * Nota: startdate va en minúscula, lo mapeamos a startDate para el backend.
 */
export interface CreateStreakRequest {
  title: string;
  description?: string;
  startdate: string; // ISO
  endDate?: string;  // ISO
}

/**
 * Miembro de una racha, según lo que incluye listMine()
 * (ajusta los campos si tu Prisma tiene otros nombres/propiedades).
 */
export interface StreakMember {
  id: string;
  userId: string;
  role: 'OWNER' | 'MEMBER';
  joinedAt: string; // ISO
}

/**
 * Modelo base de una streak devuelta por el backend.
 * El service listMine incluye los members, así que lo reflejamos aquí.
 */
export interface Streak {
  id: string;
  title: string;
  description: string | null;
  startDate: string; // ISO
  endDate: string | null;
  createdAt: string; // ISO
  createdById: string;
  members: StreakMember[];
}

/**
 * Check-in de racha (streakCheckin) devuelto por listCheckins() o recordCheckin()
 */
export interface StreakCheckin {
  id: string;
  streakId: string;
  userId: string;
  date: string;    // ISO normalizado a día
  done: boolean;
  metadata: any | null;
}

/**
 * DTO para registrar un check-in de racha.
 * Coincide con RecordStreakCheckinDto en el backend:
 *  - date: string ISO
 *  - done?: boolean
 *  - metadata?: any
 */
export interface RecordCheckinRequest {
  date: string;       // ISO
  done?: boolean;
  metadata?: any;
}

/**
 * Parámetros para listar checkins de una racha.
 * Coincide con ListStreakCheckinsDto (memberId, from, to).
 */
export interface ListCheckinsParams {
  memberId?: string;
  from?: string; // ISO
  to?: string;   // ISO
}

/**
 * Respuesta del endpoint de estadísticas de racha para un miembro.
 * Viene de statsForMember(): { userId, current, longest, totalDone }
 */
export interface StreakStats {
  userId: string;
  current: number;
  longest: number;
  totalDone: number;
}


