import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = axios.create({
  baseURL: 'http://148.220.210.0:3000',
});

// Interceptor para meter el token en cada request
api.interceptors.request.use(async (config: any) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
