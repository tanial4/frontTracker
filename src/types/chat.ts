// src/types/chat.ts (ejemplo)

import { UserProfile } from "./user";



export interface ChatRoom {
  id: string;
  isDirect: boolean;
  streakId?: string | null;
  createdAt: string;

  members?: ChatMember[];
  messages?: Message[];
}

export interface ChatMember {
  id: string;
  roomId: string;
  userId: string;
  joinedAt: string;

  user?: UserProfile;
}


export interface ChatListItem {
  roomId: string;
  isDirect: boolean;
  title: string;
  avatarURL: string | null;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  otherUserId?: string; // solo en DMs
}


export interface Message {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  createdAt: Date;

  user?: UserProfile;

}
