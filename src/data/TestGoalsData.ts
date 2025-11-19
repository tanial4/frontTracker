import { ActivityCategory, Goal, GoalCheckIn } from '../interfaces/goal';
import { BRAND_COLORS } from '../styles/Colors';
import { MOCK_CATEGORIES } from './Categories';

// --- CONSTANTES BASE ---
const USER_ID_MOCK = 'user-abc-123';
const MOCK_USER: User = {
    id: USER_ID_MOCK,
    email: 'tania@streakapp.com',
    username: 'TaniaDev',
    passwordHash: 'fakehash',
    createdAt: new Date('2024-01-15T08:00:00Z'),
    updatedAt: new Date(),
};


// --- FECHAS DE EJEMPLO ---
const TODAY = new Date();
const YESTERDAY = new Date(TODAY.setDate(TODAY.getDate() - 1));
const LAST_WEEK = new Date(TODAY.setDate(TODAY.getDate() - 7));


// -------------------------------------------------------------
// 1. METAS (Goal[])
// -------------------------------------------------------------

export const MOCK_GOALS: Goal[] = [
    // Meta 1: Pomodoro (Diaria, Meta numérica de 4)
    {
        id: 'goal-001',
        userId: USER_ID_MOCK,
        title: 'Sesiones de Concentración',
        description: 'Completar 4 sesiones diarias de 25 minutos.',
        targetType: 'daily',
        targetValue: 4,
        startDate: LAST_WEEK,
        isArchived: false,
        createdAt: LAST_WEEK,
        updatedAt: LAST_WEEK,
        user: MOCK_USER,
        category: MOCK_CATEGORIES[0], // Pomodoro
    },
    // Meta 2: Ejercicio (Semanal, Meta simple de 3 veces)
    {
        id: 'goal-002',
        userId: USER_ID_MOCK,
        title: 'Entrenar la Semana',
        targetType: 'weekly',
        targetValue: 3,
        startDate: LAST_WEEK,
        isArchived: false,
        createdAt: LAST_WEEK,
        updatedAt: LAST_WEEK,
        user: MOCK_USER,
        category: MOCK_CATEGORIES[1], // Ejercicio
    },
    // Meta 3: Estudio (Diaria, Meta simple de 'done')
    {
        id: 'goal-003',
        userId: USER_ID_MOCK,
        title: 'Estudiar 1 hora',
        targetType: 'daily',
        startDate: new Date('2025-10-01'),
        isArchived: false,
        createdAt: new Date('2025-10-01'),
        updatedAt: new Date('2025-10-01'),
        user: MOCK_USER,
        category: MOCK_CATEGORIES[2], // Estudio
    },
];


// -------------------------------------------------------------
// 2. REGISTROS DE PROGRESO (GoalCheckIn[])
// -------------------------------------------------------------

export const MOCK_CHECKINS: GoalCheckIn[] = [
    // Registro 1: Pomodoro (Valor registrado: 3, Objetivo: 4 -> No completado)
    {
        id: 'check-001',
        goalId: 'goal-001',
        userId: USER_ID_MOCK,
        date: YESTERDAY,
        value: 3, 
        done: false,
        createdAt: YESTERDAY,
        goal: MOCK_GOALS[0],
        user: MOCK_USER,
    },
    // Registro 2: Ejercicio (Completado: 1 sesión)
    {
        id: 'check-002',
        goalId: 'goal-002',
        userId: USER_ID_MOCK,
        date: TODAY,
        value: 1, 
        done: true,
        createdAt: TODAY,
        goal: MOCK_GOALS[1],
        user: MOCK_USER,
    },
    // Registro 3: Estudio (Completado: bool)
    {
        id: 'check-003',
        goalId: 'goal-003',
        userId: USER_ID_MOCK,
        date: YESTERDAY,
        value: undefined, 
        done: true,
        createdAt: YESTERDAY,
        goal: MOCK_GOALS[2],
        user: MOCK_USER,
    },
];