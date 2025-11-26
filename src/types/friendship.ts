import { User } from "./user";

export type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'BLOCKED' | 'REJECTED';

export interface Friendship {
  id: string;
  aId: string;
  bId: string;
  status: FriendshipStatus;
  createdAt: Date;      // o string, dependiendo de cómo venga del backend
  updatedAt: Date;      // o string

  // Relaciones (opcionales, porque no siempre las vas a incluir en las queries)
  a?: User;
  b?: User;
}
