// src/screens/friendships/FriendRequestsScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';

import { MOCK_USERS, MOCK_PROFILES } from '../../data/TestUserData';
import { RequestsSegmentBar } from '../../components/friendships/requestSegmentBar';
import SentFriendRequestCard from '../../components/friendships/friendshipSentCars';
import { FriendRequestCard } from '../../components/friendships/friendshipRequestCard';
import { mapFriendshipToRequest, MOCK_FRIENDSHIPS } from '../../data/TestFriendshipData';

// navegación
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MessagesStackParamList } from '../../components/navigation/MessagesStack';
import InnerScreenLayout from '../../components/layout/InnerLayout';
import { SearchBar } from '../../components/ui/searchBar';
import FriendCard from '../../components/friendships/friendCard';

type SegmentKey = 'received' | 'sent';

type Props = NativeStackScreenProps<MessagesStackParamList, 'FriendRequests'>;

const CURRENT_USER_ID = MOCK_USERS[0].id;

// Filtrar solicitudes
const RAW_RECEIVED = MOCK_FRIENDSHIPS.filter(
  (f) => f.status === 'PENDING' && f.bId === CURRENT_USER_ID
);
const RAW_SENT = MOCK_FRIENDSHIPS.filter(
  (f) => f.status === 'PENDING' && f.aId === CURRENT_USER_ID
);

const RECEIVED_REQUESTS = RAW_RECEIVED.map((f) =>
  mapFriendshipToRequest(f, CURRENT_USER_ID)
);

const SENT_REQUESTS = RAW_SENT.map((f) =>
  mapFriendshipToRequest(f, CURRENT_USER_ID)
);

// Construir lista TOTAL de usuarios filtrables
const ALL_USERS = MOCK_PROFILES.map((p) => ({
  userId: p.userId,
  fullName: p.fullName,
  username: p.user?.username || 'desconocido',
  avatarURL: p.avatarURL,
})).filter((u) => u.userId !== CURRENT_USER_ID); // excluirte a ti mismo

// --------------------------------------------
// PANTALLA
// --------------------------------------------
export function FriendRequestsScreen({ navigation }: Props) {
  const [activeSegment, setActiveSegment] = useState<SegmentKey>('received');
  const [searchQuery, setSearchQuery] = useState('');

  const visible =
    activeSegment === 'received'
      ? RECEIVED_REQUESTS
      : SENT_REQUESTS;

  // 🔎 Filtro de búsqueda global de usuarios
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredUsers =
    normalizedQuery.length > 0
      ? ALL_USERS.filter(
          (u) =>
            u.fullName.toLowerCase().includes(normalizedQuery) ||
            u.username.toLowerCase().includes(normalizedQuery)
        )
      : [];

  const searching = normalizedQuery.length > 0;

  return (
    <InnerScreenLayout
      title="Solicitudes de Amistad"
      onBack={() => navigation.goBack()}
      containerStyle={styles.mainContainer}
    >
      {/* 🔍 BARRA DE BÚSQUEDA GLOBAL */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Buscar usuarios..."
      />

      {searching ? (
        // 🔎 Si hay búsqueda → mostrar resultados
        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredUsers.length === 0 ? (
            <Text style={styles.emptyMessage}>No se encontraron usuarios.</Text>
          ) : (
            filteredUsers.map((u) => (
              <FriendCard
                key={u.userId}
                friend={{
                  id: `search-${u.userId}`,
                  friendUserId: u.userId,
                  fullName: u.fullName,
                  username: u.username,
                  avatarURL: u.avatarURL ?? null,
                }}
                // ⬇️ Navegar al perfil público
                onPress={() =>
                  navigation.navigate('PublicProfile', { userId: u.userId })
                }
              />
            ))
          )}
        </ScrollView>
      ) : (
        <>
          {/* SEGMENT SWITCH */}
          <View style={styles.segmentWrapper}>
            <RequestsSegmentBar
              activeSegment={activeSegment}
              onChange={(segment) => setActiveSegment(segment)}
              receivedCount={RECEIVED_REQUESTS.length}
              sentCount={SENT_REQUESTS.length}
            />
          </View>

          {/* LISTA DE SOLICITUDES */}
          <ScrollView
            style={styles.listScroll}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {visible.map((reqData) => {
              const isSent = activeSegment === 'sent';

              // Asumimos que mapFriendshipToRequest devuelve friendUserId
              const goToProfile = () =>
                navigation.navigate('PublicProfile', {
                  userId: (reqData as any).friendUserId,
                });

              if (isSent) {
                return (
                  <TouchableOpacity
                    key={reqData.id}
                    activeOpacity={0.85}
                    onPress={goToProfile}
                    style={{ marginBottom: 8 }}
                  >
                    <SentFriendRequestCard
                      friend={{
                        username: reqData.username,
                        avatarURL: reqData.avatarURL,
                      }}
                      mutualFriendsCount={reqData.mutualFriendsCount}
                      timeElapsed={reqData.timeElapsed}
                      onCancelRequest={() =>
                        console.log('Cancelar solicitud:', reqData.id)
                      }
                    />
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={reqData.id}
                  activeOpacity={0.85}
                  onPress={goToProfile}
                  style={{ marginBottom: 8 }}
                >
                  <FriendRequestCard
                    friendship={MOCK_FRIENDSHIPS.find(
                      (f) => f.id === reqData.id
                    )!}
                    currentUserId={CURRENT_USER_ID}
                    onAccept={(id) => console.log('Aceptar solicitud:', id)}
                    onReject={(id) => console.log('Rechazar solicitud:', id)}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>
      )}
    </InnerScreenLayout>
  );
}

// --------------------------------------------
// ESTILOS
// --------------------------------------------
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
  },
  segmentWrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  listScroll: { flex: 1 },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyMessage: {
    textAlign: 'center',
    color: COLORS.TEXT_MUTED,
    marginTop: 30,
    fontSize: 14,
  },
});

export default FriendRequestsScreen;
