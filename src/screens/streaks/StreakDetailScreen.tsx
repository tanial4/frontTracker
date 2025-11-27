import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import InnerScreenLayout from '../../components/layout/InnerLayout';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { MOCK_STREAKS_UI } from '../../data/TestStreakData';
import SimpleCheckinButton from '../../components/goals/simpleCheckinCard';

// 👇 IMPORTA el tipo de tu stack donde está registrada la ruta
import { StatsStackParamList } from '../../components/navigation/StatsStack';

// -------------------------
// Tipos de navegación
// -------------------------

type Props = NativeStackScreenProps<StatsStackParamList, 'StreakDetail'>;

// Type derivado de tu mock (incluye members, hasCheckedInToday, etc.)
type StreakUI = (typeof MOCK_STREAKS_UI)[number];
type MemberUI = NonNullable<StreakUI['members']>[number];

// -------------------------
// Helpers
// -------------------------

const formatDate = (iso?: string | null) => {
  if (!iso) return 'Sin fecha';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

const visibilityLabel: Record<string, string> = {
  PUBLIC: 'Pública',
  PRIVATE: 'Privada',
  FRIENDS: 'Solo amigos',
};

// Iniciales para avatar simple
const getInitials = (name: string) => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// -------------------------
// Pantalla
// -------------------------

export function StreakDetailScreen({ route, navigation }: Props) {
  const { streakId } = route.params;

  const streak = useMemo<StreakUI | undefined>(
    () => MOCK_STREAKS_UI.find((s) => s.id === streakId),
    [streakId]
  );

  const data: StreakUI | null = streak ?? (MOCK_STREAKS_UI[0] ?? null);
  const accentColor = data?.categoryColor ?? COLORS.PRIMARY;

  const handleMemberCheckin = (memberId: string) => {
    // Aquí luego conectas con tu API / mutation
    console.log(`Check-in en racha ${data?.id} del miembro ${memberId}`);
  };

  return (
    <InnerScreenLayout
      title={data ? data.name : 'Detalle de racha'}
      onBack={() => navigation.goBack()}
      containerStyle={styles.mainContainer}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!data ? (
          <View style={styles.emptyWrapper}>
            <Text style={styles.emptyTitle}>Racha no encontrada</Text>
            <Text style={styles.emptyText}>
              No pudimos cargar la información de esta racha.
            </Text>
          </View>
        ) : (
          <>
            {/* HEADER / HERO DE LA RACHA */}
            <View
              style={[
                styles.heroCard,
                { borderLeftColor: accentColor, borderTopColor: accentColor },
              ]}
            >
              <Text style={styles.heroTitle}>{data.name}</Text>

              {!!data.description && (
                <Text style={styles.heroDescription}>
                  {data.description}
                </Text>
              )}

              <View style={styles.heroChipsRow}>
                <View
                  style={[
                    styles.chip,
                    { backgroundColor: accentColor + '22' },
                  ]}
                >
                  <Text style={[styles.chipText, { color: accentColor }]}>
                    {visibilityLabel[data.visibility] ?? data.visibility}
                  </Text>
                </View>

                <View style={styles.chip}>
                  <Text style={styles.chipTextMuted}>
                    Desde {formatDate(data.startDate)}
                  </Text>
                </View>

                {data.endDate && (
                  <View style={styles.chip}>
                    <Text style={styles.chipTextMuted}>
                      Hasta {formatDate(data.endDate)}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* STATS PRINCIPALES */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Días activos</Text>
                <Text style={[styles.statValue, { color: accentColor }]}>
                  {data.daysActive}
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Personas en la racha</Text>
                <Text style={styles.statValue}>
                  {data.members?.length ?? 0}
                </Text>
              </View>
            </View>

            {/* CHECK-INS POR INTEGRANTE */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Check-ins de hoy</Text>
              {(!data.members || data.members.length === 0) && (
                <Text style={styles.sectionTextMuted}>
                  Aún no hay integrantes en esta racha.
                </Text>
              )}

              {data.members?.map((member: MemberUI) => (
                <View key={member.id} style={styles.memberRow}>
                  {/* Avatar simple por iniciales */}
                  <View
                    style={[
                      styles.memberAvatar,
                      { backgroundColor: accentColor + '22' },
                    ]}
                  >
                    <Text style={[styles.memberAvatarText, { color: accentColor }]}>
                      {getInitials(member.displayName)}
                    </Text>
                  </View>

                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.displayName}</Text>
                    <Text style={styles.memberSubtitle}>
                      {member.daysActive} días de racha
                    </Text>
                    {member.lastCheckinAt && (
                      <Text style={styles.memberLastCheckin}>
                        Último check-in: {formatDate(member.lastCheckinAt)}
                      </Text>
                    )}
                  </View>

                  {/* Botón de check-in reutilizando tu componente */}
                  <SimpleCheckinButton
                    hasCheckedInToday={member.hasCheckedInToday}
                    categoryColor={accentColor}
                    onCheckin={() => handleMemberCheckin(member.id)}
                  />
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </InnerScreenLayout>
  );
}

// -------------------------
// ESTILOS
// -------------------------

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
  },

  // Empty
  emptyWrapper: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
  },

  // Hero
  heroCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderTopWidth: 1.5,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 6,
  },
  heroDescription: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    marginBottom: 10,
  },
  heroChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  chipTextMuted: {
    fontSize: 11,
    color: COLORS.TEXT_MUTED,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },

  // Sección miembros / check-ins
  sectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    padding: 14,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 10,
  },
  sectionTextMuted: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
  },

  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  memberSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
  },
  memberLastCheckin: {
    fontSize: 11,
    color: COLORS.TEXT_MUTED,
    marginTop: 2,
  },
});

export default StreakDetailScreen;
