import { GoalCheckIn } from "../types/goal";

// L = lunes, M = martes, X = miércoles, etc.
export type WeekDayKey = 'L' | 'M' | 'X' | 'J' | 'V' | 'S' | 'D';

export const WEEK_DAY_KEYS: WeekDayKey[] = [
  'L',
  'M',
  'X',
  'J',
  'V',
  'S',
  'D',
];

/**
 * Regresa el lunes de la semana de 'date'
 * (sin tocar la hora, solo cambia el día)
 */
export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = dom, 1 = lun, ...
  // Queremos que lunes sea el inicio → 1
  const diff = (day + 6) % 7; // transforma: dom=6, lun=0, mar=1, ...
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Regresa el domingo de la misma semana de 'date'
 */
export function getEndOfWeek(date: Date): Date {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Dado un Date, te regresa la clave de día:
 * L, M, X, J, V, S o D (basado en getDay()).
 */
export function getWeekDayKey(date: Date): WeekDayKey {
  const jsDay = date.getDay(); // 0 = dom, 1 = lun, ...
  // Mapeo a índice 0–6 comenzando en lunes
  const index = (jsDay + 6) % 7;
  return WEEK_DAY_KEYS[index];
}

/**
 * Construye un mapa { L: boolean, M: boolean, ... }
 * marcando en true si hay al menos un check-in 'done'
 * de esa meta en la semana actual.
 */
export function buildWeekCheckinMapForGoal(
  goalId: string,
  allCheckins: GoalCheckIn[],
  today: Date = new Date()
): Record<WeekDayKey, boolean> {
  const start = getStartOfWeek(today);
  const end = getEndOfWeek(today);

  const weekMap: Record<WeekDayKey, boolean> = {
    L: false,
    M: false,
    X: false,
    J: false,
    V: false,
    S: false,
    D: false,
  };

  allCheckins.forEach((chk) => {
    if (chk.goalId !== goalId) return;
    if (!chk.done) return;

    const d = new Date(chk.date);

    if (d < start || d > end) return;

    const key = getWeekDayKey(d);
    weekMap[key] = true;
  });

  return weekMap;
}

/**
 * Versión alternativa si quieres contar cuántos check-ins
 * hubo por día en vez de solo booleanos.
 */
export function buildWeekCheckinCountForGoal(
  goalId: string,
  allCheckins: GoalCheckIn[],
  today: Date = new Date()
): Record<WeekDayKey, number> {
  const start = getStartOfWeek(today);
  const end = getEndOfWeek(today);

  const counts: Record<WeekDayKey, number> = {
    L: 0,
    M: 0,
    X: 0,
    J: 0,
    V: 0,
    S: 0,
    D: 0,
  };

  allCheckins.forEach((chk) => {
    if (chk.goalId !== goalId) return;
    if (!chk.done) return;

    const d = new Date(chk.date);
    if (d < start || d > end) return;

    const key = getWeekDayKey(d);
    counts[key] += 1;
  });

  return counts;
}
