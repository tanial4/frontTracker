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
  streak: StreakUI;
  onContinue: (streakId: string) => void;
}

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

  const accent = categoryColor ?? COLORS.PRIMARY;

  return (
    <View style={[styles.card, { borderColor: accent }]}>
      
      {/* --- HEADER --- */}
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

      {/* --- NAME & DESCRIPTION --- */}
      <Text style={styles.title}>{name}</Text>

      {!!description && (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      )}

      {/* --- METRICS --- */}
      <View style={styles.statsRow}>
        {typeof currentStreakDays === 'number' && (
          <Text style={[styles.highlightText, { color: accent }]}>
            {currentStreakDays} días
          </Text>
        )}

        <View style={styles.membersWrapper}>
          <Text style={styles.membersIcon}>👥</Text>
          <Text style={styles.membersText}>{membersCount} miembros</Text>
        </View>
      </View>

      {/* --- BUTTON --- */}
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
// STYLES
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

  // Header
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

  // Text
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

  // Metrics
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

  // Button
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
