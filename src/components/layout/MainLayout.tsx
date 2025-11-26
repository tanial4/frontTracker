// src/components/layout/MainLayout.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

type  RouteName = 'Home' | 'Messages' | 'Rankings' | 'Stats' | 'Profile';

interface MainLayoutProps {
  headerTitle: string;
  children: React.ReactNode;

  // Navegación (normalmente viene de React Navigation)
  onNavigate?: (route: RouteName) => void;
  // Indica la pestaña activa para resaltar en el layout (opcional)
  activeRoute?: RouteName;

  showBackButton?: boolean;
  onBackPress?: () => void;
}

export function MainLayout({
  headerTitle,
  children,
  showBackButton = false,
  onBackPress,
  onNavigate,
  activeRoute,
}: MainLayoutProps) {
  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        {showBackButton ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
          >
            <ArrowLeft size={22} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}

        <Text style={styles.headerTitle}>{headerTitle}</Text>

        {/* Espaciador para centrar el título */}
        <View style={styles.headerSpacer} />
      </View>

      {/* CONTENIDO */}
      <View style={styles.content}>{children}</View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
  },
  header: {
    flexDirection: 'row',
  alignItems: 'center',
    paddingTop: 22,

  },
  backButton: {
    padding: 4,
  },
  headerSpacer: {
    width: 24,
  },
  headerTitle: {
    flex: 1,
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  content: {
    flex: 1,
  },
});
