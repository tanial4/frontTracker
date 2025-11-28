// src/components/streaks/StreakCard.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Flame, Users } from 'lucide-react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { Button } from '../ui/button';
import { StreakUI } from '../../types/streak';
import { recordStreakCheckin } from '../../services/streakApi';


interface StreakCardProps {
  // Objeto de datos que representa la racha (adaptado a UI)
  streak: StreakUI;
  // Antes navegaba al detalle; ahora ya no se usa dentro del botón,
  // pero lo dejamos por compatibilidad (por si luego quieres usarlo en otro lado).
  onContinue: (streakId: string) => void;
}

/**
 * Tarjeta para mostrar el resumen de una Racha (Streak).
 * Ahora el botón principal se usa para hacer check-in del día actual
 * llamando al endpoint /streaks/:id/checkins sin cambiar de pantalla.
 */
export function StreakCard({ streak, onContinue }: StreakCardProps) {
  const { id, name, description, isJoined, membersCount, currentStreakDays } = streak;

  // Color principal de la racha en la UI
  const accent = COLORS.PRIMARY;
  // Estado local para indicar cuando el check-in está en progreso
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  // Handler del botón: hace check-in para HOY y no navega
  const handleCheckinPress = async () => {
    try {
      setIsCheckingIn(true);

      const todayIso = new Date().toISOString();

      await recordStreakCheckin(id, {
        date: todayIso,
        done: true,
        // metadata: { source: 'stats-screen' }, // opcional
      });

      // Aquí podrías disparar un callback/refresh externo si quieres
      // por ejemplo: onContinue(id) solo para refrescar datos, sin navegar.
      // Por ahora NO lo llamamos para asegurar que no cambie de pantalla.
      console.log(`Check-in registrado para streak ${id} en ${todayIso}`);
    } catch (error: any) {
      console.error(
        'Error haciendo check-in de racha:',
        error?.response?.data || error.message || error,
      );
    } finally {
      setIsCheckingIn(false);
    }
  };

  return (
    <View style={[styles.card, { borderColor: accent }]}>
      {/* HEADER: Icono y estado */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: accent + '20' },
          ]}
        >
          <Flame size={22} color={accent} />
        </View>

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

      {/* CONTENIDO: título y descripción */}
      <Text style={styles.title}>{name}</Text>

      {!!description && (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      )}

      {/* MÉTRICAS: días de racha y miembros */}
      <View style={styles.statsRow}>
        {typeof currentStreakDays === 'number' && (
          <Text style={[styles.highlightText, { color: accent }]}>
            {currentStreakDays} días de racha
          </Text>
        )}

        <View style={styles.membersWrapper}>
          <Users size={16} color={COLORS.TEXT_MUTED} />
          <Text style={styles.membersText}>{membersCount} miembros</Text>
        </View>
      </View>

      {/* BOTÓN: ahora hace check-in del día actual */}
      <Button
        style={[styles.goButton, { backgroundColor: accent }]}
        onPress={handleCheckinPress}
        isLoading={isCheckingIn}
        disabled={isCheckingIn}
      >
        <Text style={styles.goButtonText}>
          {isCheckingIn ? 'Guardando...' : 'Hacer check-in'}
        </Text>
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

  // Métricas
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
    gap: 4,
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
