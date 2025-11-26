// src/data/TestStreakData.ts

import { Streak, StreakMembership, StreakCheckin } from '../types/streak';
import { MOCK_USERS } from './TestUserData';
import { MOCK_GOALS } from './TestGoalsData';
import { MOCK_CATEGORIES } from './Categories';

// Helpers rápidos
const userTania = MOCK_USERS[0];
const userAndres = MOCK_USERS[1];
const userCarmen = MOCK_USERS[2];

const catPomodoro = MOCK_CATEGORIES.find(c => c.id === 'cat-pomo');
const catExercise = MOCK_CATEGORIES.find(c => c.id === 'cat-ex');
const catRead = MOCK_CATEGORIES.find(c => c.id === 'cat-read');

const goalPomodoro = MOCK_GOALS[0]; // asumiendo que tu primer goal es de Pomodoro
const goalExercise = MOCK_GOALS[1]; // etc.
const goalRead = MOCK_GOALS[2];

// -------------------------
// STREAKS
// -------------------------

export const MOCK_STREAKS: Streak[] = [
  {
    id: 'streak-001-pomo-tania',
    name: 'Pomodoros diarios',
    description: 'Completar al menos 3 pomodoros al día para avanzar en mis proyectos.',
    ownerUserId: userTania.id,
    categoryId: catPomodoro?.id ?? null,
    visibility: 'FRIENDS',
    startDate: '2025-01-01T08:00:00.000Z',
    endDate: null,
    ruleJson: {
      minCheckinsPerWeek: 5,
      maxMissedDays: 2,
      allowBackfill: false,
    },
    createdAt: '2025-01-01T08:00:00.000Z',
    updatedAt: '2025-01-10T09:00:00.000Z',
    deletedAt: null,
  },
  {
    id: 'streak-002-exercise-andres',
    name: 'Entrenar 4 veces por semana',
    description: 'Gym o cardio ligero, pero mover el cuerpo mínimo 4 días a la semana.',
    ownerUserId: userAndres.id,
    categoryId: catExercise?.id ?? null,
    visibility: 'PUBLIC',
    startDate: '2025-01-05T08:00:00.000Z',
    endDate: null,
    ruleJson: {
      minCheckinsPerWeek: 4,
      maxMissedDays: 3,
      allowBackfill: true,
    },
    createdAt: '2025-01-05T08:00:00.000Z',
    updatedAt: '2025-01-10T09:00:00.000Z',
    deletedAt: null,
  },
  {
    id: 'streak-003-reading-club',
    name: 'Club de lectura nocturna',
    description: 'Leer al menos 20 páginas antes de dormir.',
    ownerUserId: userCarmen.id,
    categoryId: catRead?.id ?? null,
    visibility: 'FRIENDS',
    startDate: '2025-01-03T08:00:00.000Z',
    endDate: null,
    ruleJson: {
      minCheckinsPerWeek: 7,
      allowBackfill: false,
    },
    createdAt: '2025-01-03T08:00:00.000Z',
    updatedAt: '2025-01-09T21:00:00.000Z',
    deletedAt: null,
  },
];

// -------------------------
// MEMBERSHIPS
// -------------------------

