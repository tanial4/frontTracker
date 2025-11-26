// src/lib/weekDateUtils.ts

// Letras para Lunes–Domingo
export const WEEKDAY_LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'] as const;
export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Devuelve un arreglo de 7 fechas (Date) que representan
 * la semana actual de Lunes a Domingo.
 */
export function getCurrentWeekDays(): Date[] {
  const today = new Date();
  const jsDay = today.getDay(); // 0 = domingo ... 6 = sábado
  const diffToMonday = (jsDay + 6) % 7; // 0 = lunes, 1 = martes, ...

  const monday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - diffToMonday
  );

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

/**
 * Índice 0–6 donde 0 = Lunes, 6 = Domingo (alineado con WEEKDAY_LETTERS)
 */
export function getWeekdayIndex(date: Date): WeekdayIndex {
  const jsDay = date.getDay(); // 0 = domingo ... 6 = sábado
  return ((jsDay + 6) % 7) as WeekdayIndex;
}

/**
 * Letra de día (L, M, X, J, V, S, D) para una fecha dada.
 */
export function getWeekdayLetter(date: Date): string {
  return WEEKDAY_LETTERS[getWeekdayIndex(date)];
}

/**
 * Compara si dos fechas son el mismo día (año+mes+día).
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
    