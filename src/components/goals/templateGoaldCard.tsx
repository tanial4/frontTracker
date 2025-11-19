import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextStyle, ViewStyle } from 'react-native';
// Importamos todos los íconos de Lucide necesarios para el mapa
import { Clock, Heart, BookOpen, Target, Code, Music, Droplet, Cloud, Stethoscope, Book, LucideIcon } from 'lucide-react-native';

// 🚨 Importa tus constantes de estilos y la data 🚨
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { ActivityCategory, GoalTemplate } from '../../interfaces/goal';

// Asume que la data de categorías ya incluye el 'iconName' y 'color'

// --- 1. MAPA DINÁMICO DE ÍCONOS ---
// Mapea el string del nombre (Ej: 'Clock') al componente real de Lucide.
const IconMap: Record<string, LucideIcon> = {
    Clock: Clock,
    Heart: Heart,
    BookOpen: BookOpen,
    Target: Target, 
    Code: Code,
    Music: Music,
    Droplet: Droplet,
    Cloud: Cloud,
    Stethoscope: Stethoscope,
    Book: Book,
};

// --- INTERFACES ---
interface TemplateCardProps {
    template: GoalTemplate;
    onSelect?: (templateId: string) => void;
    isActive: boolean; 
    // Se requiere el array completo para buscar el ícono y color por ID
    allCategories: ActivityCategory[]; 
}

// -------------------------------------------------------------
// COMPONENTE TEMPLATE CARD
// -------------------------------------------------------------

export function TemplateCard({ template, onSelect, isActive, allCategories }: TemplateCardProps) {
    
    // 1. Obtener la Categoría Completa
    const category = allCategories.find(cat => cat.id === template.categoryId);

    // 2. Definir Color, Ícono y Fallbacks
    const color = category?.color || COLORS.TEXT_PRIMARY; // Fallback: Gris
    const IconName = category?.iconName || 'Target' // Nombre del ícono o 'Target'
    
    // 3. Obtener el Componente del Ícono del mapa. Fallback final a 'Target'.
    const IconComponent = IconMap[IconName] || IconMap.Target; 

    // 4. Lógica de Estilos de Borde
    const borderColor = isActive ? color : COLORS.GRAY_BORDER;
    
    // 5. Corregir Error: Asegurar que targetType sea un string antes de toUpperCase
    const badgeText = (template.targetType as string || '').toUpperCase();

    return (
        <TouchableOpacity 
            // El borde izquierdo es el color de categoría/activo
            style={[styles.card, { borderLeftColor: color, borderColor: borderColor }]} 
            
            activeOpacity={0.8}

            onPress={() => onSelect?.(template.id)}
        >
            <View style={styles.headerRow}>
                
                {/* 1. Ícono de Categoría (Círculo de color tenue) */}
                <View style={[styles.iconWrapper, { borderColor: color, backgroundColor: color + '15' }]}>
                    <IconComponent size={24} color={color} />
                </View>
                
                {/* 2. Título de la Meta */}
                <Text style={styles.titleText} numberOfLines={2}>{template.title}</Text>
            </View>

            {/* 3. Descripción */}
            <Text style={styles.descriptionText}>
                {template.description || `Meta de ${badgeText} con objetivo ${template.targetValue || 'simple'}`}
            </Text>

            {/* 4. Badge del Tipo de Meta (Diario/Semanal/etc.) */}
            <View style={[styles.badge, { backgroundColor: color + '15' }]}>
                <Text style={[styles.badgeText, { color: color }]}>{badgeText}</Text>
            </View>

        </TouchableOpacity>
    );
}

// -------------------------------------------------------------
// ESTILOS ESPECÍFICOS DEL CARD
// -------------------------------------------------------------

const styles = StyleSheet.create({
    card: {
        width: '46%', 
        minHeight: 150, 
        borderWidth: 2, 
        borderRadius: 12,
        padding: 8,
        margin: 4, 
        justifyContent: 'space-between',
        backgroundColor: COLORS.WHITE,
        // Usamos borderLeftColor para el color principal y borderColor para el estado
        borderLeftWidth: 7, // Borde izquierdo más grueso
        shadowColor: COLORS.BLACK,
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconWrapper: {
        width: 35,
        height: 35,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    titleText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.TEXT_PRIMARY,
        flexShrink: 1, // Permite que el texto se reduzca si es necesario

    },
    descriptionText: {
        fontSize: 13,
        color: COLORS.TEXT_MUTED,
        marginBottom: 10,
        // No hay margen aquí para que el texto ocupe todo el ancho disponible
    },
    
    // --- Badge de Meta (Diario/Semanal) ---
    badge: {
        alignSelf: 'flex-start',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});