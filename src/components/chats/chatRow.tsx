import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BRAND_COLORS as COLORS } from "../../styles/Colors";
import { ChatListItem } from "../../types/chat";

interface ChatRowProps {
  item: ChatListItem;
  // Acción al tocar la fila, generalmente navegar al detalle del chat
  onPress: () => void;
}

// Componente individual para cada fila de la lista de conversaciones.
export function ChatRow({ item, onPress }: ChatRowProps) {
  const { title, avatarURL, lastMessage, lastMessageTime, unreadCount } = item;
  
  // Flag simple para renderizado condicional del badge
  const hasUnread = unreadCount > 0;

  // Formateamos la hora localmente (MX) para mostrar solo HH:MM
  const timeLabel = lastMessageTime.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity
      style={styles.rowContainer}
      activeOpacity={0.8} // Feedback visual sutil al presionar
      onPress={onPress}
    >
      {/* Sección del Avatar: Priorizamos URL, si falla o es null usamos las iniciales */}
      <Avatar>
        {avatarURL ? (
          <AvatarImage source={{ uri: avatarURL }} />
        ) : (
          <AvatarFallback fullName={title} />
        )}
      </Avatar>

      {/* Contenedor central: Nombre y preview del mensaje */}
      <View style={styles.rowTextContainer}>
        <View style={styles.rowTitleRow}>
          <Text
            style={styles.rowName}
            numberOfLines={1} // Importante: evita que nombres largos rompan el layout
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </View>

        <Text
          style={styles.rowLastMessage}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {/* Fallback visual si el chat es nuevo y no tiene mensajes previos */}
          {lastMessage || 'Nueva conversación'}
        </Text>
      </View>

      {/* Sección derecha: Hora y contador de no leídos */}
      <View style={styles.rowRightContainer}>
        <Text style={styles.rowTime}>{timeLabel}</Text>

        {hasUnread && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>
              {/* Tope visual en 9+ para mantener el badge circular y estético */}
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Estilos generales de la lista (probablemente usados por el FlatList padre)
  listContent: {
    paddingVertical: 4,
  },
  // Separador visual entre filas, con margen para alinearse al texto (saltando el avatar)
  separator: {
    height: 1,
    marginLeft: 72,
    backgroundColor: COLORS.BORDER_COLOR,
  },
  
  // Layout principal de la fila
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  
  // Área de texto flexible para ocupar el espacio restante
  rowTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  rowTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    maxWidth: '90%',
  },
  rowLastMessage: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
  },
  
  // Contenedor de metadatos (hora/badge) alineado a la derecha
  rowRightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 8,
    gap: 4,
  },
  rowTime: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
  },
  unreadBadge: {
    minWidth: 20,
    paddingHorizontal: 6,
    height: 20,
    borderRadius: 100, // Completamente redondo
    backgroundColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: COLORS.BACKGROUND_SECONDARY,
    fontSize: 11,
    fontWeight: '700',
  },

  // NOTA: Los siguientes estilos parecen ser para un estado vacío ("Empty State") 
  // o un botón flotante (FAB) que no se están usando directamente dentro de ChatRow,
  // pero se mantienen aquí si se exportan o para referencia futura.

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyAvatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.INPUT_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 20,
  },

  newChatFab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.BLACK,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});