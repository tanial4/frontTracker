import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, GestureResponderEvent } from 'react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors'; 

// Definición de las variantes visuales disponibles.
// Esto permite usar el botón como <Button variant="outline" />
type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type Size = "default" | "sm" | "lg" | "icon";

// Tipado para los mapas de configuración de estilos
type VariantStylesMap = Record<Variant, ViewStyle>;
type SizeStylesMap = Record<Size, ViewStyle>;
type TextVariantStylesMap = Record<Variant, TextStyle>;

interface ButtonProps {
  children: React.ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  // Permite pasar estilos adicionales desde el padre para sobrescribir los predeterminados
  style?: ViewStyle | TextStyle | (ViewStyle | TextStyle)[]; 
  textStyle?: TextStyle | TextStyle[]; 
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  disabled?: boolean;
}

// Mapa de TAMAÑOS: Define padding y altura mínima
const SIZE_MAP: SizeStylesMap = {
  default: { paddingHorizontal: 16, paddingVertical: 12, minHeight: 48 },
  sm: { paddingHorizontal: 12, paddingVertical: 8, minHeight: 36 },
  lg: { paddingHorizontal: 24, paddingVertical: 14, minHeight: 56 },
  icon: { width: 48, height: 48, padding: 0, borderRadius: 24 },
};

// Mapa de VARIANTES (Contenedor): Define fondo y bordes
const VARIANT_MAP: VariantStylesMap = {
  default: { backgroundColor: COLORS.BUTTON_PRIMARY_BG },
  destructive: { backgroundColor: COLORS.ERROR_TEXT },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.BORDER_COLOR },
  secondary: { backgroundColor: COLORS.BUTTON_SECONDARY_BG },
  ghost: { backgroundColor: COLORS.INPUT_BACKGROUND }, // Fondo sutil para acciones terciarias
  link: { backgroundColor: 'transparent', paddingVertical: 5 },
};

// Mapa de VARIANTES (Texto): Define color y peso de fuente según el fondo
const TEXT_VARIANT_MAP: TextVariantStylesMap = {
  default: { color: COLORS.BUTTON_PRIMARY_TEXT },
  destructive: { color: COLORS.BACKGROUND_DEFAULT },
  outline: { color: COLORS.TEXT_PRIMARY },
  secondary: { color: COLORS.TEXT_PRIMARY },
  ghost: { color: COLORS.PRIMARY },
  link: { color: COLORS.PRIMARY, textDecorationLine: 'underline', fontWeight: '500' },
};

// Componente de Botón altamente reutilizable.
// Soporta estados de carga, deshabilitado y múltiples combinaciones de tamaño/estilo.
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
  
  // Bloqueamos la interacción si está cargando o explícitamente deshabilitado
  const isDisabled = disabled || isLoading;
  
  // Resolución de estilos usando los mapas estáticos definidos arriba.
  // Esto es más rápido y limpio que usar switch/case dentro del render.
  const variantStyles = VARIANT_MAP[variant]; 
  const sizeStyles = SIZE_MAP[size];       
  const textVariantStyles = TEXT_VARIANT_MAP[variant]; 

  return (
    <TouchableOpacity
      style={[
        styles.base, 
        variantStyles, 
        sizeStyles, 
        // Aplicamos opacidad visual si está deshabilitado
        isDisabled ? styles.disabled : null, 
        style // Los estilos inyectados por props tienen la última palabra (override)
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {isLoading ? (
        // Si está cargando, reemplazamos el texto por un spinner del color del texto correspondiente
        <ActivityIndicator color={textVariantStyles.color || COLORS.BACKGROUND_DEFAULT} />
      ) : (
        <Text style={[styles.textBase, textVariantStyles, textStyle]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// -------------------------------------------------------------
// 2. ESTILOS BASE (Comunes a todas las variantes)
// -------------------------------------------------------------

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  textBase: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});