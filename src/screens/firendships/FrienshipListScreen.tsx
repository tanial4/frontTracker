// src/screens/friendships/FriendsScreen.tsx

import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { UserPlus, Users } from 'lucide-react-native';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { FriendsGrid } from '../../components/friendships/acceptedFriendList';



// Navegación
import { MessagesStackParamList } from '../../components/navigation/MessagesStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { MOCK_FRIENDSHIPS } from '../../data/TestFriendshipData';
import { MOCK_USERS } from '../../data/TestUserData';
import {
  MOCK_CHAT_ROOMS,
  MOCK_CHAT_MEMBERS,
} from '../../data/TestChatData';
import { SearchBar } from '../../components/ui/searchBar';
import InnerScreenLayout from '../../components/layout/InnerLayout';

type Props = NativeStackScreenProps<MessagesStackParamList, 'FriendsList'>;

const CURRENT_USER_ID = MOCK_USERS[0].id;

export function FriendsScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Abre el chat con ese amigo:
   */
  const handleOpenChatWithFriend = (friendUserId: string) => {
    const existingRoom = MOCK_CHAT_ROOMS.find((room: any) => {
      if (!room.isDirect) return false;

      const members = MOCK_CHAT_MEMBERS.filter(
        (m: any) => m.roomId === room.id
      );

      const hasCurrent = members.some((m: any) => m.userId === CURRENT_USER_ID);
      const hasFriend = members.some((m: any) => m.userId === friendUserId);

      return hasCurrent && hasFriend;
    });

    if (existingRoom) {
      navigation.navigate('ChatRoom', { roomId: existingRoom.id });
      return;
    }

    // Crear nuevo chat directo mock
    const newRoomId = `room-${MOCK_CHAT_ROOMS.length + 1}`;

    (MOCK_CHAT_ROOMS as any).push({
      id: newRoomId,
      isDirect: true,
      streakId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    (MOCK_CHAT_MEMBERS as any).push(
      { roomId: newRoomId, userId: CURRENT_USER_ID },
      { roomId: newRoomId, userId: friendUserId }
    );

    navigation.navigate('ChatRoom', { roomId: newRoomId });
  };

  return (
    <InnerScreenLayout
      title="Mis Amigos"
      onBack={() => navigation.goBack()}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔍 Barra de búsqueda → componente nuevo */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar amigos..."
          rightIcon={
            <TouchableOpacity
              onPress={() => navigation.navigate('FriendRequests')}
              style={{ paddingLeft: 8 }}
            >
              <UserPlus size={22} color={COLORS.PRIMARY} />
            </TouchableOpacity>
          }
        />

        {/* 🧑‍🤝‍🧑 Lista de amigos */}
        <FriendsGrid
          currentUserId={CURRENT_USER_ID}
          friendships={MOCK_FRIENDSHIPS}
          searchQuery={searchQuery}
          onSelectFriend={handleOpenChatWithFriend}
        />
      </ScrollView>
    </InnerScreenLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: 15,
    paddingBottom: 20,
  },
});

export default FriendsScreen;
