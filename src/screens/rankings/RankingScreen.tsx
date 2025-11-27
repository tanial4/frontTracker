// src/screens/rankings/RankingsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MainLayout } from '../../components/layout/MainLayout';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { RankingsStackParamList } from '../../components/navigation/RankingStack';
import { RankingEntryUI } from '../../types/stats';
import { MOCK_RANKING_GLOBAL } from '../../data/TestRankingData';


type Nav = NativeStackNavigationProp<RankingsStackParamList, 'RankingsHome'>;

export function RankingsScreen() {
  const navigation = useNavigation<Nav>();

  const handleRowPress = (userId: string) => {
    navigation.navigate('PublicProfile', { userId });
  };

  const renderItem = ({ item }: { item: RankingEntryUI }) => {
    const isTop3 = item.rank <= 3;

    return (
      <TouchableOpacity
        style={[styles.row, isTop3 && styles.rowTop3]}
        activeOpacity={0.8}
        onPress={() => handleRowPress(item.userId)}
      >
        {/* Posición */}
        <View style={styles.rankCircle}>
          <Text style={styles.rankText}>{item.rank}</Text>
        </View>

        {/* Info usuario */}
        <View style={styles.userInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {item.displayName}
          </Text>
          <Text style={styles.period}>{item.period}</Text>
        </View>

        {/* Score */}
        <View style={styles.scoreWrapper}>
          <Text style={styles.scoreLabel}>Puntos</Text>
          <Text style={styles.scoreValue}>{item.score}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <MainLayout
      headerTitle="Ranking global"
      activeRoute="Rankings"
      onNavigate={(route) => (navigation as any).navigate(route)}
    >
      <View style={styles.container}>
        <Text style={styles.subtitle}>
          Snapshot semanal – ranking global
        </Text>

        <FlatList
          data={MOCK_RANKING_GLOBAL}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.TEXT_MUTED,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 24,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
  },
  rowTop3: {
    borderColor: COLORS.PRIMARY,
  },
  rankCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.BACKGROUND_DEFAULT,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  period: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
  },
  scoreWrapper: {
    alignItems: 'flex-end',
  },
  scoreLabel: {
    fontSize: 11,
    color: COLORS.TEXT_MUTED,
  },
  scoreValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
});

export default RankingsScreen;
