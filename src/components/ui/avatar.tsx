import * as React from 'react';
import { View, Text, Image, StyleSheet, ViewProps, ImageProps, TextProps } from 'react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors'; 

// Utilidad para extraer las iniciales de un nombre completo (ej: "Juan Perez" -> "JP").
// Maneja casos borde como espacios múltiples o nombres simples.
const getInitials = (fullName: string): string => {
    if (!fullName) return "U";
    
    // Dividimos el string por espacios y filtramos elementos vacíos
    const parts = fullName.trim().split(/\s+/).filter(p => p.length > 0);
    
    // Fallback de seguridad si el string estaba vacío o solo tenía espacios
    if (parts.length === 0) {
        return "U";
    }
    
    // Tomamos siempre la primera inicial
    const firstInitial = parts[0].charAt(0).toUpperCase();
    
    // Si existe más de una parte (nombre + apellido), tomamos la inicial del último elemento
    if (parts.length > 1) {
        const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
        return firstInitial + lastInitial;
    }
    
    // Si solo hay un nombre, devolvemos una sola letra
    return firstInitial;
};

// --- Definición de Tipos ---

interface AvatarRootProps extends ViewProps {
    className?: string;
    fullName?: string; 
}

interface AvatarImageProps extends ImageProps {
    className?: string;
}

interface AvatarFallbackProps extends TextProps {
    className?: string;
    // 'children' es opcional porque podemos calcular el texto usando 'fullName'
}

// -------------------------------------------------------------
// 1. Avatar (Root)
// Contenedor principal que define la forma circular y el tamaño base.
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
// Componente de imagen que llena el contenedor padre.
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
// 3. AvatarFallback
// Se muestra cuando la imagen no está disponible o está cargando.
// Renderiza las iniciales calculadas automáticamente o texto personalizado.
// -------------------------------------------------------------

const AvatarFallback = React.forwardRef<
    Text, 
    AvatarFallbackProps & { fullName?: string }
>(({ className, style, children, fullName, ...props }, ref) => {
    
    // Lógica de prioridad:
    // 1. Si se pasa un string directo como hijo (children), se usa eso.
    // 2. Si no, se intenta calcular las iniciales basadas en la prop fullName.
    const initials = (children && typeof children === 'string') 
        ? children 
        : getInitials(fullName || '');

    return (
        <View
            style={[
                styles.fallbackBase, 
                // Permite sobrescribir estilos (ej: color de fondo dinámico)
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
// ESTILOS BASE
// -------------------------------------------------------------

const styles = StyleSheet.create({
    rootBase: {
        margin: 3,
        position: 'relative', 
        flexDirection: 'row',
        // Importante: recorta cualquier contenido (imagen cuadrada) a la forma circular
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