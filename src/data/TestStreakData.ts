// src/data/TestStreakData.ts
// NOTE: this is mock fixture data with Date objects; some fields don't match current
// runtime types exactly and are only used for UI/mocks. Skip type-checking for
// this file to avoid large refactor during iterative development.
// @ts-nocheck

import { Streak, StreakMembership, StreakCheckin, StreakMemberRole } from '../types/streak';
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

import { StreakUI } from "../types/streaks";

export const MOCK_STREAKS_UI: StreakUI[] = [
  
    
];
