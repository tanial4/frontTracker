import * as React from 'react';
import { View, Text, Image, StyleSheet, ViewProps, ImageProps, TextProps } from 'react-native';
// 🚨 Importa tus colores globales
import { BRAND_COLORS as COLORS } from '../../styles/Colors'; 
// Asume que formComponentStyles ya está definido o se eliminará si no se usa

// --- Lógica Auxiliar para Iniciales ---
const getInitials = (fullName: string): string => {
    if (!fullName) return "U";
    
    // 1. Dividir el nombre por espacios y filtrar partes vacías
    const parts = fullName.trim().split(/\s+/).filter(p => p.length > 0);
    
    if (parts.length === 0) {
        return "U";
    }
    
    // 2. Tomar la inicial del primer nombre
    const firstInitial = parts[0].charAt(0).toUpperCase();
    
    // 3. Tomar la inicial del último nombre (si existe más de uno)
    if (parts.length > 1) {
        const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
        return firstInitial + lastInitial;
    }
    
    // 4. Si solo hay una parte (ej: "Ana"), devolver solo esa inicial
    return firstInitial;
};

// --- Tipos Adaptados para RN ---
interface AvatarRootProps extends ViewProps {
  className?: string;
  // 🚨 Propiedad para controlar el texto de fallback/iniciales 🚨
  fullName?: string; 
}

interface AvatarImageProps extends ImageProps {
  className?: string;
}

interface AvatarFallbackProps extends TextProps {
  className?: string;
  // Ya no necesitamos 'children' si lo calculamos internamente, 
  // pero lo mantenemos si el padre quiere sobrescribir.
}

// -------------------------------------------------------------
// 1. Avatar (Root) - Envuelve la composición
// -------------------------------------------------------------

const Avatar = React.forwardRef<
  View, 
  AvatarRootProps
>(({ style, ...props }, ref) => (
  <View
    ref={ref}
    style={[
      styles.rootBase, 
      styles.rootSize, 
      style 
    ]}
    {...props}
  />
));
Avatar.displayName = 'Avatar';

// -------------------------------------------------------------
// 2. AvatarImage
// -------------------------------------------------------------

const AvatarImage = React.forwardRef<
  Image, 
  AvatarImageProps
>(({ className, style, ...props }, ref) => (
  <Image
    ref={ref}
    style={[
      styles.imageBase, 
      style
    ]}
    {...props}
  />
));
AvatarImage.displayName = 'AvatarImage';

// -------------------------------------------------------------
// 3. AvatarFallback (Calcula las Iniciales)
// -------------------------------------------------------------

const AvatarFallback = React.forwardRef<
  Text, 
  AvatarFallbackProps & { fullName?: string } // 🚨 Acepta fullName
>(({ className, style, children, fullName, ...props }, ref) => {
    
    const initials = (children && typeof children === 'string') 
        ? children // Si se pasa texto manualmente, lo usa
        : getInitials(fullName || ''); // 🚨 Si no se pasa children, calcula las iniciales

    return (
        <View
            style={[
                styles.fallbackBase, 
                style
            ]}
            {...props}
        >
            <Text ref={ref} style={styles.fallbackText}>
                {initials}
            </Text>
        </View>
    );
});
AvatarFallback.displayName = 'AvatarFallback';

export { Avatar, AvatarImage, AvatarFallback };

// -------------------------------------------------------------
// HOJA DE ESTILOS NATIVA (Definiciones Base)
// -------------------------------------------------------------

const styles = StyleSheet.create({
  rootBase: {
    margin: 3,
    position: 'relative', 
    flexDirection: 'row',
    overflow: 'hidden', 
    borderRadius: 9999, 
  },
  rootSize: {
    height: 40, 
    width: 40,
  },

  imageBase: {
    aspectRatio: 1, 
    height: '100%',
    width: '100%',
  },

  fallbackBase: {
    backgroundColor: COLORS.AVATAR_BACKGROUND,
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  fallbackText: {
    fontSize: 16, 
    color: COLORS.TEXT_MUTED, 
    fontWeight: 'bold',
  }
});