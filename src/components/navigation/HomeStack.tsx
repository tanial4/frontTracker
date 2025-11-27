// src/components/navigation/HomeStack.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../../screens/home/HomeScreen';
import CreateGoalScreen from '../../screens/goals/CreateGoalScreen';

// Definición de tipos para las rutas disponibles en este stack específico.
// 'undefined' significa que no se requieren parámetros al navegar a estas pantallas.
export type HomeStackParamList = {
  HomeMain: undefined;
  CreateGoalScreen: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

// Stack de navegación anidado dentro de la pestaña "Home".
// Permite la navegación jerárquica (push/pop) desde el dashboard principal hacia pantallas secundarias como "Crear Meta".
export function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        // Desactivamos la cabecera nativa porque utilizamos componentes de layout propios
        // (MainLayout, InnerScreenLayout) en cada pantalla para mantener el diseño consistente.
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      
      {/* Pantalla para crear metas. Al estar en este stack, al volver atrás se regresa al Home. */}
      <Stack.Screen name="CreateGoalScreen" component={CreateGoalScreen} />
    </Stack.Navigator>
  );
}

export default HomeStackNavigator;