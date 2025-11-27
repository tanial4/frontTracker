// Constantes para visualizar los días de la semana en la UI (formato español de una letra).
// Usamos 'X' para Miércoles para distinguirlo del Martes.
export const WEEKDAY_LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'] as const;

// Tipo de utilidad para asegurar que los índices de día siempre estén entre 0 y 6.
export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Genera un arreglo con las 7 fechas correspondientes a la semana en curso.
 * La semana se calcula de Lunes a Domingo.
 * * @returns Array de objetos Date normalizados (Lunes, Martes... Domingo)
 */
export function getCurrentWeekDays(): Date[] {
  const today = new Date();
  const jsDay = today.getDay(); // Nativo JS: 0 = Domingo, 1 = Lunes ... 6 = Sábado

  // Calculamos cuántos días hay que retroceder para llegar al Lunes.
  // La fórmula (day + 6) % 7 convierte el índice nativo al nuestro:
  // Domingo (0) -> 6
  // Lunes (1) -> 0
  const diffToMonday = (jsDay + 6) % 7;

  // Creamos una nueva fecha posicionada en el Lunes de esta semana
  const monday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - diffToMonday
  );

  // Generamos el arreglo iterando 7 veces y sumando un día en cada paso
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

/**
 * Obtiene el índice del día ajustado para que la semana empiece en Lunes.
 * * @param date Fecha a evaluar
 * @returns 0 para Lunes ... 6 para Domingo
 */
export function getWeekdayIndex(date: Date): WeekdayIndex {
  const jsDay = date.getDay(); 
  return ((jsDay + 6) % 7) as WeekdayIndex;
}

/**
 * Devuelve la letra visual (L, M, X...) correspondiente a una fecha dada.
 * Se usa principalmente para las etiquetas de las barras de progreso semanal.
 */
export function getWeekdayLetter(date: Date): string {
  return WEEKDAY_LETTERS[getWeekdayIndex(date)];
}

/**
 * Compara si dos fechas caen en el mismo día del calendario.
 * Ignora las diferencias de hora, minuto y segundo.
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}