// src/data/mockData.ts

// --- 1. Datos del Usuario Autenticado ---
export const MOCK_USER_DATA = {
    name: "Usuario Demostración",
    email: "demo@streakapp.com",
    memberSince: "Enero 2024",
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