export const MOCK_STREAK_MEMBERSHIPS: StreakMembership[] = [
  // Streak 1 - Pomodoro (Tania + Andrés)
  {
    id: 'streak-member-001',
    streakId: 'streak-001-pomo-tania',
    userId: userTania.id,
    role: 'OWNER',
    joinedAt: '2025-01-01T08:05:00.000Z',
    leftAt: null,
    isMuted: false,
    lastCheckinAt: '2025-01-10T08:30:00.000Z',
  },
  {
    id: 'streak-member-002',
    streakId: 'streak-001-pomo-tania',
    userId: userAndres.id,
    role: 'MEMBER',
    joinedAt: '2025-01-02T09:00:00.000Z',
    leftAt: null,
    isMuted: false,
    lastCheckinAt: '2025-01-09T19:00:00.000Z',
  },

  // Streak 2 - Exercise (Andrés + Tania)
  {
    id: 'streak-member-003',
    streakId: 'streak-002-exercise-andres',
    userId: userAndres.id,
    role: 'OWNER',
    joinedAt: '2025-01-05T08:00:00.000Z',
    leftAt: null,
    isMuted: false,
    lastCheckinAt: '2025-01-10T07:20:00.000Z',
  },
  {
    id: 'streak-member-004',
    streakId: 'streak-002-exercise-andres',
    userId: userTania.id,
    role: 'MEMBER',
    joinedAt: '2025-01-06T10:00:00.000Z',
    leftAt: null,
    isMuted: true,
    lastCheckinAt: '2025-01-08T18:10:00.000Z',
  },

  // Streak 3 - Reading club (Carmen + Tania + Andrés)
  {
    id: 'streak-member-005',
    streakId: 'streak-003-reading-club',
    userId: userCarmen.id,
    role: 'OWNER',
    joinedAt: '2025-01-03T08:10:00.000Z',
    leftAt: null,
    isMuted: false,
    lastCheckinAt: '2025-01-09T22:30:00.000Z',
  },
  {
    id: 'streak-member-006',
    streakId: 'streak-003-reading-club',
    userId: userTania.id,
    role: 'MEMBER',
    joinedAt: '2025-01-04T20:00:00.000Z',
    leftAt: null,
    isMuted: false,
    lastCheckinAt: '2025-01-09T22:00:00.000Z',
  },
  {
    id: 'streak-member-007',
    streakId: 'streak-003-reading-club',
    userId: userAndres.id,
    role: 'MEMBER',
    joinedAt: '2025-01-04T20:15:00.000Z',
    leftAt: null,
    isMuted: true,
    lastCheckinAt: '2025-01-08T21:10:00.000Z',
  },
];

// -------------------------
// CHECKINS
// -------------------------

export const MOCK_STREAK_CHECKINS: StreakCheckin[] = [
  // Streak Pomodoro - Tania
  {
    id: 'checkin-001',
    streakId: 'streak-001-pomo-tania',
    userId: userTania.id,
    createdAt: '2025-01-08T08:00:00.000Z',
    note: '3 pomodoros completados',
    source: 'GOAL_LINKED',
    goalId: goalPomodoro?.id ?? null,
  },
  {
    id: 'checkin-002',
    streakId: 'streak-001-pomo-tania',
    userId: userTania.id,
    createdAt: '2025-01-09T09:00:00.000Z',
    note: '2 pomodoros hoy, pero intensos',
    source: 'GOAL_LINKED',
    goalId: goalPomodoro?.id ?? null,
  },

  // Streak Pomodoro - Andrés
  {
    id: 'checkin-003',
    streakId: 'streak-001-pomo-tania',
    userId: userAndres.id,
    createdAt: '2025-01-08T19:30:00.000Z',
    note: '1 sesión rápida en la noche',
    source: 'MANUAL',
    goalId: null,
  },

  // Streak Exercise - Andrés
  {
    id: 'checkin-004',
    streakId: 'streak-002-exercise-andres',
    userId: userAndres.id,
    createdAt: '2025-01-07T07:15:00.000Z',
    note: 'Gimnasio: pierna y espalda',
    source: 'GOAL_LINKED',
    goalId: goalExercise?.id ?? null,
  },
  {
    id: 'checkin-005',
    streakId: 'streak-002-exercise-andres',
    userId: userAndres.id,
    createdAt: '2025-01-09T07:10:00.000Z',
    note: 'Cardio suave 30min',
    source: 'MANUAL',
    goalId: null,
  },

  // Streak Reading club - Carmen
  {
    id: 'checkin-006',
    streakId: 'streak-003-reading-club',
    userId: userCarmen.id,
    createdAt: '2025-01-08T22:20:00.000Z',
    note: 'Leí 25 páginas de novela',
    source: 'GOAL_LINKED',
    goalId: goalRead?.id ?? null,
  },

  // Reading club - Tania
  {
    id: 'checkin-007',
    streakId: 'streak-003-reading-club',
    userId: userTania.id,
    createdAt: '2025-01-08T22:10:00.000Z',
    note: 'Leí 20 páginas del mismo libro',
    source: 'GOAL_LINKED',
    goalId: goalRead?.id ?? null,
  },

  // Reading club - Andrés
  {
    id: 'checkin-008',
    streakId: 'streak-003-reading-club',
    userId: userAndres.id,
    createdAt: '2025-01-08T21:50:00.000Z',
    note: 'Me atrasé pero alcancé 15 páginas',
    source: 'MANUAL',
    goalId: null,
  },
];
