// src/data/TestChatData.ts

import { ChatRoom, ChatMember, Message } from '../types/chat';
import { MOCK_USERS } from './TestUserData';

// Atajos para los IDs de usuario que ya tienes
const TANIA  = MOCK_USERS[0].id; // 'user-001-tania'
const ANDRES = MOCK_USERS[1].id; // 'user-002-andres'
const CARMEN = MOCK_USERS[2].id; // 'user-003-carmen'
const DAVID  = MOCK_USERS[3].id; // 'user-004-david'
const ELENA  = MOCK_USERS[4].id; // 'user-005-elena'

// ------------------------
// 1) CHAT ROOMS
// ------------------------
export const MOCK_CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'room-001-tania-andres',
    isDirect: true,
    streakId: null,
    createdAt: new Date('2025-02-01T13:00:00Z').toISOString(),
  },
  {
    id: 'room-002-tania-carmen',
    isDirect: true,
    streakId: null,
    createdAt: new Date('2025-02-02T08:00:00Z').toISOString(),
  },
  {
    id: 'room-003-tania-elena',
    isDirect: true,
    streakId: null,
    createdAt: new Date('2025-02-02T10:00:00Z').toISOString(),
  },
  { 
    // Ejemplo de chat grupal ligado a una racha (streak)
    id: 'room-004-reading-streak',
    isDirect: false,
    streakId: 'streak-001-reading',
    createdAt: new Date('2025-01-20T07:30:00Z').toISOString(),
  },
];

// ------------------------
// 2) CHAT MEMBERS
// ------------------------
export const MOCK_CHAT_MEMBERS: ChatMember[] = [
  // Room 1: Tania ↔ Andrés
  {
    id: 'cm-001',
    roomId: 'room-001-tania-andres',
    userId: TANIA,
    joinedAt: new Date('2025-02-01T13:00:00Z').toISOString(),
  },
  {
    id: 'cm-002',
    roomId: 'room-001-tania-andres',
    userId: ANDRES,
    joinedAt: new Date('2025-02-01T13:00:00Z').toISOString(),
  },

  // Room 2: Tania ↔ Carmen
  {
    id: 'cm-003',
    roomId: 'room-002-tania-carmen',
    userId: TANIA,
    joinedAt: new Date('2025-02-02T08:00:00Z').toISOString(),
  },
  {
    id: 'cm-004',
    roomId: 'room-002-tania-carmen',
    userId: CARMEN,
    joinedAt: new Date('2025-02-02T08:00:00Z').toISOString(),
  },

  // Room 3: Tania ↔ Elena
  {
    id: 'cm-005',
    roomId: 'room-003-tania-elena',
    userId: TANIA,
    joinedAt: new Date('2025-02-02T10:00:00Z').toISOString(),
  },
  {
    id: 'cm-006',
    roomId: 'room-003-tania-elena',
    userId: ELENA,
    joinedAt: new Date('2025-02-02T10:00:00Z').toISOString(),
  },

  // Room 4: Grupo de racha de lectura (Tania, Carmen, Elena, David)
  {
    id: 'cm-007',
    roomId: 'room-004-reading-streak',
    userId: TANIA,
    joinedAt: new Date('2025-01-20T07:30:00Z').toISOString(),
  },
  {
    id: 'cm-008',
    roomId: 'room-004-reading-streak',
    userId: CARMEN,
    joinedAt: new Date('2025-01-20T07:35:00Z').toISOString(),
  },
  {
    id: 'cm-009',
    roomId: 'room-004-reading-streak',
    userId: ELENA,
    joinedAt: new Date('2025-01-20T07:40:00Z').toISOString(),
  },
  {
    id: 'cm-010',
    roomId: 'room-004-reading-streak',
    userId: DAVID,
    joinedAt: new Date('2025-01-20T07:45:00Z').toISOString(),
  },
];

