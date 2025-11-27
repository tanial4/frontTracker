// src/components/goals/TemplateGoalCard.tsx

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  Clock,
  Heart,
  BookOpen,
  Target,
  Code,
  Music,
  Droplet,
  Cloud,
  Stethoscope,
  Book,
  LucideIcon,
} from 'lucide-react-native';

import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { ActivityCategory, GoalTemplate } from '../../types/goal';

// Mapeo estático de nombres de iconos (Strings) a Componentes React.
// Esto nos permite guardar referencias simples en la base de datos (ej: "Heart") 
// y renderizar el componente gráfico correspondiente en tiempo de ejecución.
const IconMap: Record<string, LucideIcon> = {
  Clock,
  Heart,
  BookOpen,
  Target,
  Code,
  Music,
  Droplet,
  Cloud,
  Stethoscope,
  Book,
};

interface TemplateCardProps {
  template: GoalTemplate;
  onSelect?: (templateId: string) => void;
  // Propiedad de estado: Controla si la tarjeta está seleccionada visualmente
  isActive: boolean;
  // Necesitamos las categorías para resolver el color y el icono de la plantilla
  allCategories: ActivityCategory[];
}

// Tarjeta de selección para "Plantillas de Metas".
// Diseñada para grillas (ej: 2 columnas), muestra una previsualización de la meta sugerida.
export function TemplateCard({
  template,
  onSelect,
  isActive,
  allCategories,
}: TemplateCardProps) {
  
  // 1. Resolución de metadatos visuales
  // Buscamos la categoría asociada para heredar su color e icono.
  const category = allCategories.find((cat) => cat.id === template.categoryId);

  // Valores por defecto (Fallback) para evitar errores si la categoría fue eliminada
  const color = category?.color || COLORS.PRIMARY;
  const iconName = category?.iconName || 'Target';
  const IconComponent = IconMap[iconName] || IconMap.Target;

  const badgeText = ((template.targetType as string) || '').toUpperCase();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onSelect?.(template.id)}
      style={[
        styles.card,
        {
          // Lógica de estilos dinámicos según el estado de selección (isActive):
          
          // 1. Bordes: Se colorea si está activo para resaltar la selección.
          borderColor: isActive ? color : COLORS.BORDER_COLOR,
          borderLeftColor: color, // El borde izquierdo siempre mantiene el color de identidad
          
          // 2. Fondo: Usamos una opacidad baja (hex + '12') para teñir el fondo sutilmente
          backgroundColor: isActive
            ? color + '12' 
            : COLORS.BACKGROUND_SECONDARY,
            
          // 3. Profundidad: Elevamos la tarjeta ligeramente si está seleccionada
          shadowOpacity: isActive ? 0.12 : 0.06,
          elevation: isActive ? 3 : 1,
        },
      ]}
    >
      {/* Cabecera: Icono y Título */}
      <View style={styles.headerRow}>
        <View
          style={[
            styles.iconWrapper,
            {
              // El contenedor del icono usa transparencias del color principal
              borderColor: color + '80',
              backgroundColor: color + '18',
            },
          ]}
        >
          <IconComponent size={22} color={color} />
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.titleText} numberOfLines={2}>
            {template.title}
          </Text>

          {/* Etiqueta pequeña (Pill) con el nombre de la categoría */}
          {category?.name && (
            <View style={styles.categoryPill}>
              <View
                style={[
                  styles.categoryDot,
                  { backgroundColor: color },
                ]}
              />
              <Text style={styles.categoryPillText} numberOfLines={1}>
                {category.name}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Descripción de la plantilla */}
      <Text style={styles.descriptionText} numberOfLines={3}>
        {template.description ||
          `Meta de tipo ${badgeText.toLowerCase()} para comenzar rápido.`}
      </Text>

      {/* Pie de tarjeta: Tipo de frecuencia (Diaria/Semanal) */}
      <View style={styles.footerRow}>
        <View
          style={[
            styles.badge,
            { backgroundColor: color + '15' },
          ]}
        >
          <Text style={[styles.badgeText, { color }]}>
            {badgeText || 'META'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ---------------- ESTILOS ---------------- //

const styles = StyleSheet.create({
  card: {
    width: '46%', // Ancho calculado para caber 2 en una fila con márgenes
    minHeight: 150,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 10,
    margin: 4,
    justifyContent: 'space-between',
    // Borde izquierdo grueso para identificación rápida visual
    borderLeftWidth: 5,
    shadowColor: COLORS.BLACK,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  titleBlock: {
    flex: 1,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },

  // Estilos para la etiqueta de categoría
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    marginRight: 4,
  },
  categoryPillText: {
    fontSize: 10,
    color: COLORS.TEXT_MUTED,
    maxWidth: 80,
  },

  descriptionText: {
    fontSize: 12.5,
    color: COLORS.TEXT_MUTED,
    marginBottom: 10,
  },

  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  targetHint: {
    fontSize: 11,
    color: COLORS.TEXT_MUTED,
  },
});

export default TemplateCard;