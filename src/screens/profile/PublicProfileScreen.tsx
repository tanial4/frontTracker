// src/screens/profile/PublicProfileScreen.tsx

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  MapPin,
  UserPlus,
  UserX,
  CheckCircle2,
  MessageCircle,
  UserMinus,
  User,
} from 'lucide-react-native';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';

import { MOCK_PROFILES, MOCK_USERS } from '../../data/TestUserData';
import { MOCK_FRIENDSHIPS } from '../../data/TestFriendshipData';
import { Friendship } from '../../types/friendship';

// 👇 Chats
import {
  MOCK_CHAT_ROOMS,
  MOCK_CHAT_MEMBERS,
} from '../../data/TestChatData';
import InnerScreenLayout from '../../components/layout/InnerLayout';

// 👇 Layout interno


// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const getInitials = (fullName: string) => {
  if (!fullName) return 'U';
  const parts = fullName.trim().split(/\s+/);
  return (parts[0][0] + (parts[parts.length - 1]?.[0] || '')).toUpperCase();
};

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

type Props = { navigation: any; route: { params: { userId: string } } };

export function PublicProfileScreen({ navigation, route }: Props) {
  const { userId } = route.params;

  const currentUserId = MOCK_USERS[0].id;
  const profile = MOCK_PROFILES.find((p) => p.userId === userId) ?? null;
  const friendships: Friendship[] = MOCK_FRIENDSHIPS;

  const isSelf = currentUserId === userId;

  // Buscar relación actual
  const relationship = useMemo(() => {
    const f = friendships.find(
      (fr) =>
        (fr.aId === currentUserId && fr.bId === userId) ||
        (fr.bId === currentUserId && fr.aId === userId)
    );

    if (!f) return 'none';

    if (f.status === 'REJECTED') return 'rejected';
    if (f.status === 'ACCEPTED') return 'accepted';
    if (f.status === 'PENDING') {
      if (f.aId === currentUserId) return 'pendingSent';
      else return 'pendingReceived';
    }

    return 'none';
  }, [currentUserId, userId, friendships]);

  const friendship = useMemo(
    () =>
      friendships.find(
        (fr) =>
          (fr.aId === currentUserId && fr.bId === userId) ||
          (fr.bId === currentUserId && fr.aId === userId)
      ),
    [currentUserId, userId, friendships]
  );

  // ----------------- PERFIL NO ENCONTRADO -----------------
  if (!profile) {
    return (
      <InnerScreenLayout
        title="Perfil de usuario"
        onBack={() => navigation.goBack()}
      >
        <View style={styles.infoCard}>
          <Text style={styles.emptyText}>Usuario no encontrado.</Text>
        </View>
      </InnerScreenLayout>
    );
  }

  const hasImage = !!profile.avatarURL;
  const initials = getInitials(profile.fullName);
  const username = profile.user?.username ?? undefined;
  const memberSince =
    profile.user && (profile.user as any).createdAt
      ? new Date((profile.user as any).createdAt).toLocaleDateString()
      : undefined;

  // --------------------------------------------------
  // ACTION HANDLERS (luego se conectan a backend)
  // --------------------------------------------------

  const handleSendRequest = () => {
    console.log('Enviar solicitud →', userId);
  };

  const handleCancelRequest = () => {
    console.log('Cancelar solicitud →', friendship?.id);
  };

  const handleRejectRequest = () => {
    console.log('Rechazar solicitud →', friendship?.id);
  };

  const handleAcceptRequest = () => {
    console.log('Aceptar solicitud →', friendship?.id);
  };

  const handleRemoveFriend = () => {
    console.log('Eliminar amigo →', friendship?.id);
  };

  // 👉 Buscar o crear chat y navegar a ChatRoom
  const handleSendMessage = () => {
    // 1. Buscar sala directa existente
    const existingRoom = MOCK_CHAT_ROOMS.find((room: any) => {
      if (!room.isDirect) return false;

      const membersForRoom = MOCK_CHAT_MEMBERS.filter(
        (m: any) => m.roomId === room.id
      );

      const hasCurrentUser = membersForRoom.some(
        (m: any) => m.userId === currentUserId
      );
      const hasOtherUser = membersForRoom.some(
        (m: any) => m.userId === userId
      );

      return hasCurrentUser && hasOtherUser;
    });

    if (existingRoom) {
      navigation.navigate('ChatRoom', { roomId: existingRoom.id });
      return;
    }

    // 2. Crear un nuevo chat directo en memoria
    const newRoomId = `room-${MOCK_CHAT_ROOMS.length + 1}`;

    (MOCK_CHAT_ROOMS as any).push({
      id: newRoomId,
      isDirect: true,
      streakId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    (MOCK_CHAT_MEMBERS as any).push(
      { roomId: newRoomId, userId: currentUserId },
      { roomId: newRoomId, userId }
    );

    navigation.navigate('ChatRoom', { roomId: newRoomId });
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <InnerScreenLayout
      title="Perfil de usuario"
      onBack={() => navigation.goBack()}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* AVATAR + NOMBRE */}
        <View style={styles.profileHeader}>
          <Avatar style={{ width: 150, height: 150 }}>
            {hasImage ? (
              <AvatarImage source={{ uri: profile.avatarURL! }} />
            ) : (
              <AvatarFallback fullName={profile.fullName || initials} />
            )}
          </Avatar>

          <Text style={styles.fullName}>{profile.fullName}</Text>
          {username && <Text style={styles.username}>@{username}</Text>}
          {memberSince && (
            <Text style={styles.memberSince}>Miembro desde {memberSince}</Text>
          )}
        </View>

        {/* INFO EXTRA */}
        <View style={styles.infoCard}>
          {profile.location && (
            <View style={styles.infoRow}>
              <MapPin size={18} color={COLORS.TEXT_MUTED} />
              <Text style={styles.infoText}>{profile.location}</Text>
            </View>
          )}

          {profile.bio && (
            <View style={styles.bioBlock}>
              <Text style={styles.sectionTitle}>Acerca de</Text>
              <Text style={styles.bioText}>{profile.bio}</Text>
            </View>
          )}

          {!profile.bio && !profile.location && (
            <Text style={styles.emptyText}>
              Este usuario aún no ha agregado información adicional.
            </Text>
          )}
        </View>

        {/* ACCIONES DE AMISTAD / CHAT */}
        {!isSelf && (
          <View style={styles.buttonWrapper}>
            {/* Enviar solicitud */}
            {(relationship === 'none' || relationship === 'rejected') && (
              <Button
                onPress={handleSendRequest}
                style={styles.fullWidthButton}
                textStyle={styles.primaryButtonText}
              >
                <View style={styles.rowCenter}>
                  <UserPlus size={18} color={COLORS.BACKGROUND_DEFAULT} />
                  <Text
                    style={[styles.primaryButtonText, { marginLeft: 6 }]}
                  >
                    Enviar solicitud
                  </Text>
                </View>
              </Button>
            )}

            {/* Cancelar solicitud enviada por mí */}
            {relationship === 'pendingSent' && (
              <Button
                onPress={handleCancelRequest}
                variant="outline"
                style={styles.fullWidthButton}
                textStyle={styles.outlineButtonText}
              >
                <View style={styles.rowCenter}>
                  <UserX size={15} color={COLORS.TEXT_PRIMARY} />
                  <Text
                    style={[styles.outlineButtonText, { marginLeft: 6 }]}
                  >
                    Cancelar solicitud
                  </Text>
                </View>
              </Button>
            )}

            {/* Aceptar / Rechazar solicitud recibida */}
            {relationship === 'pendingReceived' && (
              <View style={styles.buttonRow}>
                <Button
                  onPress={handleRejectRequest}
                  variant="outline"
                  style={[styles.actionButton, styles.rejectButton]}
                  textStyle={styles.rejectButtonText}
                >
                  <View style={styles.rowCenter}>
                    <UserX size={15} color={COLORS.ERROR_TEXT} />
                    <Text
                      style={[styles.rejectButtonText, { marginLeft: 6 }]}
                    >
                      Rechazar
                    </Text>
                  </View>
                </Button>

                <Button
                  onPress={handleAcceptRequest}
                  style={styles.actionButton}
                  textStyle={styles.primaryButtonText}
                >
                  <View style={styles.rowCenter}>
                    <UserPlus
                      size={16}
                      color={COLORS.BACKGROUND_DEFAULT}
                    />
                    <Text
                      style={[styles.primaryButtonText, { marginLeft: 6 }]}
                    >
                      Aceptar
                    </Text>
                  </View>
                </Button>
              </View>
            )}

            {/* Ya son amigos → mensaje + eliminar */}
            {relationship === 'accepted' && (
              <>
                <Button
                  onPress={handleSendMessage}
                  style={styles.fullWidthButton}
                  textStyle={styles.primaryButtonText}
                >
                  <View style={styles.rowCenter}>
                    <MessageCircle
                      size={18}
                      color={COLORS.BACKGROUND_DEFAULT}
                    />
                    <Text
                      style={[styles.primaryButtonText, { marginLeft: 6 }]}
                    >
                      Enviar mensaje
                    </Text>
                  </View>
                </Button>

                <Button
                  onPress={handleRemoveFriend}
                  variant="outline"
                  style={[styles.fullWidthButton, { marginTop: 10 }]}
                  textStyle={styles.outlineButtonText}
                >
                  <View style={styles.rowCenter}>
                    <UserMinus size={15} color={COLORS.TEXT_PRIMARY} />
                    <Text
                      style={[styles.outlineButtonText, { marginLeft: 6 }]}
                    >
                      Eliminar amigo
                    </Text>
                  </View>
                </Button>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </InnerScreenLayout>
  );
}

// --------------------------------------------------
// STYLES
// --------------------------------------------------

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  profileHeader: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  fullName: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  username: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    marginTop: 3,
  },
  memberSince: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.PRIMARY,
  },

  infoCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 6,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
  },
  bioBlock: { marginTop: 10 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  bioText: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    fontStyle: 'italic',
  },

  buttonWrapper: {
    marginTop: 30,
    width: '100%',
  },

  fullWidthButton: {
    width: '100%',
    borderRadius: 999,
    paddingVertical: 12,
  },

  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    marginBottom: 6,
  },

  actionButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 12,
  },

  primaryButtonText: {
    color: COLORS.BACKGROUND_DEFAULT,
    fontWeight: '600',
    fontSize: 15,
  },

  outlineButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    fontSize: 14,
  },

  rejectButton: {
    borderColor: COLORS.ERROR_TEXT,
  },
  rejectButtonText: {
    color: COLORS.ERROR_TEXT,
    fontWeight: '600',
    fontSize: 14,
  },

  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PublicProfileScreen;