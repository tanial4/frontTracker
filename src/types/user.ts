export interface User {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Profile {
    id: string;
    userId: string;
    fullName: string;
    avatarURL?: string | null;
    bio?: string | null;
    location?: string | null;
    user?: User;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatarURL: string | null;
  createdAt: Date;
}
