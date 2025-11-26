// src/data/TestStreakData.ts

import { Streak, StreakMember, StreakCheckin, StreakRole } from '../types/streak';
import { MOCK_USERS } from './TestUserData';

// IDs de usuarios para que sea más legible
const TANIA  = 'user-001-tania';
const ANDRES = 'user-002-andres';
const CARMEN = 'user-003-carmen';
const DAVID  = 'user-004-david';
const ELENA  = 'user-005-elena';

// --------------------------------------------------
// 1) RACHAS (Streak)
// --------------------------------------------------

export const MOCK_STREAKS: Streak[] = [
  {
    id: 'streak-001-focus-morning',
    title: 'Bloque de concentración matutino',
    description: '90 minutos sin distracciones para avanzar en el proyecto principal.',
    startDate: new Date('2024-10-01T07:00:00Z'),
    endDate: null,
    ruleJson: {
      targetPerDayMinutes: 90,
      allowedMissesPerMonth: 3,
      timezone: 'America/Mexico_City',
    },
    createdById: TANIA,
    createdAt: new Date('2024-10-01T06:50:00Z'),
    updatedAt: new Date('2024-11-20T10:00:00Z'),
  },
  {
    id: 'streak-002-gym',
    title: 'Gimnasio 3x por semana',
    description: 'Entrenar fuerza al menos 3 veces a la semana.',
    startDate: new Date('2024-09-15T00:00:00Z'),
    endDate: null,
    ruleJson: {
      requiredSessionsPerWeek: 3,
      minDurationMinutes: 45,
    },
    createdById: ANDRES,
    createdAt: new Date('2024-09-15T09:00:00Z'),
    updatedAt: new Date('2024-11-19T20:15:00Z'),
  },
  {
    id: 'streak-003-reading',
    title: 'Lectura diaria',
    description: 'Leer al menos 20 páginas diarias.',
    startDate: new Date('2024-08-01T00:00:00Z'),
    endDate: null,
    ruleJson: {
      pagesPerDay: 20,
      genre: 'No ficción',
    },
    createdById: CARMEN,
    createdAt: new Date('2024-08-01T08:30:00Z'),
    updatedAt: new Date('2024-11-20T12:00:00Z'),
  },
  {
    id: 'streak-004-meditation',
    title: 'Meditación antes de dormir',
    description: 'Sesiones cortas de mindfulness de 10 minutos.',
    startDate: new Date('2024-10-10T00:00:00Z'),
    endDate: null,
    ruleJson: {
      durationMinutes: 10,
      preferredApp: 'Headspace',
    },
    createdById: ELENA,
    createdAt: new Date('2024-10-10T21:00:00Z'),
    updatedAt: new Date('2024-11-18T22:10:00Z'),
  },
  {
    id: 'streak-005-code-katas',
    title: 'Katas de código',
    description: 'Resolver al menos una kata diaria en cualquier lenguaje.',
    startDate: new Date('2024-11-01T00:00:00Z'),
    endDate: null,
    ruleJson: {
      platform: 'Codewars',
      minDifficulty: '8 kyu',
    },
    createdById: DAVID,
    createdAt: new Date('2024-11-01T09:30:00Z'),
    updatedAt: new Date('2024-11-20T09:00:00Z'),
  },
];

// --------------------------------------------------
// 2) MIEMBROS DE RACHAS (StreakMember)
// --------------------------------------------------

