// src/components/friendships/SentFriendRequestCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserPlus, UserX, X } from 'lucide-react-native';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { Button } from '../ui/button';

interface SentFriendRequestCardProps {
  friend: {
    username: string;
    avatarURL: string | null;
  };
  onCancelRequest: () => void;
  mutualFriendsCount: number;
  timeElapsed: string; // Ejemplo: "Hace 1 hora"
}

export function SentFriendRequestCard({
  friend,
  onCancelRequest,
  mutualFriendsCount,
  timeElapsed,
}: SentFriendRequestCardProps) {
  const hasImage = !!friend.avatarURL;

  return (
    <View style={styles.cardContainer}>
      {/* 1. SECCIÓN SUPERIOR: Info y Avatar */}
      <View style={styles.infoWrapper}>
        {/* Avatar */}
        <Avatar>
          {hasImage ? (
            <AvatarImage source={{ uri: friend.avatarURL! }} />
          ) : (
            <AvatarFallback fullName={friend.username} />
          )}
        </Avatar>

        {/* Texto de Información */}
        <View style={styles.textWrapper}>
          <Text style={styles.nameText}>{friend.username}</Text>
          <Text style={styles.metaText}>
            {friend.username}
          </Text>

          {/* Badge "Pendiente" y Tiempo */}
        </View>
      </View>

      {/* 2. SECCIÓN INFERIOR: Botón de Cancelar Solicitud */}
      <View style={styles.buttonContainer}>
        <Button
          onPress={onCancelRequest}
          variant="outline"
          style={styles.cancelButton}
        >
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
// ESTILOS ESPECÍFICOS DE LA TARJETA DE SOLICITUD ENVIADA
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

  // --- Sección de Información Superior ---
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
  },

  // --- Fila de Estado y Tiempo ---
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingBadge: {
    backgroundColor: COLORS.ACCENT,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 10,
  },
  pendingBadgeText: {
    color: COLORS.BACKGROUND_DEFAULT,
    fontSize: 12,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
  },

  // --- Sección de Botón ---
  buttonContainer: {
    margin: 10,

  },
  cancelButton: {
    width: '100%',
    height: 30,
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
