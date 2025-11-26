import { User } from "./user";

// Define las categorías para agrupar las actividades y metas (ej: Salud, Trabajo, Estudio).
// Se usa principalmente para organizar visualmente el dashboard.
export interface ActivityCategory {
    id: string;
    name: string;
    // Hex code o string de color para mostrar etiquetas en la interfaz
    color: string;
    
    // Relación inversa. Ojo: Algunos endpoints o data mocks pueden no devolver esto
    // para evitar referencias circulares o cargas pesadas.
    goal?: Goal[];
    
    // Nombre del icono para librerías de UI (tipo FontAwesome o Material).
    // Es opcional porque no todos los datasets antiguos lo tienen.
    iconName?: string;
}

// La entidad principal que representa el objetivo que el usuario quiere alcanzar.
export interface Goal {
    id: string;
    userId: string;
    title: string;
    description?: string | null;

    // Frecuencia de la meta.
    // Nota: Aunque lo ideal son los strings ('DAILY', 'WEEKLY'), mantenemos el tipo 'number'
    // por compatibilidad con registros antiguos o lógica legacy del backend.
    targetType: 'DAILY' | 'WEEKLY' | number;

    // Cantidad objetivo (ej: 5 veces, 2 litros, 30 minutos).
    targetValue?: number;

    startDate: Date;
    endDate: Date;
    
    // Flag para soft-delete. Si es true, no se muestra en la lista activa pero persiste en BD.
    isArchived: boolean;
    
    createdAt: Date;
    updatedAt: Date;

    // Relaciones
    user: User;
    category?: ActivityCategory | null;
}

// Registro puntual de progreso. Se crea cada vez que el usuario marca una actividad.
export interface GoalCheckIn {
    id: string;
    goalId: string;
    userId: string;
    date: Date;
    
    // Si la meta es cuantitativa, aquí guardamos cuánto se avanzó.
    value?: number;
    
    // Si la meta es cualitativa (sí/no), usamos este booleano.
    done: boolean;
    
    createdAt: Date;

    // Relaciones para popular la vista de historial
    goal: Goal;
    user: User;
}

// Plantillas predefinidas para facilitar la creación rápida de metas comunes
// (ej: "Beber agua", "Leer 30 mins") sin que el usuario configure todo desde cero.
export interface GoalTemplate {
    id: string;
    title: string;
    description?: string | null;
    categoryId: string;
    
    // Configuración por defecto que se copiará a la nueva Meta
    targetType: 'DAILY' | 'WEEKLY' | number;
    targetValue?: number;
}