// ------------------------
// 3) MESSAGES
// ------------------------
export const MOCK_MESSAGES: Message[] = [
  // --- Room 1: Tania ↔ Andrés ---
  {
    id: 'msg-001',
    roomId: 'room-001-tania-andres',
    userId: TANIA,
    content: '¿Listo para el gym mañana?',
    createdAt: new Date('2025-02-01T13:10:00Z'),
  },
  {
    id: 'msg-002',
    roomId: 'room-001-tania-andres',
    userId: ANDRES,
    content: 'Obvio, pierna o espalda? 😎',
    createdAt: new Date('2025-02-01T13:12:00Z'),
  },
  {
    id: 'msg-003',
    roomId: 'room-001-tania-andres',
    userId: TANIA,
    content: 'Pierna, ya toca sufrir 💀',
    createdAt: new Date('2025-02-01T13:15:00Z'),
  },
  {
    id: 'msg-004',
    roomId: 'room-001-tania-andres',
    userId: ANDRES,
    content: 'Va, 9:30 en el gym de siempre.',
    createdAt: new Date('2025-02-01T13:18:00Z'),
  },

  // --- Room 2: Tania ↔ Carmen (lectura) ---
  {
    id: 'msg-005',
    roomId: 'room-002-tania-carmen',
    userId: CARMEN,
    content: '¿Ya empezaste el libro de hábitos atómicos?',
    createdAt: new Date('2025-02-02T08:10:00Z'),
  },
  {
    id: 'msg-006',
    roomId: 'room-002-tania-carmen',
    userId: TANIA,
    content: 'Sí, voy en el capítulo 3 😄',
    createdAt: new Date('2025-02-02T08:18:00Z'),
  },
  {
    id: 'msg-007',
    roomId: 'room-002-tania-carmen',
    userId: CARMEN,
    content: 'Te dije que te iba a gustar 📚',
    createdAt: new Date('2025-02-02T08:25:00Z'),
  },

  // --- Room 3: Tania ↔ Elena (meditación / salud mental) ---
  {
    id: 'msg-008',
    roomId: 'room-003-tania-elena',
    userId: ELENA,
    content: 'Hoy sí hice la meditación de 10 minutos 🙌',
    createdAt: new Date('2025-02-02T10:05:00Z'),
  },
  {
    id: 'msg-009',
    roomId: 'room-003-tania-elena',
    userId: TANIA,
    content: 'Niceee, yo la hago en la noche para dormir mejor.',
    createdAt: new Date('2025-02-02T10:08:00Z'),
  },
  {
    id: 'msg-010',
    roomId: 'room-003-tania-elena',
    userId: ELENA,
    content: 'Te paso una playlist chill si quieres 🎧',
    createdAt: new Date('2025-02-02T10:10:00Z'),
  },

  // --- Room 4: Grupo racha lectura 21 días ---
  {
    id: 'msg-011',
    roomId: 'room-004-reading-streak',
    userId: TANIA,
    content: 'Día 7 completado, ¿cómo van todos? 🔥',
    createdAt: new Date('2025-01-27T21:00:00Z'),
  },
  {
    id: 'msg-012',
    roomId: 'room-004-reading-streak',
    userId: CARMEN,
    content: 'Voy al corriente, 20 páginas hoy 💪',
    createdAt: new Date('2025-01-27T21:05:00Z'),
  },
  {
    id: 'msg-013',
    roomId: 'room-004-reading-streak',
    userId: ELENA,
    content: 'Yo me atrasé un día pero ya me puse al corriente 😅',
    createdAt: new Date('2025-01-27T21:08:00Z'),
  },
  {
    id: 'msg-014',
    roomId: 'room-004-reading-streak',
    userId: DAVID,
    content: 'Voy lento pero seguro, jajaja.',
    createdAt: new Date('2025-01-27T21:12:00Z'),
  },
  {
    id: 'msg-015',
    roomId: 'room-004-reading-streak',
    userId: TANIA,
    content: 'Lo importante es no romper la racha 💜',
    createdAt: new Date('2025-01-27T21:15:00Z'),
  },
];