export const MOCK_STREAK_MEMBERS: StreakMember[] = [
  // --- Streak 001: Focus morning ---
  {
    id: 'sm-001',
    streakId: 'streak-001-focus-morning',
    userId: TANIA,
    joinedAt: new Date('2024-10-01T06:50:00Z'),
    role: 'OWNER',
  },
  {
    id: 'sm-002',
    streakId: 'streak-001-focus-morning',
    userId: DAVID,
    joinedAt: new Date('2024-10-02T07:00:00Z'),
    role: 'ADMIN',
  },
  {
    id: 'sm-003',
    streakId: 'streak-001-focus-morning',
    userId: ELENA,
    joinedAt: new Date('2024-10-05T07:10:00Z'),
    role: 'MEMBER',
  },

  // --- Streak 002: Gym ---
  {
    id: 'sm-004',
    streakId: 'streak-002-gym',
    userId: ANDRES,
    joinedAt: new Date('2024-09-15T09:00:00Z'),
    role: 'OWNER',
  },
  {
    id: 'sm-005',
    streakId: 'streak-002-gym',
    userId: TANIA,
    joinedAt: new Date('2024-09-20T19:00:00Z'),
    role: 'MEMBER',
  },
  {
    id: 'sm-006',
    streakId: 'streak-002-gym',
    userId: DAVID,
    joinedAt: new Date('2024-09-22T18:30:00Z'),
    role: 'MEMBER',
  },

  // --- Streak 003: Reading ---
  {
    id: 'sm-007',
    streakId: 'streak-003-reading',
    userId: CARMEN,
    joinedAt: new Date('2024-08-01T08:30:00Z'),
    role: 'OWNER',
  },
  {
    id: 'sm-008',
    streakId: 'streak-003-reading',
    userId: ELENA,
    joinedAt: new Date('2024-08-10T09:00:00Z'),
    role: 'MEMBER',
  },

  // --- Streak 004: Meditation ---
  {
    id: 'sm-009',
    streakId: 'streak-004-meditation',
    userId: ELENA,
    joinedAt: new Date('2024-10-10T21:00:00Z'),
    role: 'OWNER',
  },
  {
    id: 'sm-010',
    streakId: 'streak-004-meditation',
    userId: CARMEN,
    joinedAt: new Date('2024-10-12T21:15:00Z'),
    role: 'MEMBER',
  },

  // --- Streak 005: Code katas ---
  {
    id: 'sm-011',
    streakId: 'streak-005-code-katas',
    userId: DAVID,
    joinedAt: new Date('2024-11-01T09:30:00Z'),
    role: 'OWNER',
  },
  {
    id: 'sm-012',
    streakId: 'streak-005-code-katas',
    userId: TANIA,
    joinedAt: new Date('2024-11-03T10:00:00Z'),
    role: 'ADMIN',
  },
  {
    id: 'sm-013',
    streakId: 'streak-005-code-katas',
    userId: ANDRES,
    joinedAt: new Date('2024-11-05T10:15:00Z'),
    role: 'MEMBER',
  },
];

// --------------------------------------------------
// 3) CHECKINS (StreakCheckin)
// --------------------------------------------------

// Utilidad rápida para no estar repitiendo Date.parse everywhere
const d = (iso: string) => new Date(iso);

