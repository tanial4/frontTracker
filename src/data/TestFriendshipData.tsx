import { Friendship } from "../types/friendship";
import { MOCK_USERS, MOCK_PROFILES } from "./TestUserData";

export const MOCK_FRIENDSHIPS: Friendship[] = [
  // --- 1. Tania (user-001) ---
  // Tania ↔ Andrés (Aceptados)
  {
    id: "fr-001",
    aId: "user-001-tania",
    bId: "user-002-andres",
    status: "ACCEPTED",
    createdAt: new Date("2024-03-01T09:00:00Z"),
    updatedAt: new Date("2024-03-01T09:00:00Z"),
    a: MOCK_USERS.find(u => u.id === "user-001-tania")!,
    b: MOCK_USERS.find(u => u.id === "user-002-andres")!,
  },

  // Tania ↔ David (Pendiente, Tania envió)
  {
    id: "fr-002",
    aId: "user-001-tania",
    bId: "user-004-david",
    status: "PENDING",
    createdAt: new Date("2024-10-10T14:00:00Z"),
    updatedAt: new Date("2024-10-10T14:00:00Z"),
    a: MOCK_USERS.find(u => u.id === "user-001-tania")!,
    b: MOCK_USERS.find(u => u.id === "user-004-david")!,
  },

  // --- 2. Andrés (user-002) ---
  // Andrés ↔ Carmen (Pendientes)
  {
    id: "fr-003",
    aId: "user-001-tania",
    bId: "user-003-carmen",
    status: "PENDING",
    createdAt: new Date("2024-04-05T13:20:00Z"),
    updatedAt: new Date("2024-04-05T13:20:00Z"),
    a: MOCK_USERS.find(u => u.id === "user-001-tania")!,
    b: MOCK_USERS.find(u => u.id === "user-003-carmen")!,
  },

  // Andrés ↔ Elena (Pendiente, Elena envió)
  {
    id: "fr-004",
    aId: "user-005-elena",
    bId: "user-001-tania",
    status: "PENDING",
    createdAt: new Date("2024-12-01T10:30:00Z"),
    updatedAt: new Date("2024-12-01T10:30:00Z"),
    a: MOCK_USERS.find(u => u.id === "user-005-elena")!,
    b: MOCK_USERS.find(u => u.id === "user-001-tania")!,
  },

  // --- 3. Carmen (user-003) ---
  // Tania ↔ Elena (Aceptadas)
  {
    id: "fr-005",
    aId: "user-001-tania",
    bId: "user-005-elena",
    status: "ACCEPTED",
    createdAt: new Date("2024-07-12T11:45:00Z"),
    updatedAt: new Date("2024-07-12T11:45:00Z"),
    a: MOCK_USERS.find(u => u.id === "user-001-tania")!,
    b: MOCK_USERS.find(u => u.id === "user-005-elena")!,
  },

  // Carmen ↔ David (Bloqueado)
  {
    id: "fr-006",
    aId: "user-003-carmen",
    bId: "user-004-david",
    status: "BLOCKED",
    createdAt: new Date("2024-09-20T17:00:00Z"),
    updatedAt: new Date("2024-09-20T17:00:00Z"),
    a: MOCK_USERS.find(u => u.id === "user-003-carmen")!,
    b: MOCK_USERS.find(u => u.id === "user-004-david")!,
  },

  // --- 4. David (user-004) ---
  // David ↔ Elena (Aceptados)
  {
    id: "fr-007",
    aId: "user-004-david",
    bId: "user-005-elena",
    status: "ACCEPTED",
    createdAt: new Date("2024-08-18T09:15:00Z"),
    updatedAt: new Date("2024-08-18T09:15:00Z"),
    a: MOCK_USERS.find(u => u.id === "user-004-david")!,
    b: MOCK_USERS.find(u => u.id === "user-005-elena")!,
  },
];

// ------------------------------------------------------------------
// 🎯 Conversión a "Friend Request" para pantallas de solicitudes
// ------------------------------------------------------------------
export function mapFriendshipToRequest(
  friendship: Friendship,
  currentUserId: string
) {
  const isCurrentUserA = friendship.aId === currentUserId;
  const friendUser = isCurrentUserA ? friendship.b : friendship.a;

  const profile = MOCK_PROFILES.find(p => p.userId === friendUser?.id);

  return {
    id: friendship.id,
    friendUserId: friendUser?.id || null,
    fullName: profile?.fullName || friendUser?.username || "Usuario",
    username: friendUser?.username || "usuario",
    avatarURL: profile?.avatarURL || null,
    mutualFriendsCount: Math.floor(Math.random() * 8) + 1,
    timeElapsed: "Hace 2 horas",
  };
}
