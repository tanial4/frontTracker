// src/components/navigation/MessagesStack.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChatListScreen from '../../screens/chats/ChatListScreen';
import ChatRoomScreen from '../../screens/chats/ChatRoomScreen';

import PublicProfileScreen from '../../screens/profile/PublicProfileScreen';
import FriendRequestsScreen from '../../screens/firendships/FriendRequestScreen';
import FriendsScreen from '../../screens/firendships/FrienshipListScreen';

export type MessagesStackParamList = {
  ChatList: undefined;
  ChatRoom: { roomId: string };
  FriendsList: undefined;
  FriendRequests: undefined;
  PublicProfile: { userId: string };
};

const Stack = createNativeStackNavigator<MessagesStackParamList>();

export default function MessagesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',      
      }}
    >
      {/* Lista de chats */}
      <Stack.Screen name="ChatList" component={ChatListScreen} />

      {/* Chat individual */}
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={{
          headerShown: false,
          animation: 'none',     // NO animación entre screens
        }}
      />

      {/* Lista de amigos */}
      <Stack.Screen
        name="FriendsList"
        component={FriendsScreen}
        options={{ animation: 'none' }}
      />

      {/* Solicitudes */}
      <Stack.Screen
        name="FriendRequests"
        component={FriendRequestsScreen}
        options={{ animation: 'none' }}
      />

      {/* Perfil público */}
      <Stack.Screen
        name="PublicProfile"
        component={PublicProfileScreen}
        options={{
          animation: 'none', // o none si prefieres
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
