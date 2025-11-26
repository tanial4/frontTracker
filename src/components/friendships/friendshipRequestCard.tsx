// src/components/friendships/FriendRequestCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserPlus, UserX } from 'lucide-react-native';
import { Button } from '../ui/button';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Friendship } from '../../types/friendship';
// import { User } from '../../types/user'; // solo si lo necesitas directamente

interface FriendRequestCardProps {
  friendship: Friendship;                // <- usamos tu interfaz
  currentUserId: string;                 // id del usuario logueado               // ej: "Hace 2 horas"
  onAccept: (friendshipId: string) => void;
  onReject: (friendshipId: string) => void;
}

export function FriendRequestCard({
  friendship,
  currentUserId,
  onAccept,
  onReject,
}: FriendRequestCardProps) {
  // ¿Soy "a" o "b"?
  const isCurrentUserA = friendship.aId === currentUserId;

  // El "otro" usuario de la relación, usando las relaciones opcionales a/b
  const friendUser = (isCurrentUserA ? friendship.b : friendship.a) ?? null;

  // Nombre a mostrar (como no tenemos Profile aquí, usamos username/email)
  const displayName =
    friendUser?.username || friendUser?.email || 'Usuario';

  const subtitle = friendUser?.email ?? `ID: ${isCurrentUserA ? friendship.bId : friendship.aId}`;

  return (
    <View style={styles.cardContainer}>
      {/* 1. Info superior */}
      <View style={styles.infoWrapper}>
        <Avatar>
          {/* No tenemos avatarURL en User, así que usamos solo iniciales */}
          <AvatarFallback fullName={displayName} />
        </Avatar>

        <View style={styles.textWrapper}>
          <Text style={styles.nameText}>{displayName}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              {subtitle}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. Botones de acción */}
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => onAccept(friendship.id)}
          variant="default"
          size="default"
          style={styles.actionButton}
          textStyle={{ fontSize: 12, fontWeight: '600' }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <UserPlus size={15} color={COLORS.BACKGROUND_DEFAULT} />
            <Text
              style={{
                color: COLORS.BACKGROUND_DEFAULT,
                fontSize: 12,
                fontWeight: '600',
                marginLeft: 5,
              }}
            >
              Aceptar
            </Text>
          </View>
        </Button>

        <Button
          onPress={() => onReject(friendship.id)}
          variant="outline"
          size="default"
          style={[styles.actionButton, styles.rejectButton]}
          textStyle={styles.rejectButtonText}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <UserX size={15} color={COLORS.TEXT_PRIMARY} />
            <Text
              style={{
                color: COLORS.TEXT_PRIMARY,
                fontSize: 12,
                fontWeight: '600',
                marginLeft: 5,
              }}
            >
              Rechazar
            </Text>
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
    borderRadius: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_COLOR,
    padding: 15,
    marginBottom: 20,
  },

  infoWrapper: {
    flexDirection: 'row',
    marginBottom: 15,
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
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.TEXT_MUTED,
    marginHorizontal: 6,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButton: {
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
    borderColor: COLORS.BORDER_COLOR,
    borderWidth: 1,
  },
  rejectButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 12,
    fontWeight: '600',
  },
});
