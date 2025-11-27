// src/components/navigation/navBar.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Trophy, BarChart, User, MessageCircle } from 'lucide-react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

// Configuración estática de las pestañas.
// Define el orden, el icono y la ruta de navegación para cada elemento.
const TABS = [
  { name: 'Inicio',   icon: Home,          route: 'Home' },
  { name: 'Chats',    icon: MessageCircle, route: 'Messages' },
  { name: 'Rankings', icon: Trophy,        route: 'Rankings' },
  { name: 'Stats',    icon: BarChart,      route: 'Stats' },
  { name: 'Perfil',   icon: User,          route: 'Profile' },
];

// Tipado estricto para las rutas disponibles en la barra inferior
export type RouteName = 'Home' | 'Messages' | 'Rankings' | 'Stats' | 'Profile';

interface TabBarProps {
  // Ruta actual para determinar qué pestaña resaltar
  activeRoute: RouteName;
  // Función que ejecuta la navegación real (generalmente navigation.navigate)
  onNavigate: (route: RouteName) => void;
  
  // Controla si la barra se muestra o no.
  // Es vital para ocultar la barra en pantallas internas (ej: Chat Detalle, Crear Meta)
  // donde necesitamos más espacio o evitar navegación accidental.
  isVisible?: boolean;
}

export function BottomNavigationBar({
  activeRoute,
  onNavigate,
  isVisible = true,
}: TabBarProps) {
  
  // Si la prop indica ocultar, no renderizamos nada (ni siquiera un contenedor vacío)
  // para que el contenido de la pantalla pueda ocupar el 100% de la altura.
  if (!isVisible) return null;

  return (
    <View style={styles.tabBarContainer}>
      {TABS.map((tab) => {
        const isActive = activeRoute === tab.route;
        const Icon = tab.icon;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabButton}
            onPress={() => onNavigate(tab.route as RouteName)}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrapper}>
              <Icon
                size={24}
                // Cambio de color: Primario si está activo, Muted si no.
                color={isActive ? COLORS.PRIMARY : COLORS.TEXT_MUTED}
                // Cambio de grosor: Hacemos el icono un poco más grueso al seleccionarlo
                strokeWidth={isActive ? 2 : 1}
              />
            </View>
            
            <Text
              style={[
                styles.tabLabel,
                isActive && styles.tabLabelActive,
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70, // Altura fija cómoda para el dedo
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
    borderTopWidth: 1,
    borderColor: COLORS.BORDER_COLOR,    
  },
  tabButton: {
    flex: 1, // Distribuye el espacio equitativamente entre las 5 pestañas
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconWrapper: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    marginTop: 4, // Pequeña separación entre icono y texto
  },
  tabLabelActive: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
});