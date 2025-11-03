import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Home, Users, Award, BarChart, User } from 'lucide-react-native';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';

const TABS = [
  { name: 'Inicio', icon: Home, route: 'Home' },
  { name: 'Amigos', icon: Users, route: 'Friends' },
  { name: 'Rankings', icon: Award, route: 'Rankings' },
  { name: 'Estadísticas', icon: BarChart, route: 'Stats' },
  { name: 'Perfil', icon: User, route: 'Profile' },
];

interface TabBarProps {
  
  activeRoute: string; 
  onNavigate: (route: string) => void;
}

export function BottomNavigationBar({ activeRoute, onNavigate }: TabBarProps) {

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeRoute === tab.route;
        const Icon = tab.icon;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabButton}
            onPress={() => onNavigate(tab.route)}
            activeOpacity={0.8}
          >

            <View style={isActive ? styles.iconWrapperActive : styles.iconWrapperBase}>
              <Icon 
                size={24} 
                color={isActive ? COLORS.BUTTON_PRIMARY_TEXT : COLORS.TEXT_MUTED} 
              />
            </View>
            
            <Text 
              style={[
                styles.tabLabel, 
                isActive ? styles.tabLabelActive : styles.tabLabelBase,
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
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80, 
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderColor: COLORS.GRAY_BORDER,
    paddingBottom: 5, 
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },


  iconWrapperBase: {
    padding: 10,
  },
  iconWrapperActive: {
    padding: 10,
    backgroundColor: COLORS.primary, 
    borderRadius: 8, 
  },

  tabLabelBase: {
    color: COLORS.TEXT_MUTED,
  },
  tabLabelActive: {
    color: COLORS.primary, 
    fontWeight: 'bold',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
  },
});