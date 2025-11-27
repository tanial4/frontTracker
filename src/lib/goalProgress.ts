// src/lib/buildGoalProgress.ts

import { ActivityCategory, Goal, GoalCheckIn } from '../types/goal';
import { BRAND_COLORS as COLORS } from '../styles/Colors';
import { GoalProgressItem } from '../components/stats/CircularGoalProgress';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Elimina la información de hora, minutos y segundos de una fecha.
// Esto es crucial para normalizar las comparaciones y asegurar que
// un check-in hecho a las 23:00 cuente igual que uno a las 08:00.
function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Calcula la duración total de la meta en días.
// Se usa para determinar el denominador en metas diarias (Total = Días totales).
function countDailyUnits(start: Date, end: Date): number {
  const s = stripTime(start);
  const e = stripTime(end);
  const diffDays = Math.floor((e.getTime() - s.getTime()) / MS_PER_DAY);
  // Sumamos 1 para que el rango sea inclusivo (ej: empezar hoy y terminar hoy es 1 día)
  return Math.max(1, diffDays + 1);
}

// Genera un identificador único para una semana específica (Ej: "2025-W12").
// Implementa lógica similar a ISO-8601 para agrupar check-ins por semana.
function getWeekKey(date: Date): string {
  const d = stripTime(date);
  
  // Ajuste para que la semana comience correctamente según el estándar (Lunes vs Domingo)
  // Convertimos Domingo (0) a 6 para facilitar el cálculo
  const day = (d.getDay() + 6) % 7; 
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

// Calcula cuántas semanas dura la meta.
// Se usa como denominador para metas semanales.
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
 * Función principal de transformación de datos (Selector).
 * Procesa las metas y el historial de registros para calcular el porcentaje de avance
 * formateado específicamente para el componente visual CircularGoalsProgress.
 */
export function buildGoalProgressForUser(
  userId: string, 
  goals: Goal[], 
  checkins: GoalCheckIn[], 
  MOCK_CATEGORIES: ActivityCategory[]
): GoalProgressItem[] {
  const now = new Date();

  // 1. Filtramos solo las metas que pertenecen al usuario actual
  const userGoals = goals.filter((g) => g.userId === userId);

  const items: GoalProgressItem[] = userGoals.map((goal) => {
    const start = goal.startDate;
    const end = goal.endDate ?? now;

    // 2. Obtenemos todos los check-ins válidos para esta meta específica
    // Deben estar dentro del rango de fechas y marcados como 'done'
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

    // 3. Calculamos el progreso según la frecuencia de la meta
    if (goal.targetType === 'DAILY') {
      totalUnits = countDailyUnits(start, end);

      // Usamos un Set para contar días únicos.
      // Esto evita que si el usuario hace 2 check-ins el mismo día, cuente doble para el progreso general.
      const uniqueDays = new Set<string>();
      goalCheckIns.forEach((c) => {
        const d = stripTime(c.date);
        uniqueDays.add(d.toISOString().slice(0, 10)); // Formato YYYY-MM-DD
      });
      completedUnits = uniqueDays.size;

    } else if (goal.targetType === 'WEEKLY') {
      totalUnits = countWeeklyUnits(start, end);

      // Similar al diario, usamos un Set para contar semanas únicas cumplidas.
      const uniqueWeeks = new Set<string>();
      goalCheckIns.forEach((c) => {
        uniqueWeeks.add(getWeekKey(c.date));
      });
      completedUnits = uniqueWeeks.size;

    } else {
      // Fallback para tipos futuros o desconocidos (ej: MONTHLY)
      totalUnits = 1;
      completedUnits = goalCheckIns.length > 0 ? 1 : 0;
    }

    // 4. Cálculo final del porcentaje
    let percentage =
      totalUnits > 0
        ? (completedUnits / totalUnits) * 100
        : 0;

    // Aseguramos que el valor esté entre 0 y 100 (clamp)
    percentage = Math.max(0, Math.min(100, Math.round(percentage)));

    // Resolución de estilo visual
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

  // 5. Ordenamos por porcentaje descendente.
  // El componente visual cortará la lista a los top 5, por lo que mostramos los de mejor desempeño.
  return items.sort((a, b) => b.percentage - a.percentage);
}