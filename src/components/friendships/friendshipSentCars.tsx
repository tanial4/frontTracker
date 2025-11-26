import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserX } from 'lucide-react-native';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { Button } from '../ui/button';

interface SentFriendRequestCardProps {
  friend: {
    username: string;
    avatarURL: string | null;
  };
  // Función para cancelar/revocar la solicitud enviada
  onCancelRequest: () => void;
}

// Tarjeta visual para las solicitudes enviadas. 
// Muestra al usuario destinatario y un botón para cancelar la acción.
export function SentFriendRequestCard({
  friend,
  onCancelRequest,
}: SentFriendRequestCardProps) {
  
  const hasImage = !!friend.avatarURL;

  return (
    <View style={styles.cardContainer}>
      {/* 1. SECCIÓN SUPERIOR: Información del usuario */}
      <View style={styles.infoWrapper}>
        {/* Avatar: Prioriza la imagen, si no existe usa las iniciales */}
        <Avatar>
          {hasImage ? (
            <AvatarImage source={{ uri: friend.avatarURL! }} />
          ) : (
            <AvatarFallback fullName={friend.username} />
          )}
        </Avatar>

        {/* Datos de texto */}
        <View style={styles.textWrapper}>
          <Text style={styles.nameText}>{friend.username}</Text>
          {/* Mostramos el username de nuevo como subtítulo o metadato */}
          <Text style={styles.metaText}>
            {friend.username}
          </Text>
        </View>
      </View>

      {/* 2. SECCIÓN INFERIOR: Acciones */}
      <View style={styles.buttonContainer}>
        <Button
          onPress={onCancelRequest}
          variant="outline"
          style={styles.cancelButton}
        >
          {/* Contenido del botón con icono alineado */}
          <View style={styles.cancelContent}>
            <UserX size={15} style={{ marginRight: 5 }} color={COLORS.TEXT_PRIMARY} />
            <Text style={styles.cancelButtonText}>Cancelar solicitud</Text>
          </View>
        </Button>
      </View>
    </View>
  );
}

// -------------------------------------------------------------
// ESTILOS
// -------------------------------------------------------------

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_COLOR,
    padding: 15,
    paddingBottom: 25,
    marginBottom: 10,
  },

  // --- Información Superior ---
  infoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textWrapper: {
    marginLeft: 15,
    flex: 1,
  },
  nameText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
  },

  // --- Botón de Acción ---
  buttonContainer: {
    margin: 10,
  },
  cancelButton: {
    width: '100%',
    height: 30, // Botón compacto
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
    borderColor: COLORS.BORDER_COLOR,
    borderWidth: 1,
  },
  cancelContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SentFriendRequestCard;