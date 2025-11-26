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
  // Acción al tocar una tarjeta de amigo (ej: ir a su perfil o abrir chat)
  onSelectFriend?: (friendUserId: string) => void;
}

// Función auxiliar para transformar la data cruda de amistades (relaciones) 
// en datos listos para renderizar (perfiles).
// Filtra solo las aceptadas y busca la información del "otro" usuario.
const getAcceptedFriendsData = (
  friendships: Friendship[],
  currentUserId: string
): FriendCardData[] => {
  return friendships
    .filter((f) => f.status === 'ACCEPTED')
    .map((f) => {
      // Determinamos quién es el amigo en la relación.
      // Si yo soy A, mi amigo es B. Si yo soy B, mi amigo es A.
      const friendUserId = f.aId === currentUserId ? f.bId : f.aId;

      // NOTA: Aquí simulamos un "Join" con la tabla de perfiles usando datos de prueba.
      // En producción, esto probablemente vendría resuelto desde el backend o requeriría un fetch adicional.
      const profile = MOCK_PROFILES.find(
        (p) => p.userId === friendUserId
      );

      // Fallbacks seguros para evitar errores de renderizado si faltan datos
      const fullName =
        profile?.fullName || profile?.user?.username || 'Usuario';
      const username = profile?.user?.username || 'desconocido';
      const avatarURL = profile?.avatarURL || null;

      return {
        id: f.id, // ID único de la relación de amistad
        friendUserId, // ID del usuario amigo (necesario para navegación)
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
  // 1. Obtenemos la lista base de amigos transformados
  const allFriends = getAcceptedFriendsData(friendships, currentUserId);

  const normalizedQuery = (searchQuery || '').trim().toLowerCase();

  // 2. Aplicamos el filtro de búsqueda local (si existe query)
  // Filtramos tanto por nombre completo como por nombre de usuario
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

      {/* Manejo de estados vacíos: Diferenciamos entre "sin resultados de búsqueda" y "sin amigos en total" */}
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
    // Gap maneja el espaciado vertical entre tarjetas sin necesidad de margins individuales
    gap: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    padding: 20,
  },
});