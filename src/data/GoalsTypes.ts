import { GoalTemplate } from "../interfaces/goal";

// data/goal-templates.ts
export const GOAL_TEMPLATES: GoalTemplate[] = [
  {
    id: 'goal-pomo-4',
    title: '4 Pomodoros Diarios',
    description: 'Completa 4 sesiones de Pomodoro al día.',
    categoryId: 'cat-pomo',
    targetType: 'DAILY',
    targetValue: 4,
  },
  {
    id: 'goal-ex-30min',
    title: '30 Min de Ejercicio',
    description: 'Ejercítate al menos 30 minutos al día.',
    categoryId: 'cat-ex',
    targetType: 'DAILY',
    targetValue: 30,
  },
  {
    id: 'goal-study-2h',
    title: '2 Horas de Estudio',
    description: 'Dedica 2 horas diarias al estudio.',
    categoryId: 'cat-study',
    targetType: 'DAILY',
    targetValue: 120,
  },
  {
    id: 'goal-read-20pages',
    title: '20 Páginas de Lectura',
    description: 'Lee al menos 20 páginas cada día.',
    categoryId: 'cat-read',
    targetType: 'DAILY',
    targetValue: 20,
  },
  {
    id: 'goal-med-10min',
    title: '10 Min de Meditación',
    description: 'Medita 10 minutos diarios.',
    categoryId: 'cat-med',
    targetType: 'DAILY',
    targetValue: 10,
  },
  {
    id: 'goal-water-8cups',
    title: '8 Vasos de Agua',
    description: 'Bebe 8 vasos de agua al día.',
    categoryId: 'cat-water',
    targetType: 'DAILY',
    targetValue: 8,
  },
  {
    id: 'goal-ex-5week',
    title: '5 Entrenamientos Semanales',
    description: 'Entrena al menos 5 veces por semana.',
    categoryId: 'cat-ex',
    targetType: 'WEEKLY',
    targetValue: 5,
  },
  {
    id: 'goal-read-habit',
    title: 'Hábito de Lectura',
    description: 'Lee todos los días.',
    categoryId: 'cat-read',
    targetType: 'DAILY',
  },
];


const TARGET_TYPE_OPTIONS: { value: GoalTemplate['targetType'], label: string, subtitle: string }[] = [
    { value: 'DAILY', label: 'Diaria', subtitle: 'Completar cada día' },
    { value: 'WEEKLY', label: 'Semanal', subtitle: 'Completar cada semana' },
];