// src/lib/buildGoalProgress.ts

import { ActivityCategory, Goal, GoalCheckIn } from '../types/goal';

import { BRAND_COLORS as COLORS } from '../styles/Colors';
import { GoalProgressItem } from '../components/stats/CircularGoalProgress';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function countDailyUnits(start: Date, end: Date): number {
  const s = stripTime(start);
  const e = stripTime(end);
  const diffDays = Math.floor((e.getTime() - s.getTime()) / MS_PER_DAY);
  return Math.max(1, diffDays + 1);
}

function getWeekKey(date: Date): string {
  // Clave tipo "2025-07-03" pero por semana
  const d = stripTime(date);
  // Pasar al jueves de esa semana para calcular bien el año-semana
  const day = (d.getDay() + 6) % 7; // convertir domingo=6
  d.setDate(d.getDate() - day + 3);
  const year = d.getFullYear();

  const weekStart = new Date(year, 0, 4);
  const weekNumber =
    1 +
    Math.round(
      ((d.getTime() - weekStart.getTime()) / MS_PER_DAY - 3) / 7
    );

  return `${year}-W${weekNumber}`;
}

function countWeeklyUnits(start: Date, end: Date): number {
  const startKey = getWeekKey(start);
  const endKey = getWeekKey(end);

  if (startKey === endKey) return 1;

  const s = stripTime(start);
  const e = stripTime(end);
  const diffWeeks = Math.floor((e.getTime() - s.getTime()) / (7 * MS_PER_DAY));
  return Math.max(1, diffWeeks + 1);
}

/**
 * Construye los datos que consume CircularGoalsProgress
 * a partir de Goals + GoalCheckIns de un usuario.
 */
export function buildGoalProgressForUser(
userId: string, goals: Goal[], checkins: GoalCheckIn[], MOCK_CATEGORIES: ActivityCategory[]): GoalProgressItem[] {
  const now = new Date();

  const userGoals = goals.filter((g) => g.userId === userId);

  const items: GoalProgressItem[] = userGoals.map((goal) => {
    const start = goal.startDate;
    const end = goal.endDate ?? now;

    const goalCheckIns = checkins.filter(
      (c) =>
        c.goalId === goal.id &&
        c.userId === userId &&
        c.done &&
        c.date >= start &&
        c.date <= end
    );

    let totalUnits = 1;
    let completedUnits = 0;

    if (goal.targetType === 'DAILY') {
      totalUnits = countDailyUnits(start, end);

      const uniqueDays = new Set<string>();
      goalCheckIns.forEach((c) => {
        const d = stripTime(c.date);
        uniqueDays.add(d.toISOString().slice(0, 10)); // YYYY-MM-DD
      });
      completedUnits = uniqueDays.size;
    } else if (goal.targetType === 'WEEKLY') {
      totalUnits = countWeeklyUnits(start, end);

      const uniqueWeeks = new Set<string>();
      goalCheckIns.forEach((c) => {
        uniqueWeeks.add(getWeekKey(c.date));
      });
      completedUnits = uniqueWeeks.size;
    } else {
      // Por si más adelante agregas MONTHLY u otro tipo:
      totalUnits = 1;
      completedUnits = goalCheckIns.length > 0 ? 1 : 0;
    }

    let percentage =
      totalUnits > 0
        ? (completedUnits / totalUnits) * 100
        : 0;

    // Clamp 0–100
    percentage = Math.max(0, Math.min(100, Math.round(percentage)));

    const label = goal.category?.name ?? goal.title;
    const color = goal.category?.color ?? COLORS.PRIMARY;

    const item: GoalProgressItem = {
      id: goal.id,
      label,
      percentage,
      color,
      categoryId: goal.category?.id ?? null,
    };

    return item;
  });

  // Ordenar por porcentaje desc y ya, el componente se encarga de cortar a 5
  return items.sort((a, b) => b.percentage - a.percentage);
}
