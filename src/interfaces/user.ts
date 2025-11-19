interface User {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

interface Profile {
    id: string;
    userId: string;
    fullName: string;
    avatarURL?: string | null;
    bio?: string | null;
    location?: string | null;
    user?: User;
}