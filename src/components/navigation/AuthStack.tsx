// src/components/navigation/AuthStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../screens/LoginScreen';
import SignupScreen from '../../screens/SignUpScreen';

// Definición de tipos para las rutas de autenticación.
// 'undefined' significa que estas rutas no requieren parámetros obligatorios al navegar hacia ellas.
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

// Props que recibe el stack para manejar el cambio de estado global de la app.
// Estos callbacks permiten notificar al navegador raíz que el usuario se ha autenticado correctamente.
interface AuthStackProps {
  onLoginSuccess: () => void;
  onSignupSuccess: () => void;
}

// Este componente gestiona el flujo de pantallas cuando el usuario NO está logueado.
export function AuthStack({ onLoginSuccess, onSignupSuccess }: AuthStackProps) {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login"
    >
      {/* Pantalla de Login:
        Usamos una función como hijo (render callback) en lugar de la prop 'component={LoginScreen}'.
        Esto nos permite inyectar props adicionales (onLogin, onDemoLogin) directamente a la pantalla,
        manteniendo la lógica de navegación desacoplada de la lógica de estado global.
      */}
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen
            {...props} // Pasamos las props de navegación (navigation, route)
            onLogin={onLoginSuccess}
            onDemoLogin={onLoginSuccess}
            // Navegación interna dentro del stack de Auth
            onSwitchToSignup={() => props.navigation.navigate('Signup')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Signup">
        {(props) => (
          <SignupScreen
            {...props}
            onSignupSuccess={onSignupSuccess}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}