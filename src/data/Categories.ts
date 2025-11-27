// src/data/mockCategoryData.ts


import { ActivityCategory, Goal } from '../types/goal';
import { BRAND_COLORS as COLORS } from '../styles/Colors';// Solo para tipo de referencia

// NOTA: Los 'color' usan las constantes de tu paleta (ej. BRAND_COLORS.POMODORO)

export const MOCK_CATEGORIES: (ActivityCategory)[] = [
    { 
        id: 'cat-pomo', 
        name: 'Pomodoro', 
        color: COLORS.POMODORO, 
        iconName: 'Clock',       // ÍconNameo de reloj para tiempo
        goal: [] as Goal[] 
    },
    { 
        id: 'cat-ex', 
        name: 'Ejercicio', 
        color: COLORS.EJERCICIO, 
        iconName: 'Dumbbell',        // ÍconNameo de corazón para ejercicio
        goal: [] 
    },
    { 
        id: 'cat-study', 
        name: 'Estudio', 
        color: COLORS.ESTUDIO, 
        iconName: 'BookOpen',     // ÍconNameo de libro abierto
        goal: [] 
    },
    { 
        id: 'cat-read', 
        name: 'Lectura', 
        color: COLORS.LECTURA, 
        iconName: 'Book',         // ÍconNameo de libro cerrado/lectura
        goal: [] 
    },
    { 
        id: 'cat-med', 
        name: 'Meditación', 
        color: COLORS.MEDITACION, 
        iconName: 'Cloud',        // ÍconNameo de nube/mente
        goal: [] 
    },
    { 
        id: 'cat-water', 
        name: 'Agua', 
        color: COLORS.AGUA, 
        iconName: 'Droplet',      // ÍconNameo de gota
        goal: [] 
    },
    { 
        id: 'cat-health', 
        name: 'Salud', 
        color: COLORS.SALUD , // Usando color de estado Success
        iconName: 'Stethoscope',  // ÍconNameo de estetoscopio
        goal: [] 
    },
    { 
        id: 'cat-dev', 
        name: 'Programación', 
        color: COLORS.PROGRAMACION, // Usando color de racha nueva
        iconName: 'Code',         // ÍconNameo de código
        goal: [] 
    },
    { 
        id: 'cat-music', 
        name: 'Música', 
        color: COLORS.MUSICA, // Usando color secundario
        iconName: 'Music',        // ÍconNameo de nota musical
        goal: [] 
    },
    { 
        id: 'cat-other', 
        name: 'Otro', 
        color: COLORS.OTRO, // Usando color gris
        iconName: 'Target',       // ÍconNameo de objetivo genérico
        goal: [] 
    },
];


export const CATEGORIES = [
    { label: 'Pomodoro', value: 'cmihuk9yf0003wirg0g9qj79s' },
    { label: 'Ejercicio', value: 'cmihukgxh0004wirge8qn0qph' },
    { label: 'Estudio', value: 'cmihuknm10005wirgxs82m2hb' },
    { label: 'Lectura', value: 'cmidyflo30000wi7sd8yec8xo' },
    { label: 'Meditación', value: 'cmihuktgf0006wirgdhs38glr' },
    { label: 'Agua', value: 'cmihukytz0007wirg9bmd48lv' },
    { label: 'Salud', value: 'cmihul66w0008wirgnexab19b' },
    { label: 'Programación', value: 'cmihulbma0009wirg10nhb46q' },
    { label: 'Música', value: 'cmihulgk8000awirgs906aid7' },
    { label: 'Otro', value: 'cmihulkrj000bwirgedb0ixr3' },
];