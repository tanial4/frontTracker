import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

// Define las claves posibles para el estado de la navegación
type SegmentKey = 'received' | 'sent';

interface RequestsSegmentBarProps {
  // Estado actual de la selección (controlado por el componente padre)
  activeSegment: SegmentKey;
  // Función para actualizar el estado al presionar una pestaña
  onChange: (segment: SegmentKey) => void;
  // Contadores para los badges de notificación
  receivedCount: number;
  sentCount: number;
}

// Componente de navegación tipo "Segmented Control" (o pestañas tipo pastilla).
// Permite alternar la vista entre solicitudes recibidas y enviadas.
export function RequestsSegmentBar({
  activeSegment,
  onChange,
  receivedCount,
  sentCount,
}: RequestsSegmentBarProps) {
  return (
    <View style={styles.container}>
      
      {/* Pestaña: Recibidas */}
      <TouchableOpacity
        style={[
          styles.segment,
          // Aplicamos estilo activo (fondo blanco) si coincide con el estado actual
          activeSegment === 'received' && styles.segmentActive,
        ]}
        activeOpacity={0.8}
        onPress={() => onChange('received')}
      >
        <Text
          style={[
            styles.segmentText,
            activeSegment === 'received' && styles.segmentTextActive,
          ]}
        >
          Recibidas
        </Text>
        
        {/* Badge numérico para mostrar cantidad de solicitudes pendientes */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{receivedCount}</Text>
        </View>
      </TouchableOpacity>

      {/* Pestaña: Enviadas */}
      <TouchableOpacity
        style={[
          styles.segment,
          activeSegment === 'sent' && styles.segmentActive,
        ]}
        activeOpacity={0.8}
        onPress={() => onChange('sent')}
      >
        <Text
          style={[
            styles.segmentText,
            activeSegment === 'sent' && styles.segmentTextActive,
          ]}
        >
          Enviadas
        </Text>
        
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{sentCount}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// -------------------------------------------------------------
// ESTILOS
// -------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND_SECONDARY, // Fondo gris claro del contenedor (track)
    borderRadius: 999, // Bordes completamente redondos (estadio/cápsula)
    padding: 4, // Padding interno para que la pastilla activa no toque los bordes
    marginHorizontal: 20,
  },
  segment: {
    flex: 1, // Ambas pestañas ocupan el 50% del ancho disponible
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 8,
    paddingVertical: 8,
    borderRadius: 999,
  },
  segmentActive: {
    backgroundColor: COLORS.BACKGROUND_DEFAULT, // Fondo blanco para resaltar la selección
    // Opcional: Podrías agregar una sombra sutil aquí si el diseño lo requiere
  },
  segmentText: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
  },
  segmentTextActive: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600', // Texto más grueso en el estado activo
  },
  
  // Estilos del indicador numérico (Badge)
  badge: {
    minWidth: 22, // Ancho mínimo para mantener la forma circular con números de 1 dígito
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: COLORS.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});