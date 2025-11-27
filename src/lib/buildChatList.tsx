import { ChatListItem, ChatMember, ChatRoom, Message } from "../types/chat";
import { Profile, User } from "../types/user";

// Función de utilidad central para la lista de chats.
// Transforma y cruza los datos crudos (relacionales) de la base de datos
// en una estructura plana y ordenada, lista para ser renderizada por la UI.
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
      // 1. Identificamos a los participantes de esta sala específica
      const roomMembers = members.filter(m => m.roomId === room.id);

      // 2. Obtenemos el historial de mensajes para mostrar el "último mensaje" (preview)
      // Ordenamos por fecha descendente para tener el más reciente al principio.
      const roomMessages = messages
        .filter(m => m.roomId === room.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      const last = roomMessages[0] || null;

      // 3. Resolución de metadatos visuales (Título y Avatar)
      let title = "Chat";
      let avatarURL: string | null = null;
      let otherUserId: string | undefined;

      if (room.isDirect) {
        // Lógica para chats 1 a 1:
        // Buscamos al participante que NO es el usuario actual.
        const other = roomMembers.find((m) => m.userId !== currentUserId);
        otherUserId = other?.userId;

        // Cruzamos IDs con las tablas de Usuarios y Perfiles para obtener nombres reales
        const user = users.find((u) => u.id === otherUserId);
        const prof = profiles.find((p) => p.userId === otherUserId);

        // Prioridad de nombre: Perfil (Nombre completo) > Usuario (Username) > Fallback
        title = prof?.fullName || user?.username || "Usuario";
        avatarURL = prof?.avatarURL || null;
      } else {
        // Lógica para grupos:
        // Actualmente estático, pero aquí se podría mostrar el nombre del grupo
        // o una lista concatenada de miembros.
        title = "Chat de grupo";
        avatarURL = null;
      }

      // Construcción del objeto final para la vista
      return {
        roomId: room.id,
        isDirect: room.isDirect,
        title,
        avatarURL,
        // Si no hay mensajes, mostramos string vacío. Si no hay fecha, usamos la creación de la sala.
        lastMessage: last?.content ?? "",
        lastMessageTime: last?.createdAt ?? new Date(room.createdAt),
        // Nota: El contador de no leídos es simulado (mock) por ahora.
        // En producción, esto debería calcularse comparando la fecha de lectura del miembro con los mensajes.
        unreadCount: Math.floor(Math.random() * 4), 
        otherUserId,
      } as ChatListItem;
    })
    // Ordenamiento global: Coloca las conversaciones con actividad más reciente al inicio de la lista.
    .sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
}