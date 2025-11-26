// src/styles/Colors.ts

// NOTA: Para el Modo Oscuro, debes usar lógica condicional de JavaScript (useColorScheme)
// Las constantes aquí representan los valores del MODO CLARO (Light Mode) por defecto.

// Colores de la paleta principal
const PRIMARY_LIGHT = '#d582af';
const SECONDARY_LIGHT = '#c983a6ff';

// Colores base neutros
const WHITE = '#eeeeeeff';
const BLACK = '#000000'; // Usado para ciertos fondos o sombras
const GRAY_ACCENT = '#e3e2e2ff';
const GRAY_BORDER = '#d1d5db';
const GRAY_MUTED = '#717182';
const INPUT_BG = '#a7a7a73c';


export const BRAND_COLORS = {
    // --- 1. BASE Y MARCA (Light Mode) ---
    PRIMARY: PRIMARY_LIGHT,              // #7c3aed (Púrpura)
    SECONDARY: SECONDARY_LIGHT,          // #ec4899 (Rosa/Magenta)
    ACCENT: GRAY_ACCENT,                 // #e9ebef (Fondo de acento/hover)

    // Fondo y Texto Base
    BACKGROUND_DEFAULT: WHITE,           // #FFFFFF
    BACKGROUND_SECONDARY: '#f7f7f79a',     // gray-100
    BLACK: BLACK,                        // #000000
    TEXT_PRIMARY: '#1F2937',             // Gris oscuro (Texto principal)
    TEXT_MUTED: GRAY_MUTED,              // #717182 (Texto secundario, hints)
    BORDER_COLOR: GRAY_BORDER,           // #d1d5db (Bordes de inputs)
    INPUT_BACKGROUND: INPUT_BG,          // #f3f3f5
    AVATAR_BACKGROUND: GRAY_ACCENT, 
       // Fondo gris claro para Avatares sin imagen

    // Colores del Botón Principal (Mapeados)
    BUTTON_PRIMARY_BG: PRIMARY_LIGHT,
    BUTTON_PRIMARY_TEXT: WHITE,
    BUTTON_SECONDARY_BG: '#f0f0f0',      // Gris claro para botones secundarios
    
    // --- 2. ESTADO Y NOTIFICACIONES ---
    STATE_SUCCESS: '#22c55e',            // Éxito (Verde)
    STATE_WARNING: '#f97316',            // Warning (Naranja)
    STATE_DESTRUCTIVE: '#d4183d',        // Destructive (Rojo)
    STATE_INFO: '#3b82f6',               // Info (Azul)
    ERROR_TEXT: '#d4183d',               // Usado para errores de formulario

    // --- 3. CATEGORÍAS (Radar Chart) ---
    POMODORO: '#dd7171ff',
    EJERCICIO: '#75b78dff',
    ESTUDIO: '#588adbff',
    LECTURA: '#ab7adaff',
    MEDITACION: '#78bcc8ff',
    AGUA: '#0ea5e9',
    SALUD: '#4ade80',         // Usando un verde claro (de tu paleta Success Dark)
    PROGRAMACION: '#6366f1',  // Usando el color de Streak New
    MUSICA: '#f472b6',        // Usando el color secundario (Rosa)
    OTRO: '#6b7280',
    
    // --- 4. STREAKS Y RANKINGS ---
    STREAK_ACTIVE: '#10b981',
    STREAK_DANGER: '#f97316',
    STREAK_LOST: '#ef4444',
    STREAK_NEW: '#6366f1',
    
    RANK_GOLD: '#eab308',
    RANK_SILVER: '#d1d5db',
    RANK_BRONZE: '#f97316',

    // --- 5. DARK MODE (Para lógica condicional) ---
    // NOTA: Estos se usarían dentro de la lógica de useColorScheme
    DARK_MODE_BACKGROUND: '#111827',
    DARK_MODE_TEXT: '#FFFFFF',
    DARK_MODE_ACCENT: 'oklch(0.269 0 0)',
    
};

// -------------------------------------------------------------
// Tipos para facilitar el mapeo en las interfaces de usuario
// -------------------------------------------------------------

export const CATEGORY_COLORS_MAP = {
    'pomodoro': BRAND_COLORS.POMODORO,
    'ejercicio': BRAND_COLORS.EJERCICIO,
    'estudio': BRAND_COLORS.ESTUDIO,
    'lectura': BRAND_COLORS.LECTURA,
    'meditacion': BRAND_COLORS.MEDITACION,
    'agua': BRAND_COLORS.AGUA,
    'salud': BRAND_COLORS.SALUD,
    'programacion': BRAND_COLORS.PROGRAMACION,
    'musica': BRAND_COLORS.MUSICA,
    'otro': BRAND_COLORS.OTRO,
    // Puedes extender este mapa para la lógica de íconos en tus tarjetas
};