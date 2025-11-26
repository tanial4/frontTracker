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

// Mapeo estático de Strings -> Componentes.
// Esto permite que la base de datos guarde solo el nombre del icono ("Heart")
// y el frontend decida qué componente renderizar.
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
  // Determina si esta tarjeta está seleccionada actualmente (cambia el estilo visual)
  isActive: boolean;
  // Pasamos todas las categorías para poder buscar el color e icono correcto
  allCategories: ActivityCategory[];
}

// Tarjeta seleccionable que muestra una "Plantilla de Meta".
// Diseñada para mostrarse en una grilla (width ~46%).
export function TemplateCard({
  template,
  onSelect,
  isActive,
  allCategories,
}: TemplateCardProps) {
  
  // 1. Resolución de datos visuales
  // Buscamos la categoría asociada a esta plantilla para heredar su color e icono.
  const category = allCategories.find((cat) => cat.id === template.categoryId);

  // Fallbacks seguros por si la categoría fue borrada o no tiene datos
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
          // Lógica de estado activo:
          // Si está activa, el borde y el fondo toman el color de la categoría.
          // Si no, se ve como una tarjeta gris estándar.
          borderColor: isActive ? color : COLORS.BORDER_COLOR,
          borderLeftColor: color, // La barra lateral de color siempre se muestra
          
          // Fondo con opacidad muy baja (12 hex) para dar un tinte sutil del color temático
          backgroundColor: isActive
            ? color + '12' 
            : COLORS.BACKGROUND_SECONDARY,
            
          // Elevación sutil para destacar la selección
          shadowOpacity: isActive ? 0.12 : 0.06,
          elevation: isActive ? 3 : 1,
        },
      ]}
    >
      {/* Sección Superior: Icono y Título */}
      <View style={styles.headerRow}>
        <View
          style={[
            styles.iconWrapper,
            {
              // El contenedor del icono usa el color temático con transparencias
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

          {/* Pill pequeña con el nombre de la categoría */}
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

      {/* Cuerpo: Descripción de la plantilla */}
      <Text style={styles.descriptionText} numberOfLines={3}>
        {template.description ||
          `Meta de tipo ${badgeText.toLowerCase()} para comenzar rápido.`}
      </Text>

      {/* Pie: Badge con el tipo de frecuencia (DAILY, WEEKLY, etc) */}
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
    width: '46%', // Ajustado para grid de 2 columnas con márgenes
    minHeight: 150,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 10,
    margin: 4,
    justifyContent: 'space-between',
    // Borde izquierdo más grueso para acento de color tipo "tarjeta de tarea"
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

  // Estilos del indicador de categoría (Pill)
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