// src/data/mockCategoryData.ts

import { label } from '../components/ui/label';
import { ActivityCategory, Goal } from '../interfaces/goal';
import { BRAND_COLORS as COLORS } from '../styles/Colors';// Solo para tipo de referencia

// NOTA: Los 'color' usan las constantes de tu paleta (ej. BRAND_COLORS.POMODORO)

export const MOCK_CATEGORIES: (ActivityCategory)[] = [
    { 
        id: 'cat-pomo', 
        name: 'Pomodoro', 
        color: COLORS.CATEGORY_COLORS.POMODORO, 
        iconName: 'Clock',       // ÍconNameo de reloj para tiempo
        goal: [] as Goal[] 
    },
    { 
        id: 'cat-ex', 
        name: 'Ejercicio', 
        color: COLORS.CATEGORY_COLORS.EJERCICIO, 
        iconName: 'Heart',        // ÍconNameo de corazón para ejercicio
        goal: [] 
    },
    { 
        id: 'cat-study', 
        name: 'Estudio', 
        color: COLORS.CATEGORY_COLORS.ESTUDIO, 
        iconName: 'BookOpen',     // ÍconNameo de libro abierto
        goal: [] 
    },
    { 
        id: 'cat-read', 
        name: 'Lectura', 
        color: COLORS.CATEGORY_COLORS.LECTURA, 
        iconName: 'Book',         // ÍconNameo de libro cerrado/lectura
        goal: [] 
    },
    { 
        id: 'cat-med', 
        name: 'Meditación', 
        color: COLORS.CATEGORY_COLORS.MEDITACION, 
        iconName: 'Cloud',        // ÍconNameo de nube/mente
        goal: [] 
    },
    { 
        id: 'cat-water', 
        name: 'Agua', 
        color: COLORS.CATEGORY_COLORS.AGUA, 
        iconName: 'Droplet',      // ÍconNameo de gota
        goal: [] 
    },
    { 
        id: 'cat-health', 
        name: 'Salud', 
        color: COLORS.CATEGORY_COLORS.SALUD, // Usando color de estado Success
        iconName: 'Stethoscope',  // ÍconNameo de estetoscopio
        goal: [] 
    },
    { 
        id: 'cat-dev', 
        name: 'Programación', 
        color: COLORS.CATEGORY_COLORS.PROGRAMACION, // Usando color de racha nueva
        iconName: 'Code',         // ÍconNameo de código
        goal: [] 
    },
    { 
        id: 'cat-music', 
        name: 'Música', 
        color: COLORS.CATEGORY_COLORS.MUSICA, // Usando color secundario
        iconName: 'Music',        // ÍconNameo de nota musical
        goal: [] 
    },
    { 
        id: 'cat-other', 
        name: 'Otro', 
        color: COLORS.CATEGORY_COLORS.OTRO, // Usando color gris
        iconName: 'Target',       // ÍconNameo de objetivo genérico
        goal: [] 
    },
];


export const CATEGORIES = [
    { label: 'Pomodoro', value: 'cat-pomo' },
    { label: 'Ejercicio', value: 'cat-ex' },
    { label: 'Estudio', value: 'cat-study' },
    { label: 'Lectura', value: 'cat-read' },
    { label: 'Meditación', value: 'cat-med' },
    { label: 'Agua', value: 'cat-water' },
    { label: 'Salud', value: 'cat-health' },
    { label: 'Programación', value: 'cat-dev' },
    { label: 'Música', value: 'cat-music' },
    { label: 'Otro', value: 'cat-other' },
];