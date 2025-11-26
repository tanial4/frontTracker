// src/components/FriendCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

// Datos que usa la card ya "resueltos"
export interface FriendCardData {
  id: string;           // id de la amistad
  friendUserId: string; // id del usuario amigo (para abrir chat)
  fullName: string;
  username: string;
  avatarURL: string | null;
}

interface FriendCardProps {
  friend: FriendCardData;
  onPress: () => void;
}

export function FriendCard({ friend, onPress }: FriendCardProps) {
  const hasImage = !!friend.avatarURL;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.rowContainer}
    >
      <Avatar style={styles.avatar}>
        {hasImage ? (
          <AvatarImage source={{ uri: friend.avatarURL! }} />
        ) : (
          <AvatarFallback fullName={friend.fullName} />
        )}
      </Avatar>

      <View style={styles.textContainer}>
        <Text style={styles.nameText}>{friend.fullName}</Text>
        <Text style={styles.usernameText}>@{friend.username}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Contenedor tipo "row" para listas (chats, amigos, resultados de búsqueda, etc.)
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    width: '100%',
  },

  avatar: {
    marginRight: 12,
    
  },

  textContainer: {
    flexDirection: 'column',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_COLOR,
    paddingBottom: 10,
  },

  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },

  usernameText: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
  },
});

export default FriendCard;
