// src/components/layout/InnerScreenLayout.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

interface InnerScreenLayoutProps {
  title: string;
  children: React.ReactNode;
  onBack: () => void;

  /** Opcional: algo en la esquina derecha del header (botón, icono, etc.) */
  rightSlot?: React.ReactNode;

  /** Permitir sobreescribir estilos si algún día lo necesitas */
  containerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  titleStyle?: TextStyle;
}

export function InnerScreenLayout({
  title,
  children,
  onBack,
  rightSlot,
  containerStyle,
  headerStyle,
  titleStyle,
}: InnerScreenLayoutProps) {
  return (
    <View style={[styles.screen, containerStyle]}>
      {/* HEADER INTERNO */}
      <View style={[styles.header, headerStyle]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>

        <Text
          style={[styles.headerTitle, titleStyle]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {/* Slot derecho opcional (badge, botón, etc.) */}
        <View style={styles.rightSlot}>
          {rightSlot}
        </View>
      </View>

      {/* CONTENIDO */}
      <View style={styles.content}>
        {children}
      </View>
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
    paddingTop: 18,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  rightSlot: {
    minWidth: 24,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
});

export default InnerScreenLayout;
