

// -----------------------------------------------------
// ENUM / UNION: StreakRole

import { Use } from "react-native-svg";
import { UserProfile } from "./user";

// -----------------------------------------------------
export type StreakRole = 'OWNER' | 'ADMIN' | 'MEMBER';

// -----------------------------------------------------
// MODELO PRINCIPAL: Streak (racha / grupo)
// -----------------------------------------------------
export interface Streak {
  id: string;
  title: string;
  description?: string | null;

  startDate: Date;              // o string si tu API devuelve ISO strings
  endDate?: Date | null;        // puede ser abierta

  ruleJson: unknown;            // Prisma Json -> lo dejamos genérico
  createdById: string;

  createdAt: Date;
  updatedAt: Date;

  // Relaciones opcionales (no siempre vienen en todas las queries)
  createdBy?: UserProfile;
  members?: StreakMember[];
  checkins?: StreakCheckin[];
  chatRooms?: ChatRoom[];       // si ya tienes ChatRoom, impórtalo y quita este stub
}

// -----------------------------------------------------
// MIEMBROS DE LA RACHA
// -----------------------------------------------------
export interface StreakMember {
  id: string;
  streakId: string;
  userId: string;
  joinedAt: Date;           // @default(now())
  role: StreakRole;         // OWNER | ADMIN | MEMBER

  // Relaciones
  streak?: Streak;
  user?: UserProfile;
}

// -----------------------------------------------------
// CHECKINS / REGISTROS DIARIOS
// -----------------------------------------------------
export interface StreakCheckin {
  id: string;
  streakId: string;
  userId: string;

  date: Date;
  done: boolean;           // @default(false)
  metadata?: unknown | null; // Prisma Json?

  createdAt: Date;         // @default(now())

  // Relaciones
  streak?: Streak;
  user?: UserProfile;
}

// -----------------------------------------------------
// Stub de ChatRoom (si ya lo tienes en otro archivo, borra esto y haz import)
// -----------------------------------------------------
export interface ChatRoom {
  id: string;
  streakId: string;
  // agrega aquí los campos reales cuando tengas el modelo completo
}
