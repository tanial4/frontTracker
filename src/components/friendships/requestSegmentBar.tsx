// src/components/friendships/RequestsSegmentBar.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';

type SegmentKey = 'received' | 'sent';

interface RequestsSegmentBarProps {
  activeSegment: SegmentKey;
  onChange: (segment: SegmentKey) => void;
  receivedCount: number;
  sentCount: number;
}

export function RequestsSegmentBar({
  activeSegment,
  onChange,
  receivedCount,
  sentCount,
}: RequestsSegmentBarProps) {
  return (
    <View style={styles.container}>
      {/* Recibidas */}
      <TouchableOpacity
        style={[
          styles.segment,
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
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{receivedCount}</Text>
        </View>
      </TouchableOpacity>

      {/* Enviadas */}
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND_SECONDARY, // barra gris clarita
    borderRadius: 999,
    padding: 4,
    marginHorizontal: 20,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 8,
    paddingVertical: 8,
    borderRadius: 999,
  },
  segmentActive: {
    backgroundColor: COLORS.BACKGROUND_DEFAULT, // “pastilla” blanca como en el diseño
  },
  segmentText: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
  },
  segmentTextActive: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  badge: {
    minWidth: 22,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: COLORS.SECONDARY, // o COLORS.PRIMARY si quieres morado
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