export const MOCK_STREAK_CHECKINS: StreakCheckin[] = [
  // --- Streak 001: Focus morning (últimos 5 días para Tania y David) ---
  {
    id: 'sc-001',
    streakId: 'streak-001-focus-morning',
    userId: TANIA,
    date: d('2024-11-16'),
    done: true,
    metadata: { minutes: 95, notes: 'Avancé en el proyecto de front.' },
    createdAt: d('2024-11-16T08:45:00Z'),
  },
  {
    id: 'sc-002',
    streakId: 'streak-001-focus-morning',
    userId: TANIA,
    date: d('2024-11-17'),
    done: true,
    metadata: { minutes: 90 },
    createdAt: d('2024-11-17T08:50:00Z'),
  },
  {
    id: 'sc-003',
    streakId: 'streak-001-focus-morning',
    userId: TANIA,
    date: d('2024-11-18'),
    done: false,
    metadata: { reason: 'Reuniones toda la mañana.' },
    createdAt: d('2024-11-18T09:10:00Z'),
  },
  {
    id: 'sc-004',
    streakId: 'streak-001-focus-morning',
    userId: DAVID,
    date: d('2024-11-16'),
    done: true,
    metadata: { minutes: 100 },
    createdAt: d('2024-11-16T08:40:00Z'),
  },
  {
    id: 'sc-005',
    streakId: 'streak-001-focus-morning',
    userId: DAVID,
    date: d('2024-11-17'),
    done: true,
    metadata: { minutes: 85 },
    createdAt: d('2024-11-17T08:55:00Z'),
  },

  // --- Streak 002: Gym (Andrés focus) ---
  {
    id: 'sc-006',
    streakId: 'streak-002-gym',
    userId: ANDRES,
    date: d('2024-11-11'),
    done: true,
    metadata: { type: 'Fuerza tren superior', duration: 60 },
    createdAt: d('2024-11-11T19:30:00Z'),
  },
  {
    id: 'sc-007',
    streakId: 'streak-002-gym',
    userId: ANDRES,
    date: d('2024-11-13'),
    done: true,
    metadata: { type: 'Pierna', duration: 55 },
    createdAt: d('2024-11-13T20:10:00Z'),
  },
  {
    id: 'sc-008',
    streakId: 'streak-002-gym',
    userId: ANDRES,
    date: d('2024-11-15'),
    done: true,
    metadata: { type: 'Espalda', duration: 50 },
    createdAt: d('2024-11-15T19:50:00Z'),
  },
  {
    id: 'sc-009',
    streakId: 'streak-002-gym',
    userId: TANIA,
    date: d('2024-11-15'),
    done: false,
    metadata: { reason: 'Dolor de espalda' },
    createdAt: d('2024-11-15T18:00:00Z'),
  },

  // --- Streak 003: Reading ---
  {
    id: 'sc-010',
    streakId: 'streak-003-reading',
    userId: CARMEN,
    date: d('2024-11-18'),
    done: true,
    metadata: { pages: 24, book: 'Atomic Habits' },
    createdAt: d('2024-11-18T22:30:00Z'),
  },
  {
    id: 'sc-011',
    streakId: 'streak-003-reading',
    userId: CARMEN,
    date: d('2024-11-19'),
    done: true,
    metadata: { pages: 21 },
    createdAt: d('2024-11-19T22:20:00Z'),
  },
  {
    id: 'sc-012',
    streakId: 'streak-003-reading',
    userId: ELENA,
    date: d('2024-11-19'),
    done: false,
    metadata: { reason: 'Día pesado de trabajo' },
    createdAt: d('2024-11-19T23:10:00Z'),
  },

  // --- Streak 004: Meditation ---
  {
    id: 'sc-013',
    streakId: 'streak-004-meditation',
    userId: ELENA,
    date: d('2024-11-18'),
    done: true,
    metadata: { duration: 12, moodAfter: 'relajada' },
    createdAt: d('2024-11-18T23:00:00Z'),
  },
  {
    id: 'sc-014',
    streakId: 'streak-004-meditation',
    userId: CARMEN,
    date: d('2024-11-18'),
    done: true,
    metadata: { duration: 10 },
    createdAt: d('2024-11-18T23:05:00Z'),
  },

  // --- Streak 005: Code katas ---
  {
    id: 'sc-015',
    streakId: 'streak-005-code-katas',
    userId: DAVID,
    date: d('2024-11-18'),
    done: true,
    metadata: { platform: 'Codewars', kata: 'Basic Math', difficulty: '8 kyu' },
    createdAt: d('2024-11-18T21:15:00Z'),
  },
  {
    id: 'sc-016',
    streakId: 'streak-005-code-katas',
    userId: TANIA,
    date: d('2024-11-18'),
    done: true,
    metadata: { platform: 'LeetCode', problem: 'Two Sum', difficulty: 'Easy' },
    createdAt: d('2024-11-18T21:30:00Z'),
  },
  {
    id: 'sc-017',
    streakId: 'streak-005-code-katas',
    userId: ANDRES,
    date: d('2024-11-18'),
    done: false,
    metadata: { reason: 'Se alargó el entrenamiento' },
    createdAt: d('2024-11-18T22:00:00Z'),
  },
];
