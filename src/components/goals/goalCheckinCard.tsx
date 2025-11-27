// src/components/streaks/StreakCard.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Flame } from 'lucide-react-native'; 
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { Button } from '../ui/button';
import { StreakUI } from '../../types/streak';

interface StreakCardProps {
  // Objeto de datos que representa la racha
  streak: StreakUI;
  // Acción al presionar el botón principal (navegar al detalle)
  onContinue: (streakId: string) => void;
}

// Componente de tarjeta para mostrar el resumen de una Racha (Streak).
// Se diferencia visualmente de las Metas normales por el uso del icono de "Fuego" y métricas de grupo.
export function StreakCard({ streak, onContinue }: StreakCardProps) {
  const {
    id,
    name,
    description,
    categoryColor,
    isJoined,
    membersCount,
    currentStreakDays,
  } = streak;

  // Definición del color temático.
  // Si la categoría no tiene color, usamos el primario de la marca por defecto.
  const accent = categoryColor ?? COLORS.PRIMARY;

  return (
    // El borde de la tarjeta toma el color de acento para identificar la categoría rápidamente
    <View style={[styles.card, { borderColor: accent }]}>
      
      {/* --- HEADER: Icono y Estado --- */}
      <View style={styles.topRow}>
        {/* Contenedor del icono con fondo tintado (20% opacidad del color acento) */}
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: accent + '20' },
          ]}
        >
          <Flame size={22} color={accent} />
        </View>

        {/* Badge "Activa": Solo se muestra si el usuario ya se unió a esta racha */}
        {isJoined && (
          <View
            style={[
              styles.statusPill,
              { backgroundColor: accent + '25' },
            ]}
          >
            <Text style={[styles.statusText, { color: accent }]}>
              Activa
            </Text>
          </View>
        )}
      </View>

      {/* --- CONTENIDO: Título y Descripción --- */}
      <Text style={styles.title}>{name}</Text>

      {!!description && (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      )}

      {/* --- MÉTRICAS: Días y Miembros --- */}
      <View style={styles.statsRow}>
        {/* Días acumulados (destacado en color) */}
        {typeof currentStreakDays === 'number' && (
          <Text style={[styles.highlightText, { color: accent }]}>
            {currentStreakDays} días
          </Text>
        )}

        {/* Contador de participantes */}
        <View style={styles.membersWrapper}>
          {/* Icono de texto simple para ahorrar imports, se puede cambiar por icono SVG si se prefiere */}
          <Text style={styles.membersIcon}>👥</Text>
          <Text style={styles.membersText}>{membersCount} miembros</Text>
        </View>
      </View>

      {/* --- BOTÓN DE ACCIÓN --- */}
      <Button
        style={[styles.goButton, { backgroundColor: accent }]}
        onPress={() => onContinue(id)}
      >
        <Text style={styles.goButtonText}>Ver racha</Text>
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
    padding: 16,
    marginBottom: 16,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
    // Sombras sutiles para elevación
    shadowColor: COLORS.BLACK,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  // Encabezado
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconWrapper: {
    width: 38,
    height: 38,
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

  // Textos principales
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

  // Sección de Métricas
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  highlightText: {
    fontSize: 13,
    fontWeight: '600',
  },
  membersWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membersIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  membersText: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
  },

  // Botón inferior
  goButton: {
    borderRadius: 999,
    paddingVertical: 10,
  },
  goButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.BACKGROUND_DEFAULT,
  },
});

export default StreakCard;