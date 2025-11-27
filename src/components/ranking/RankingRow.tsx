import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { RankingEntryUI } from '../../types/stats';

interface Props {
  item: RankingEntryUI;
  onPress: (userId: string) => void;
}

export default function RankingRow({ item, onPress }: Props) {
  const isTop3 = item.rank <= 3;

  const initials = item.displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <TouchableOpacity
      style={[styles.row, isTop3 && styles.rowTop3]}
      activeOpacity={0.75}
      onPress={() => onPress(item.userId)}
    >
      {/* Rank number */}
      <View style={[styles.rankBox, isTop3 && styles.rankBoxTop3]}>
        <Text style={[styles.rankText, isTop3 && styles.rankTextTop3]}>
          {item.rank}
        </Text>
      </View>

      {/* Avatar + Name */}
      <View style={styles.userInfo}>
        <Avatar style={styles.avatar}>
          {item.avatarURL ? (
            <AvatarImage source={{ uri: item.avatarURL }} />
          ) : (
            <AvatarFallback fullName={item.displayName || initials} />
          )}
        </Avatar>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.name} numberOfLines={1}>
            {item.displayName}
          </Text>
          <Text style={styles.period}>{item.period}</Text>
        </View>
      </View>

      {/* Score */}
      <View style={styles.scoreWrapper}>
        <Text style={styles.scoreLabel}>Puntos</Text>
        <Text style={[styles.scoreValue, isTop3 && styles.scoreValueTop3]}>
          {item.score}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// estilos igual que ya los tienes…
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    marginBottom: 10,
  },
  rowTop3: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY + '10',
  },
  rankBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
  },
  rankBoxTop3: {
    backgroundColor: COLORS.PRIMARY + '22',
    borderColor: COLORS.PRIMARY,
  },
  rankText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  rankTextTop3: {
    color: COLORS.PRIMARY,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  period: {
    marginTop: 2,
    fontSize: 11,
    color: COLORS.TEXT_MUTED,
  },
  scoreWrapper: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  scoreLabel: {
    fontSize: 11,
    color: COLORS.TEXT_MUTED,
  },
  scoreValue: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  scoreValueTop3: {
    color: COLORS.PRIMARY,
  },
});
