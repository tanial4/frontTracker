// src/components/layout/Screen.tsx (Migrado a Estilos Nativos)

import React from 'react';
import { View, Platform, KeyboardAvoidingView, ScrollView, ViewStyle, StyleSheet, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// NOTA: Se eliminó 'cn' y 'className'

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  // Permite pasar estilos adicionales (StyleSheet o objetos)
  style?: ViewStyle | ViewStyle[]; 
}

export function Screen({ children, style, scrollable = false, ...props }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const Container = scrollable ? ScrollView : View;

  // 🚨 NOTA: Los colores temáticos deben definirse aquí con sus valores Hex.
  // Usamos un color de ejemplo para el fondo principal.
  const BACKGROUND_COLOR = '#FFFFFF'; // Color principal del Light Mode

  return (
    <View 
      // Estilos base: flex-1 y color de fondo
      style={[
        baseStyles.background, 
        { paddingTop: insets.top, paddingBottom: insets.bottom } // Aplica los insets
      ]}
    >
      <KeyboardAvoidingView 
        style={baseStyles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Container 
          style={[baseStyles.flexOne, style]} // Aplica estilos base y los pasados
          contentContainerStyle={!scrollable ? { flexGrow: 1 } : undefined}
          {...props}
        >
          {children}
        </Container>
      </KeyboardAvoidingView>
    </View>
  );
}

// 🚨 Definición del StyleSheet Base 🚨
const baseStyles = StyleSheet.create({
    flexOne: {
        flex: 1,
    },
    background: {
        flex: 1,
        // Usar el valor Hex directo de tu paleta Light Mode (ej. #FFFFFF)
        backgroundColor: '#FFFFFF', 
    },
});