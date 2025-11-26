import { MOCK_USERS } from './TestUserData';
import { MOCK_CATEGORIES } from './Categories';
import { Goal, GoalCheckIn } from '../types/goal';


// Usuario actual
const CURRENT_USER = MOCK_USERS[0];

// Helper para féchas (semana del 24–30 nov 2025)
const makeDate = (d: number) => new Date(Date.UTC(2025, 10, d, 12, 0));

const MON = makeDate(24);
const TUE = makeDate(25);
const WED = makeDate(26);
const THU = makeDate(27);
const FRI = makeDate(28);
const SAT = makeDate(29);
const SUN = makeDate(30);

// Helper para categorías
const category = (name: string) =>
  MOCK_CATEGORIES.find((c) => c.name === name) ?? null;

// ---------------------------------------------------------
//                       GOALS
// ---------------------------------------------------------

export const MOCK_GOALS: Goal[] = [
  {
    id: 'goal-pomo-001',
    userId: CURRENT_USER.id,
    title: '3 Pomodoros al día',
    description: 'Sesiones de enfoque.',
    targetType: 'DAILY',
    targetValue: 3,
    startDate: makeDate(1),
    endDate: makeDate(31),
    isArchived: false,
    createdAt: makeDate(1),
    updatedAt: new Date(),
    user: CURRENT_USER,
    category: category('Pomodoro'),
  },
  {
    id: 'goal-ex-001',
    userId: CURRENT_USER.id,
    title: 'Ejercicio 4 días / semana',
    description: 'Cardio o gym.',
    targetType: 'WEEKLY',
    targetValue: 4,
    startDate: makeDate(1),
    endDate: makeDate(31),
    isArchived: false,
    createdAt: makeDate(1),
    updatedAt: new Date(),
    user: CURRENT_USER,
    category: category('Ejercicio'),
  },
  {
    id: 'goal-study-001',
    userId: CURRENT_USER.id,
    title: '2 horas de estudio',
    description: 'Distribuidos y RN.',
    targetType: 'DAILY',
    targetValue: 120,
    startDate: makeDate(1),
    endDate: makeDate(31),
    isArchived: false,
    createdAt: makeDate(1),
    updatedAt: new Date(),
    user: CURRENT_USER,
    category: category('Estudio'),
  },
  {
    id: 'goal-read-001',
    userId: CURRENT_USER.id,
    title: 'Leer 15 páginas',
    description: 'Lectura nocturna.',
    targetType: 'DAILY',
    targetValue: 15,
    startDate: makeDate(1),
    endDate: makeDate(31),
    isArchived: false,
    createdAt: makeDate(1),
    updatedAt: new Date(),
    user: CURRENT_USER,
    category: category('Lectura'),
  },
  {
    id: 'goal-med-001',
    userId: CURRENT_USER.id,
    title: 'Meditar 10 minutos',
    description: 'Mindfulness diario.',
    targetType: 'DAILY',
    targetValue: 10,
    startDate: makeDate(1),
    endDate: makeDate(31),
    isArchived: false,
    createdAt: makeDate(1),
    updatedAt: new Date(),
    user: CURRENT_USER,
    category: category('Meditación'),
  },
];

// ---------------------------------------------------------
//                 CHECKINS (SEMANA ACTUAL)
// ---------------------------------------------------------

export const MOCK_GOAL_CHECKINS: GoalCheckIn[] = [
  // ---------- POMODORO ----------
  {
    id: 'chk-pomo-mon',
    goalId: 'goal-pomo-001',
    userId: CURRENT_USER.id,
    date: MON,
    done: true,
    value: 3,
    createdAt: MON,
    goal: MOCK_GOALS[0],
    user: CURRENT_USER,
  },
  {
    id: 'chk-pomo-tue',
    goalId: 'goal-pomo-001',
    userId: CURRENT_USER.id,
    date: TUE,
    done: true,
    value: 3,
    createdAt: TUE,
    goal: MOCK_GOALS[0],
    user: CURRENT_USER,
  },
  {
    id: 'chk-pomo-wed',
    goalId: 'goal-pomo-001',
    userId: CURRENT_USER.id,
    date: WED,
    done: true,
    value: 3,
    createdAt: WED,
    goal: MOCK_GOALS[0],
    user: CURRENT_USER,
  },

  // ---------- EJERCICIO ----------
  {
    id: 'chk-ex-mon',
    goalId: 'goal-ex-001',
    userId: CURRENT_USER.id,
    date: MON,
    done: true,
    value: 45,
    createdAt: MON,
    goal: MOCK_GOALS[1],
    user: CURRENT_USER,
  },
  {
    id: 'chk-ex-wed',
    goalId: 'goal-ex-001',
    userId: CURRENT_USER.id,
    date: WED,
    done: true,
    value: 30,
    createdAt: WED,
    goal: MOCK_GOALS[1],
    user: CURRENT_USER,
  },
  {
    id: 'chk-ex-fri',
    goalId: 'goal-ex-001',
    userId: CURRENT_USER.id,
    date: FRI,
    done: true,
    value: 40,
    createdAt: FRI,
    goal: MOCK_GOALS[1],
    user: CURRENT_USER,
  },

  // ---------- ESTUDIO ----------
  {
    id: 'chk-study-mon',
    goalId: 'goal-study-001',
    userId: CURRENT_USER.id,
    date: MON,
    done: true,
    value: 130,
    createdAt: MON,
    goal: MOCK_GOALS[2],
    user: CURRENT_USER,
  },
  {
    id: 'chk-study-tue',
    goalId: 'goal-study-001',
    userId: CURRENT_USER.id,
    date: TUE,
    done: true,
    value: 120,
    createdAt: TUE,
    goal: MOCK_GOALS[2],
    user: CURRENT_USER,
  },

  // ---------- LECTURA ----------
  {
    id: 'chk-read-mon',
    goalId: 'goal-read-001',
    userId: CURRENT_USER.id,
    date: MON,
    done: true,
    value: 18,
    createdAt: MON,
    goal: MOCK_GOALS[3],
    user: CURRENT_USER,
  },
  {
    id: 'chk-read-thu',
    goalId: 'goal-read-001',
    userId: CURRENT_USER.id,
    date: THU,
    done: true,
    value: 20,
    createdAt: THU,
    goal: MOCK_GOALS[3],
    user: CURRENT_USER,
  },

  // ---------- MEDITACIÓN ----------
  {
    id: 'chk-med-mon',
    goalId: 'goal-med-001',
    userId: CURRENT_USER.id,
    date: MON,
    done: true,
    value: 10,
    createdAt: MON,
    goal: MOCK_GOALS[4],
    user: CURRENT_USER,
  },
  {
    id: 'chk-med-tue',
    goalId: 'goal-med-001',
    userId: CURRENT_USER.id,
    date: TUE,
    done: true,
    value: 12,
    createdAt: TUE,
    goal: MOCK_GOALS[4],
    user: CURRENT_USER,
  },
];
