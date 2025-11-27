import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface ChatLayoutProps {
  title: string;
  avatarURL?: string | null;
  // Subtítulo opcional, por defecto muestra "En línea"
  headerSubtitle?: string; 
  // El contenido principal del chat (lista de mensajes, input, etc.)
  children: React.ReactNode;

  onBackPress: () => void;
  // Acción opcional al tocar la info del usuario (ej: ir al perfil)
  onPressHeader?: () => void; 
}

// Layout envolvente para la pantalla de chat individual.
// Maneja la barra superior (Header) fija con navegación y muestra el contenido debajo.
export function ChatLayout({
  title,
  avatarURL,
  headerSubtitle = 'En línea',
  children,
  onBackPress,
  onPressHeader,
}: ChatLayoutProps) {
  
  const initials = getInitials(title);

  return (
    <View style={styles.screen}>
      {/* HEADER: Barra superior fija */}
      <View style={styles.header}>
        
        {/* Botón de regreso */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          // Aumentamos el área táctil para facilitar la navegación
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>

        {/* Sección central: Info del usuario (Clickable) */}
        <TouchableOpacity
          style={styles.headerCenter}
          activeOpacity={0.8}
          onPress={onPressHeader}
          // Deshabilitamos el toque si no se pasó la función onPressHeader
          disabled={!onPressHeader}
        >
          <Avatar>
            {avatarURL ? (
              <AvatarImage source={{ uri: avatarURL }} />
            ) : (
              <AvatarFallback fullName={title}>
                <Text style={styles.avatarText}>{initials}</Text>
              </AvatarFallback>
            )}
          </Avatar>

          <View style={styles.headerTextWrapper}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
            {!!headerSubtitle && (
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                {headerSubtitle}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Espaciador vacío para equilibrar visualmente el botón de atrás y centrar el texto si fuera necesario */}
        <View style={styles.headerRightSpacer} />
      </View>

      {/* CONTENIDO: Aquí se renderizan los mensajes */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

// Función auxiliar para extraer iniciales (ej: "Juan Perez" -> "JP")
function getInitials(text: string): string {
  if (!text) return 'U';
  const parts = text.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

interface Style {
  screen: ViewStyle;
  header: ViewStyle;
  backButton: ViewStyle;
  headerCenter: ViewStyle;
  headerTextWrapper: ViewStyle;
  headerRightSpacer: ViewStyle;
  headerTitle: TextStyle;
  headerSubtitle: TextStyle;
  content: ViewStyle;
  avatarText: TextStyle;
}

const styles = StyleSheet.create<Style>({
  screen: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,

    // Configuración de sombra para iOS
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,

    // Configuración de sombra para Android
    elevation: 5,
    
    // Aseguramos que el encabezado flote sobre el contenido desplazable
    zIndex: 10,
  },
  backButton: {
    padding: 4,
    marginRight: 4,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Ocupa el espacio disponible
  },
  headerTextWrapper: {
    marginLeft: 10,
    flexShrink: 1, // Permite que el texto se corte si es muy largo
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
  },
  headerRightSpacer: {
    width: 24, // Ancho similar al botón de atrás para balancear
  },
  content: {
    flex: 1,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
});

export default ChatLayout;