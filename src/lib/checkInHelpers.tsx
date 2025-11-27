import { GoalCheckIn } from '../types/goal';

// Verifica si existe un registro de check-in para una meta específica y un usuario en la fecha actual.
// Útil para determinar el estado visual de los botones (ej: deshabilitar si ya se completó hoy).
export function hasCheckinToday(checkins: GoalCheckIn[], goalId: string, userId: string) {
  // Obtenemos la fecha del dispositivo y la normalizamos al inicio del día (00:00:00:000).
  // Esto es crucial para comparar fechas ignorando la hora exacta de ejecución.
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return checkins.some((c) => {
    // Creamos un objeto Date a partir del registro guardado y también lo normalizamos.
    const d = new Date(c.date);
    d.setHours(0, 0, 0, 0);

    // Verificamos que coincidan el ID de la meta, el usuario y la marca de tiempo (timestamp).
    return c.goalId === goalId && c.userId === userId && d.getTime() === today.getTime();
  });
}