import { GoalTemplate } from "../types/goal";

// data/goal-templates.ts
export const GOAL_TEMPLATES: GoalTemplate[] = [
  {
    id: 'goal-pomo-4',
    title: '4 Pomodoros Diarios',
    description: 'Completa 4 sesiones de Pomodoro al día.',
    categoryId: 'cat-pomo',
    targetType: 'DAILY',
  },
  {
    id: 'goal-ex-30min',
    title: '30 Min de Ejercicio',
    description: 'Ejercítate al menos 30 minutos al día.',
    categoryId: 'cat-ex',
    targetType: 'DAILY',
  },
  {
    id: 'goal-study-2h',
    title: '2 Horas de Estudio',
    description: 'Dedica 2 horas diarias al estudio.',
    categoryId: 'cat-study',
    targetType: 'DAILY',
  },
  {
    id: 'goal-read-20pages',
    title: '20 Páginas de Lectura',
    description: 'Lee al menos 20 páginas cada día.',
    categoryId: 'cat-read',
    targetType: 'DAILY',
  }
];


const TARGET_TYPE_OPTIONS: { value: GoalTemplate['targetType'], label: string, subtitle: string }[] = [
    { value: 'DAILY', label: 'Diaria', subtitle: 'Completar cada día' },
    { value: 'WEEKLY', label: 'Semanal', subtitle: 'Completar cada semana' },
];