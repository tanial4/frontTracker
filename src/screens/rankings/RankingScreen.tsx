// src/screens/rankings/RankingsScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MainLayout } from '../../components/layout/MainLayout';
import { BRAND_COLORS as COLORS } from '../../styles/Colors';
import { RankingsStackParamList } from '../../components/navigation/RankingStack';
import { RankingEntryUI } from '../../types/stats';
import { getTodayPeriod, listRankings, ListRankingsResponse } from '../../services/rankingApi';
import RankingRow from '../../components/ranking/RankingRow';
import { Trophy, UserX, X } from 'lucide-react-native';


type Nav = NativeStackNavigationProp<RankingsStackParamList, 'RankingsHome'>;

export function RankingsScreen() {
  const navigation = useNavigation<Nav>();

  const [data, setData] = useState<RankingEntryUI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [period, setPeriod] = useState<string>(getTodayPeriod());

  const fetchRankings = async (opts?: { showLoader?: boolean }) => {
    try {
      if (opts?.showLoader !== false) setLoading(true);
      setErrorMsg(null);

      const res: ListRankingsResponse = await listRankings({
        period,
        limit: 100,
      });

      const mapped: RankingEntryUI[] = res.rankings.map((entry, index) => {
        const displayName =
          entry.user.username ??
          entry.user.email ??
          `Usuario ${index + 1}`;

        return {
          id: entry.id,
          userId: entry.userId,
          displayName,
          period: res.period,
          score: entry.score,
          rank: index + 1, // 1-based
          avatarURL: null, // no tenemos avatar en este endpoint (se podría extender el backend luego)
        };
      });

      setData(mapped);
    } catch (err) {
      console.log('Error cargando rankings', err);
      setErrorMsg('No se pudo cargar el ranking.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // cargar al entrar y cuando gane foco
  useFocusEffect(
    useCallback(() => {
      fetchRankings();

      return () => {};
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period])
  );

  const handleRowPress = (userId: string) => {
    navigation.navigate('PublicProfile', { userId });
  };

  const renderItem = ({ item }: { item: RankingEntryUI }) => (
    <RankingRow item={item} onPress={handleRowPress} />
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchRankings({ showLoader: false });
  };

  const subtitleText =
    data.length > 0
      ? `Ranking – ${period}`
      : '';

  return (
    <MainLayout
      headerTitle="Ranking global"
      activeRoute="Rankings"
      onNavigate={(route) => (navigation as any).navigate(route)}
    >
      <View style={styles.container}>
        <Text style={styles.subtitle}>{subtitleText}</Text>

        {loading && !refreshing ? (
          <View style={styles.centered}>
            <ActivityIndicator size="small" color={COLORS.PRIMARY} />
            <Text style={styles.loadingText}>Cargando ranking...</Text>
          </View>
        ) : errorMsg ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={[
              styles.listContent,
              data.length === 0 && styles.emptyListContent,
            ]}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={COLORS.PRIMARY}
              />
            }
            ListEmptyComponent={
              !loading ? (
                <View style={styles.centered}>
                  <Trophy size={70} color={COLORS.TEXT_MUTED + '88'} />
                  <Text style={styles.emptyText}>
                    No hay usuarios en el ranking aún.
                  </Text>
                </View>
              ) : null
            }
          />
        )}
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
    marginTop: 10,
    fontSize: 20,
    color: COLORS.TEXT_MUTED,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  loadingText: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.ERROR_TEXT,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.TEXT_MUTED + '88',
    textAlign: 'center',
    paddingTop: 12,
  },
});

export default RankingsScreen;
