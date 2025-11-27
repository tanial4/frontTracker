import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginApi, getMe, LoginResponse } from '../services/authApi';

// Definición básica del usuario.
// Debe coincidir con la estructura que devuelve el endpoint /auth/me.
type User = {
  sub: string;
  email: string;
};

// Contrato de lo que este contexto expone al resto de la aplicación.
type AuthContextValue = {
  user: User | null;
  // Estado crítico para saber si aún estamos verificando la sesión inicial
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Componente proveedor que envuelve la aplicación.
// Gestiona el ciclo de vida de la autenticación y la persistencia de tokens.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Iniciamos cargando en true para mostrar un Splash Screen mientras verificamos AsyncStorage
  const [loading, setLoading] = useState(true);

  // Efecto de inicialización (Auto-Login):
  // Se ejecuta una sola vez al montar el componente para verificar si hay una sesión guardada.
  useEffect(() => {
    const init = async () => {
      try {
        // Buscamos el token en el almacenamiento seguro del dispositivo
        const token = await AsyncStorage.getItem('accessToken');
        
        if (token) {
          // Si hay token, intentamos obtener los datos del usuario para validar que no haya expirado
          const me = await getMe();
          setUser(me);
        }
      } catch (e) {
        // Si hay error (token expirado o inválido), no hacemos nada y dejamos al usuario como null
        console.log('Error inicializando auth', e);
      } finally {
        // Independientemente del resultado, terminamos la carga para que el Router decida qué pantalla mostrar
        setLoading(false);
      }
    };
    init();
  }, []);

  // Función de inicio de sesión.
  // 1. Llama a la API.
  // 2. Guarda los tokens en el dispositivo.
  // 3. Actualiza el estado global del usuario.
  const login = async (email: string, password: string) => {
    const tokens: LoginResponse = await loginApi(email, password);
    
    // Es importante guardar ambos tokens para manejar la renovación (refresh token) en el futuro
    await AsyncStorage.setItem('accessToken', tokens.accessToken);
    await AsyncStorage.setItem('refreshToken', tokens.refreshToken);

    // Obtenemos el perfil inmediatamente después de tener el token
    const me = await getMe();
    setUser(me);
  };

  // Función de cierre de sesión.
  // Limpia el almacenamiento y el estado para redirigir al usuario al Login.
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para consumir el contexto de autenticación.
// Incluye una validación de seguridad para evitar su uso fuera del Provider.
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};