import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

interface Props {
  // Estado actual de la meta para el día en curso
  hasCheckedInToday: boolean;
  // Acción al presionar
  onCheckin: () => void;
  // Color temático heredado de la categoría (ej: Salud=Verde, Trabajo=Azul)
  categoryColor: string; 
}

// Botón compacto de acción rápida para marcar progreso.
// Cambia drásticamente su apariencia entre estado "Pendiente" (llamativo) y "Hecho" (tenue).
export default function SimpleCheckinButton({
  hasCheckedInToday,
  onCheckin,
  categoryColor,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          // Lógica de color:
          // - Si ya se hizo check-in: Fondo gris/neutro para indicar "desactivado" visualmente.
          // - Si está pendiente: Fondo sólido con el color de la categoría para llamar la atención.
          backgroundColor: hasCheckedInToday
            ? COLORS.BORDER_COLOR 
            : categoryColor,
            
          // Mantenemos el borde del color de la categoría incluso cuando está hecho
          // para no perder el contexto visual de qué tipo de meta es.
          borderColor: categoryColor,
        },
      ]}
      // Deshabilitamos la interacción si ya se completó hoy para evitar duplicados accidentales
      disabled={hasCheckedInToday}
      onPress={onCheckin}
    >
      <Text style={styles.text}>
        {hasCheckedInToday ? '✓ Hecho' : 'Hacer check-in'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    // Usamos blanco fijo para asegurar contraste sobre colores de categoría sólidos
    color: '#fff', 
  },
});