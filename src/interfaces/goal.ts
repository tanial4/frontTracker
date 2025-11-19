import { number } from "zod";

export interface ActivityCategory {
    id: string;
    name: string;
    color: string;
    // Algunos endpoints/dev data pueden no incluir las relaciones completas en todas las respuestas
    goal?: Goal[];
    // Icon name puede venir opcionalmente en algunos datasets
    iconName?: string;
}

export interface Goal {
    id: string;
    userId: string;
    title: string;
    description?: string | null;
    // Permitimos 'monthly' además de 'daily' y 'weekly' y también un número (por compatibilidad con backends)
    targetType: 'DAILY' | 'WEEKLY' | number;
    targetValue?: number;
    startDate: Date;
    endDate?: Date | null;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    category?: ActivityCategory | null;
}

export interface GoalCheckIn {
    id: string;
    goalId: string;
    userId: string;
    date: Date;
    value?: number;
    done: boolean;
    createdAt: Date;
    goal: Goal;
    user: User;
}

export interface GoalTemplate {
    id: string;
    title: string;
    description?: string | null;
    categoryId: string;
    targetType: 'DAILY' | 'WEEKLY' | number;
    targetValue?: number;
}



