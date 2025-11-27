// src/services/usersApi.ts
import { api } from './apiClient';

export interface BackendUser {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendProfile {
  id: string;
  userId: string;
  fullName: string | null;
  avatarUrl: string | null;
  bio: string | null;
}

// 🔹 OBTENER MIS DATOS DE USER (NO INCLUYE PROFILE)
export async function getMe(): Promise<BackendUser> {
  const res = await api.get<BackendUser>('/users/me');
  return res.data;
}

// 🔹 OBTENER SOLO MI PROFILE
export async function getMyProfile(): Promise<BackendProfile | null> {
  const res = await api.get<BackendProfile | null>('/users/me/profile');
  // si no existe perfil, el backend devolverá null
  return res.data;
}

// 🔹 ACTUALIZAR MI PERFIL (usa PATCH /users/me que hace upsert del profile)
export async function updateMyProfile(dto: {
  fullName: string;
  avatarUrl?: string | null;
  bio?: string | null;
}): Promise<BackendProfile> {
  const res = await api.patch<BackendProfile>('/users/me', dto);
  return res.data;
}

// 🔹 BORRAR MI CUENTA
export async function deleteMyAccount() {
  return api.delete('/users/me');
}
