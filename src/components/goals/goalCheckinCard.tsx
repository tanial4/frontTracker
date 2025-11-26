// src/components/goals/GoalCheckinCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Clock } from 'lucide-react-native'; 
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { Button } from '../ui/button';

// Propiedades para configurar la tarjeta de seguimiento.
// Permite personalizar colores y datos para reutilizarla en diferentes contextos (Home, Listas, Detalles).
interface GoalCheckinCardProps {
  title: string;
  description?: string;
  
  // Datos estadísticos opcionales
  daysActive?: number;        // Racha o días acumulados
  friendsCount?: number;      // Número de personas en el mismo reto
  
  // Estado visual
  isActive?: boolean;         // Controla la visibilidad del badge "Activa"
  accentColor?: string;       // Color temático de la categoría (se usa para bordes, iconos y botones)
  
  // Acción principal (usualmente navegar al detalle o marcar check-in)
  onContinue: () => void;     
}

export function GoalCheckinCard({
  title,
  description,
  daysActive,
  friendsCount,
  isActive = true,
  accentColor = COLORS.PRIMARY,
  onContinue,
}: GoalCheckinCardProps) {
  return (
    // El borde de la tarjeta toma el color de la categoría para diferenciar visualmente los tipos de metas.
    <View style={[styles.card, { borderColor: accentColor }]}>
      
      {/* 1. Cabecera: Icono temático y Badge de estado */}
      <View style={styles.topRow}>
        {/* Usamos una opacidad manual ('15') sobre el hex para el fondo del icono */}
        <View style={[styles.iconWrapper, { backgroundColor: accentColor + '15' }]}>
          <Clock size={22} color={accentColor} />
        </View>

        {isActive && (
          <View style={[styles.statusPill, { backgroundColor: accentColor + '20' }]}>
            <Text style={[styles.statusText, { color: accentColor }]}>
              Activa
            </Text>
          </View>
        )}
      </View>

      {/* 2. Contenido principal: Título y Descripción corta */}
      <Text style={styles.title}>{title}</Text>
      {!!description && (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      )}

      {/* 3. Métricas: Se renderizan solo si los datos numéricos existen */}
      <View style={styles.statsRow}>
        {typeof daysActive === 'number' && (
          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.highlightText}>{daysActive} días</Text>
          </TouchableOpacity>
        )}

        {typeof friendsCount === 'number' && (
          <View style={styles.friendsWrapper}>
            {/* Nota: Aquí se usa un emoji literal, considerar cambiar por icono Lucide para consistencia visual */}
            <Text style={styles.friendsIcon}>👥</Text>
            <Text style={styles.friendsText}>
              {friendsCount} amigos
            </Text>
          </View>
        )}
      </View>

      {/* 4. Botón de Acción Principal */}
      <Button
        style={[styles.continueButton, { backgroundColor: accentColor }]}
        onPress={onContinue}
      >
        <Text style={styles.continueText}>Continuar</Text>
      </Button>
    </View>
  );
}

// -------------------------------------------------------------
// ESTILOS
// -------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 18,
    padding: 14,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
    marginBottom: 14,
    // Sombras sutiles para dar profundidad (iOS y Android)
    shadowColor: COLORS.BLACK,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  highlightText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  friendsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendsIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  friendsText: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
  },
  continueButton: {
    marginTop: 4,
    borderRadius: 999,
    paddingVertical: 10,
  },
  continueText: {
    color: COLORS.BACKGROUND_DEFAULT,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default GoalCheckinCard;