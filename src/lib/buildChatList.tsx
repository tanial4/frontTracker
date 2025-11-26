import { ChatListItem, ChatMember, ChatRoom, Message } from "../types/chat";
import { Profile, User } from "../types/user";

export function buildChatListForUser(
  currentUserId: string,
  rooms: ChatRoom[],
  members: ChatMember[],
  messages: Message[],
  users: User[],
  profiles: Profile[]
): ChatListItem[] {
  
  return rooms
    .map((room) => {
      // 1️⃣ Miembros de esta sala
      const roomMembers = members.filter(m => m.roomId === room.id);

      // 2️⃣ Último mensaje
      const roomMessages = messages
        .filter(m => m.roomId === room.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      const last = roomMessages[0] || null;

      // 3️⃣ Nombre y avatar
      let title = "Chat";
      let avatarURL: string | null = null;
      let otherUserId: string | undefined;

      if (room.isDirect) {
        // Obtener el otro usuario del chat
        const other = roomMembers.find((m) => m.userId !== currentUserId);
        otherUserId = other?.userId;

        const user = users.find((u) => u.id === otherUserId);
        const prof = profiles.find((p) => p.userId === otherUserId);

        title = prof?.fullName || user?.username || "Usuario";
        avatarURL = prof?.avatarURL || null;
      } else {
        // Grupal
        title = "Chat de grupo";
        avatarURL = null;
      }

      return {
        roomId: room.id,
        isDirect: room.isDirect,
        title,
        avatarURL,
        lastMessage: last?.content ?? "",
        lastMessageTime: last?.createdAt ?? new Date(room.createdAt),
        unreadCount: Math.floor(Math.random() * 4), // fake pero útil,
        otherUserId,
      } as ChatListItem;
    })
    // Ordenar por último mensaje
    .sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
}

