// src/data/mockData.ts

// --- 1. Datos del Usuario Autenticado ---
export const MOCK_USER_DATA: User = {
    id: 'user-abc-123',
    email: 'tania@streakapp.com',
    username: 'TaniaDev',
    passwordHash: 'hashed_password_example_123',
    createdAt: new Date('2024-01-15T08:00:00Z'),
    updatedAt: new Date('2025-11-12T10:00:00Z'),
};

export const MOCK_USER_PROFILE: Profile = {
    id: 'profile-xyz-456',
    userId: MOCK_USER_DATA.id,
    fullName: 'Tania Rodríguez',
    avatarURL: 'https://cdn.example.com/avatar/tania.jpg', // Example remote URL
    bio: 'Apasionada por el desarrollo personal y la productividad. 🚀',
    location: 'Madrid, España',
    user: MOCK_USER_DATA,
};

// --- 2. Datos de Estadísticas ---
export const MOCK_USER_STATS = {
    achievements: 23,
    longestStreak: 45,
};

// --- 3. Datos del Navegador Inferior ---
export const NAVIGATION_TABS = [
    { name: 'Inicio', route: 'Home' },
    { name: 'Amigos', route: 'Friends' },
    { name: 'Rankings', route: 'Rankings' },
    { name: 'Estadísticas', route: 'Stats' },
    { name: 'Perfil', route: 'Profile' },
];

export const ACTIVE_ROUTE = 'Profile'; // Simula que estamos en la pestaña de Perfil