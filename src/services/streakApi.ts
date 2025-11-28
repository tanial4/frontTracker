// src/services/streaksApi.ts

import { CreateStreakRequest, ListCheckinsParams, RecordCheckinRequest, Streak, StreakCheckin, StreakStats } from '../types/streak';
import { api } from './apiClient';

/* ------------------------------------------------------------------
 * 1. Crear racha
 * POST /streaks
 * ------------------------------------------------------------------ */
export async function createStreak(payload: CreateStreakRequest): Promise<Streak> {
  // Mapeo front → backend (startdate → startDate)
  const dto = {
    title: payload.title,
    description: payload.description ?? undefined,
    startDate: payload.startdate,
    endDate: payload.endDate ?? undefined,
  };

  const res = await api.post<Streak>('/streaks', dto);
  return res.data;
}

/* ------------------------------------------------------------------
 * 2. Listar mis rachas
 * GET /streaks
 * ------------------------------------------------------------------ */
export async function listMyStreaks(): Promise<Streak[]> {
  const res = await api.get<Streak[]>('/streaks');
  return res.data;
}

/* ------------------------------------------------------------------
 * 3. Agregar miembro directamente a una racha (OWNER only)
 * POST /streaks/:streakId/members { userId }
 * ------------------------------------------------------------------ */
export async function addStreakMember(streakId: string, userId: string) {
  const res = await api.post(`/streaks/${streakId}/members`, { userId });
  return res.data;
}

/* ------------------------------------------------------------------
 * 4. Invitar usuario a una racha (envía notificación de invitación)
 * POST /streaks/:streakId/invite { userId }
 * ------------------------------------------------------------------ */
export async function inviteUserToStreak(streakId: string, targetUserId: string) {
  const res = await api.post(`/streaks/${streakId}/invite`, { userId: targetUserId });
  return res.data;
}

/* ------------------------------------------------------------------
 * 5. Aceptar invitación a una racha
 * POST /streaks/:streakId/invitations/accept
 * ------------------------------------------------------------------ */
export async function acceptStreakInvite(streakId: string) {
  const res = await api.post(`/streaks/${streakId}/invitations/accept`, {});
  return res.data;
}

/* ------------------------------------------------------------------
 * 6. Rechazar invitación a una racha
 * POST /streaks/:streakId/invitations/reject
 * ------------------------------------------------------------------ */
export async function rejectStreakInvite(streakId: string) {
  const res = await api.post(`/streaks/${streakId}/invitations/reject`, {});
  return res.data;
}

/* ------------------------------------------------------------------
 * 7. Remover miembro de una racha (OWNER only)
 * DELETE /streaks/:streakId/members/:memberUserId
 * ------------------------------------------------------------------ */
export async function removeStreakMember(streakId: string, memberUserId: string) {
  const res = await api.delete(`/streaks/${streakId}/members/${memberUserId}`);
  return res.data;
}

/* ------------------------------------------------------------------
 * 8. Registrar check-in de racha para un día (idempotente)
 * POST /streaks/:streakId/checkins
 * body: { date, done?, metadata? }
 * ------------------------------------------------------------------ */
export async function recordStreakCheckin(
  streakId: string,
  payload: RecordCheckinRequest,
): Promise<StreakCheckin> {
  const res = await api.post<StreakCheckin>(`/streaks/${streakId}/checkins`, payload);
  return res.data;
}

/* ------------------------------------------------------------------
 * 9. Listar check-ins de una racha
 * GET /streaks/:streakId/checkins?memberId=&from=&to=
 * ------------------------------------------------------------------ */
export async function listStreakCheckins(
  streakId: string,
  params: ListCheckinsParams = {},
): Promise<StreakCheckin[]> {
  const res = await api.get<StreakCheckin[]>(`/streaks/${streakId}/checkins`, {
    params: {
      memberId: params.memberId,
      from: params.from,
      to: params.to,
    },
  });
  return res.data;
}

/* ------------------------------------------------------------------
 * 10. Obtener estadísticas de racha para un miembro
 * GET /streaks/:streakId/stats?memberId=
 * - Si no se pasa memberId, el backend usa el userId actual
 * ------------------------------------------------------------------ */
export async function getStreakStats(
  streakId: string,
  memberId?: string,
): Promise<StreakStats> {
  const res = await api.get<StreakStats>(`/streaks/${streakId}/stats`, {
    params: memberId ? { memberId } : undefined,
  });
  return res.data;
}
