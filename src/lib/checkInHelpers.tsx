// src/lib/checkinHelpers.ts
import { GoalCheckIn } from '../types/goal';

export function hasCheckinToday(checkins: GoalCheckIn[], goalId: string, userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return checkins.some((c) => {
    const d = new Date(c.date);
    d.setHours(0, 0, 0, 0);
    return c.goalId === goalId && c.userId === userId && d.getTime() === today.getTime();
  });
}
