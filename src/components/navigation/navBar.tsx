// src/components/navigation/navBar.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Trophy, BarChart, User, MessageCircle, HomeIcon } from 'lucide-react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

const TABS = [
  { name: 'Inicio',   icon: Home,          route: 'Home' },
  { name: 'Chats',    icon: MessageCircle, route: 'Messages' },
  { name: 'Rankings', icon: Trophy,        route: 'Rankings' },
  { name: 'Stats',    icon: BarChart,      route: 'Stats' },
  { name: 'Perfil',   icon: User,          route: 'Profile' },
];

export type RouteName = 'Home' | 'Messages' | 'Rankings' | 'Stats' | 'Profile';

interface TabBarProps {
  activeRoute: RouteName;
  onNavigate: (route: RouteName) => void;
  /** 👇 Nueva prop para poder ocultar la barra */
  isVisible?: boolean;
}

export function BottomNavigationBar({
  activeRoute,
  onNavigate,
  isVisible = true,
}: TabBarProps) {
  // Si no debe ser visible, no renderizamos nada
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
            <View
              style={[
                styles.iconWrapper,
              ]}
            >
              <Icon
                size={24}
                color={isActive ? COLORS.PRIMARY : COLORS.TEXT_MUTED}
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
    height: 70,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
    borderTopWidth: 1,
    borderColor: COLORS.BORDER_COLOR,    
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconWrapper: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSelected: {
    fontWeight: 'bold',
    color: COLORS.PRIMARY
  },
  icon: {
    fontWeight: '100'
  },
  tabLabel: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
  },
  tabLabelActive: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
});
