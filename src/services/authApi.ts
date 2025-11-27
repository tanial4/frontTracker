import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './apiClient';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

export interface PublicUser {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export async function login(email: string, password: string) {
  const res: any = await api.post('/auth/login', {
    email,
    password
  });

   const { accessToken, refreshToken, user } = res.data;

  await AsyncStorage.multiSet([
    ['accessToken', accessToken],
    ['refreshToken', refreshToken],
    ['currentUser', JSON.stringify(user)],
  ]);
  return res.data as LoginResponse;
}

export async function signup(payload: {
  username: string;
  email: string;
  password: string;
}) {
  const { data } = await api.post('/auth/signup', payload);
  return data;
}

export async function getMe() {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function logout() {
  await api.post('/auth/logout');
}
