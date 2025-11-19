import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, GestureResponderEvent } from 'react-native';
// 🚨 Asegúrate de que esta ruta sea correcta para tus constantes de color
import { BRAND_COLORS as COLORS } from '../../styles/Colors'; 

// --- TIPOS DE UNIÓN ---
type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type Size = "default" | "sm" | "lg" | "icon";

// 🚨 DEFINICIÓN DE INTERFACES DE MAPEO 🚨
type VariantStylesMap = Record<Variant, ViewStyle>;
type SizeStylesMap = Record<Size, ViewStyle>;
type TextVariantStylesMap = Record<Variant, TextStyle>;

interface ButtonProps {
  children: React.ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle | TextStyle | (ViewStyle | TextStyle)[]; // Acepta estilos View y Text
  textStyle?: TextStyle | TextStyle[]; 
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  disabled?: boolean;
}

// -------------------------------------------------------------
// 1. DEFINICIÓN DE MAPAS DE ESTILO (FUERA DE STYLESHEET.CREATE)
// -------------------------------------------------------------

// Mapeo de TAMAÑOS
const SIZE_MAP: SizeStylesMap = {
    default: { paddingHorizontal: 16, paddingVertical: 12, minHeight: 48 },
    sm: { paddingHorizontal: 12, paddingVertical: 8, minHeight: 36 },
    lg: { paddingHorizontal: 24, paddingVertical: 14, minHeight: 56 },
    icon: { width: 48, height: 48, padding: 0, borderRadius: 24 },
};

// Mapeo de VARIANTES
const VARIANT_MAP: VariantStylesMap = {
    default: { backgroundColor: COLORS.BUTTON_PRIMARY_BG },
    destructive: { backgroundColor: COLORS.ERROR_TEXT },
    outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.GRAY_BORDER },
    secondary: { backgroundColor: COLORS.BUTTON_SECONDARY_BG },
    ghost: { backgroundColor: 'transparent' },
    link: { backgroundColor: 'transparent', paddingVertical: 5 },
};

// Mapeo del TEXTO
const TEXT_VARIANT_MAP: TextVariantStylesMap = {
    default: { color: COLORS.BUTTON_PRIMARY_TEXT },
    destructive: { color: COLORS.WHITE },
    outline: { color: COLORS.TEXT_PRIMARY },
    secondary: { color: COLORS.TEXT_PRIMARY },
    ghost: { color: COLORS.primary },
    link: { color: COLORS.primary, textDecorationLine: 'underline', fontWeight: '500' },
};


export function Button({
  children,
  onPress,
  style,
  textStyle,
  variant = "default",
  size = "default",
  isLoading = false,
  disabled = false,
}: ButtonProps) {
  
  const isDisabled = disabled || isLoading;
  
  // 🚨 ACCESO DIRECTO A LOS MAPAS DE ESTILO 🚨
  const variantStyles = VARIANT_MAP[variant]; 
  const sizeStyles = SIZE_MAP[size];       
  const textVariantStyles = TEXT_VARIANT_MAP[variant]; 

  return (
    <TouchableOpacity
      style={[
        styles.base, 
        variantStyles, 
        sizeStyles, 
        isDisabled ? styles.disabled : null, 
        style
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color={textVariantStyles.color || COLORS.WHITE} />
      ) : (
        <Text style={[styles.textBase, textVariantStyles, textStyle]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// -------------------------------------------------------------
// 2. HOJA DE ESTILOS PLANA (Solo Base y Estado)
// -------------------------------------------------------------

const styles = StyleSheet.create({
    base: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    textBase: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    disabled: {
        opacity: 0.5,
    },
});