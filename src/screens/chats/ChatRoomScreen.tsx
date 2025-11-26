// src/screens/chats/ChatRoomScreen.tsx

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SendHorizontal } from 'lucide-react-native';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MessagesStackParamList } from '../../components/navigation/MessagesStack';

import {
  MOCK_CHAT_ROOMS,
  MOCK_CHAT_MEMBERS,
  MOCK_MESSAGES,
} from '../../data/TestChatData';
import { MOCK_USERS, MOCK_PROFILES } from '../../data/TestUserData';
import { Message } from '../../types/chat';
import { ChatLayout } from '../../components/layout/ChatLayout';

type Props = NativeStackScreenProps<MessagesStackParamList, 'ChatRoom'>;

const CURRENT_USER_ID = MOCK_USERS[0].id;

export function ChatRoomScreen({ navigation, route }: Props) {
  const { roomId } = route.params;

  const room = MOCK_CHAT_ROOMS.find((r) => r.id === roomId);
  const members = MOCK_CHAT_MEMBERS.filter((m) => m.roomId === roomId);

  const { title, avatarURL, otherUserId } = useMemo(() => {
    if (!room) {
      return { title: 'Chat', avatarURL: null as string | null, otherUserId: null as string | null };
    }

    if (room.isDirect) {
      const other = members.find((m) => m.userId !== CURRENT_USER_ID);
      const profile =
        MOCK_PROFILES.find((p) => p.userId === other?.userId) ?? null;
      const user = MOCK_USERS.find((u) => u.id === other?.userId) ?? null;

      return {
        title: profile?.fullName || user?.username || 'Chat',
        avatarURL: profile?.avatarURL ?? null,
        otherUserId: other?.userId ?? null,
      };
    }

    return {
      title: 'Chat de grupo',
      avatarURL: null as string | null,
      otherUserId: null as string | null,
    };
  }, [room, members]);

  const initialMessages = useMemo(
    () =>
      MOCK_MESSAGES
        .filter((m) => m.roomId === roomId)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
        ),
    [roomId]
  );

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');

  const isSendDisabled = inputText.trim().length === 0;

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newMessage: Message = {
      id: `local-${Date.now()}`,
      roomId,
      userId: CURRENT_USER_ID,
      content: trimmed,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
  };

  const handleOpenProfile = () => {
    if (!otherUserId) return;
    navigation.navigate('PublicProfile', { userId: otherUserId });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.userId === CURRENT_USER_ID;

    return (
      <View
        style={[
          styles.messageRow,
          isMine ? styles.messageRowMine : styles.messageRowOther,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMine ? styles.messageBubbleMine : styles.messageBubbleOther,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMine ? styles.messageTextMine : styles.messageTextOther,
            ]}
          >
            {item.content}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isMine ? styles.messageTimeMine : styles.messageTimeOther,
            ]}
          >
            {new Date(item.createdAt).toLocaleTimeString('es-MX', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ChatLayout
      title={title}
      avatarURL={avatarURL}
      headerSubtitle="En línea"
      onBackPress={() => navigation.goBack()}
      onPressHeader={handleOpenProfile}
    >
      <KeyboardAvoidingView
        style={styles.chatBody}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <FlatList
          data={[...messages].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesContent}
          inverted
        />

        <View style={styles.inputRow}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Escribe un mensaje..."
              placeholderTextColor={COLORS.TEXT_MUTED}
              multiline
              value={inputText}
              onChangeText={setInputText}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              isSendDisabled && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            activeOpacity={isSendDisabled ? 1 : 0.8}
            disabled={isSendDisabled}
          >
            <SendHorizontal
              size={20}
              color={
                isSendDisabled
                  ? COLORS.TEXT_MUTED
                  : COLORS.BACKGROUND_DEFAULT
              }
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ChatLayout>
  );
}

const styles = StyleSheet.create({
  chatBody: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
  },
  messagesContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  messageRowMine: {
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginVertical: 2,
  },
  messageBubbleMine: {
    backgroundColor: COLORS.PRIMARY,
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: COLORS.TEXT_MUTED + '20',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    marginBottom: 2,
  },
  messageTextMine: {
    color: COLORS.BACKGROUND_DEFAULT,
  },
  messageTextOther: {
    color: COLORS.TEXT_PRIMARY,
  },
  messageTime: {
    fontSize: 10,
    textAlign: 'right',
  },
  messageTimeMine: {
    color: COLORS.BACKGROUND_DEFAULT + 'CC',
  },
  messageTimeOther: {
    color: COLORS.TEXT_MUTED,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_COLOR,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: COLORS.INPUT_BACKGROUND,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
  },
  textInput: {
    maxHeight: 100,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
});

export default ChatRoomScreen;
