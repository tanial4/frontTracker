// src/components/friendships/acceptedFriendList.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';

import { MOCK_PROFILES } from '../../data/TestUserData';
import { Friendship } from '../../types/friendship';
import { FriendCard, FriendCardData } from './friendCard';

interface FriendsGridProps {
  currentUserId: string;
  friendships: Friendship[];
  searchQuery?: string;
  onSelectFriend?: (friendUserId: string) => void;
}

// Transforma friendships ACCEPTED → FriendCardData
const getAcceptedFriendsData = (
  friendships: Friendship[],
  currentUserId: string
): FriendCardData[] => {
  return friendships
    .filter((f) => f.status === 'ACCEPTED')
    .map((f) => {
      const friendUserId = f.aId === currentUserId ? f.bId : f.aId;

      const profile = MOCK_PROFILES.find(
        (p) => p.userId === friendUserId
      );

      const fullName =
        profile?.fullName || profile?.user?.username || 'Usuario';
      const username = profile?.user?.username || 'desconocido';
      const avatarURL = profile?.avatarURL || null;

      return {
        id: f.id, // id de la amistad
        friendUserId, // 👈 id del usuario amigo (para abrir chat)
        fullName,
        username,
        avatarURL,
      };
    });
};

export function FriendsGrid({
  currentUserId,
  friendships,
  searchQuery,
  onSelectFriend,
}: FriendsGridProps) {
  const allFriends = getAcceptedFriendsData(friendships, currentUserId);

  const normalizedQuery = (searchQuery || '').trim().toLowerCase();

  const visibleFriends = normalizedQuery
    ? allFriends.filter((f) => {
        const name = f.fullName.toLowerCase();
        const user = f.username.toLowerCase();
        return (
          name.includes(normalizedQuery) || user.includes(normalizedQuery)
        );
      })
    : allFriends;

  const friendsCount = visibleFriends.length;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Amigos Activos</Text>

      {friendsCount === 0 ? (
        <Text style={styles.emptyMessage}>
          {normalizedQuery
            ? 'No se encontraron amigos con ese nombre.'
            : 'Aún no tienes amigos activos.'}
        </Text>
      ) : (
        <View style={styles.cardList}>
          {visibleFriends.map((friend) => (
            <FriendCard
              key={friend.id}
              friend={friend}
              onPress={() =>
                onSelectFriend && onSelectFriend(friend.friendUserId)
              }
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 15,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 10,
    marginLeft: 20,
  },
  cardList: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    padding: 20,
  },
});
