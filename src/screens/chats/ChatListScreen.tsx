// src/screens/chats/ChatListScreen.tsx

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MessageCircleDashed, MessageCirclePlus } from 'lucide-react-native';

import { BRAND_COLORS, BRAND_COLORS as COLORS } from '../../styles/Colors';
import { MainLayout } from '../../components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

import {
  MOCK_CHAT_ROOMS,
  MOCK_CHAT_MEMBERS,
  MOCK_MESSAGES,
} from '../../data/TestChatData';
import { MOCK_USERS, MOCK_PROFILES } from '../../data/TestUserData';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MessagesStackParamList } from '../../components/navigation/MessagesStack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../../components/navigation/types';
import { buildChatListForUser } from '../../lib/buildChatList';
import { ChatRow } from '../../components/chats/chatRow';
import { ChatListItem } from '../../types/chat';
import { SearchBar } from '../../components/ui/searchBar';


type Props = NativeStackScreenProps<MessagesStackParamList, 'ChatList'>;
type TabNav = BottomTabNavigationProp<RootTabParamList>;

const CURRENT_USER_ID = MOCK_USERS[0].id;

// Lista total de usuarios (contactos potenciales), excluyendo al usuario actual
const ALL_USERS = MOCK_PROFILES
  .map((p) => ({
    userId: p.userId,
    fullName: p.fullName,
    username: p.user?.username || 'desconocido',
    avatarURL: p.avatarURL,
  }))
  .filter((u) => u.userId !== CURRENT_USER_ID);

export function ChatListScreen({ navigation }: Props) {
  const tabNavigation =
    navigation.getParent<TabNav>() ??
    (navigation as unknown as TabNav);

  const [searchQuery, setSearchQuery] = useState('');

  const chatItems: ChatListItem[] = useMemo(
    () =>
      buildChatListForUser(
        CURRENT_USER_ID,
        MOCK_CHAT_ROOMS,
        MOCK_CHAT_MEMBERS,
        MOCK_MESSAGES,
        MOCK_USERS,
        MOCK_PROFILES
      ),
    []
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  // 🔍 Filtrar CHATS según búsqueda
  const filteredChats: ChatListItem[] = isSearching
    ? chatItems.filter((item) => {
        const title =
          (item.title ||
            (item as any).targetFullName ||
            '') as string;
        const username =
          ((item as any).targetUsername || '') as string;
        const lastMsg =
          (item.lastMessage || '') as string;

        return (
          title.toLowerCase().includes(normalizedQuery) ||
          username.toLowerCase().includes(normalizedQuery) ||
          lastMsg.toLowerCase().includes(normalizedQuery)
        );
      })
    : chatItems;

  const hasChats = chatItems.length > 0;

  // 🔍 Filtrar CONTACTOS según búsqueda
  const filteredUsers = isSearching
    ? ALL_USERS.filter(
        (u) =>
          u.fullName.toLowerCase().includes(normalizedQuery) ||
          u.username.toLowerCase().includes(normalizedQuery)
      )
    : [];

  return (
    <MainLayout
      headerTitle="Chats"
      onNavigate={(route) => tabNavigation.navigate(route)}
    >
      <View style={{ flex: 1, paddingTop: 15}}>
        {/* 🔍 Barra de búsqueda de chats + contactos */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar en chats y contactos..."
        />

        {isSearching ? (
          // 🔎 MODO BÚSQUEDA: mostramos secciones "Chats" + "Contactos"
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.searchResultsContent}
            showsVerticalScrollIndicator={false}
          >
            {/* --- Sección CHATS --- */}
            <Text style={styles.sectionTitle}>Chats</Text>

            {filteredChats.length === 0 ? (
              <Text style={styles.emptyMessage}>
                No se encontraron chats.
              </Text>
            ) : (
              filteredChats.map((item) => (
                <View key={item.roomId}>
                  <ChatRow
                    item={item}
                    onPress={() =>
                      navigation.navigate('ChatRoom', {
                        roomId: item.roomId,
                      })
                    }
                  />
                  <View style={styles.separator} />
                </View>
              ))
            )}

            {/* --- Sección CONTACTOS --- */}
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              Contactos
            </Text>

            {filteredUsers.length === 0 ? (
              <Text style={styles.emptyMessage}>
                No se encontraron contactos.
              </Text>
            ) : (
              filteredUsers.map((u) => {
                // Checar si ya hay un chat con este usuario
                const existingChat = chatItems.find(
                  (c) =>
                    (c as any).targetUserId === u.userId
                );

                return (
                  <TouchableOpacity
                    key={u.userId}
                    style={styles.userCard}
                    activeOpacity={0.85}
                    onPress={() => {
                      if (existingChat) {
                        navigation.navigate('ChatRoom', {
                          roomId: existingChat.roomId,
                        });
                      } else {
                        // Aquí luego conectas la creación real de chat
                        console.log(
                          'Crear nuevo chat con',
                          u.userId
                        );
                      }
                    }}
                  >
                    <View style={styles.userAvatarWrapper}>
                      <Avatar>
                        {u.avatarURL ? (
                          <AvatarImage
                            source={{ uri: u.avatarURL }}
                          />
                        ) : (
                          <AvatarFallback fullName={u.fullName} />
                        )}
                      </Avatar>
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>
                        {u.fullName}
                      </Text>
                      <Text style={styles.userUsername}>
                        @{u.username}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        ) : (
          // 🔁 MODO NORMAL (sin búsqueda): lo de antes
          <>
            {!hasChats ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyAvatarCircle}>
                  <MessageCircleDashed
                    size={70}
                    color={BRAND_COLORS.TEXT_MUTED + '60'}
                  />
                </View>
                <Text style={styles.emptyTitle}>
                  Aún no tienes chats
                </Text>
                <Text style={styles.emptySubtitle}>
                  Agrega amigos o acepta solicitudes de amistad
                  para empezar una conversación.
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredChats}
                keyExtractor={(item) => item.roomId}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => (
                  <View style={styles.separator} />
                )}
                renderItem={({ item }) => (
                  <ChatRow
                    item={item}
                    onPress={() =>
                      navigation.navigate('ChatRoom', {
                        roomId: item.roomId,
                      })
                    }
                  />
                )}
              />
            )}
          </>
        )}

        {/* FAB para ir a la lista de amigos */}
        <TouchableOpacity
          style={styles.newChatFab}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('FriendsList')}
        >
          <MessageCirclePlus size={22} color={COLORS.BACKGROUND_DEFAULT} />
        </TouchableOpacity>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 4,
  },
  separator: {
    height: 1,
    marginLeft: 72,
    backgroundColor: COLORS.BORDER_COLOR,
  },

  // Estado vacío
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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

  // 🔍 Resultados de búsqueda
  searchResultsContent: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_MUTED,
    marginBottom: 6,
    paddingHorizontal: 16,
  },
  emptyMessage: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  // Contactos (usuarios) en resultados de búsqueda
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  userAvatarWrapper: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  userUsername: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
  },
});

export default ChatListScreen;
