import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { T } from '@/constants/theme';
import { useMatches } from '@/lib/hooks/useMatches';
import { useAuth } from '@/lib/auth/useAuth';
import type { Match, MatchFilters } from '@/types/domain';
import { formatMatchDate, formatMatchTime, formatDistance, formatCapacity } from '@/lib/utils/formatters';

function MatchCard({ match, onPress }: { match: Match; onPress: () => void }) {
  const pct = match.joinedCount / match.capacity;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>{match.title}</Text>
        <Text style={styles.cardFmt}>{match.fmt}</Text>
      </View>
      <Text style={styles.cardMeta}>
        {formatMatchDate(match.startsAt)} • {formatMatchTime(match.startsAt)}
      </Text>
      <Text style={styles.cardVenue} numberOfLines={1}>
        {match.venueName} — {match.district}
      </Text>
      <View style={styles.cardFooter}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.min(pct * 100, 100)}%` }]} />
        </View>
        <Text style={styles.capacity}>{formatCapacity(match.joinedCount, match.capacity)}</Text>
        <Text style={styles.distance}>{formatDistance(match.distanceKm)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function MatchesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [filters] = useState<MatchFilters>({});
  const { sections, isLoading, isRefreshing, error, hasNext, loadMore, refresh } = useMatches(filters);

  const allMatches = sections.flatMap((s) => s.data);

  if (isLoading && allMatches.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={T.accent} size="large" />
      </View>
    );
  }

  if (error && allMatches.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={refresh} style={styles.retryBtn}>
          <Text style={styles.retryText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Maçlar</Text>
          <Text style={styles.headerSub}>{user?.city ?? ''}</Text>
        </View>
      </View>

      <FlatList
        data={allMatches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            onPress={() => router.push(`/(app)/matches/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Bu bölgede maç bulunamadı.</Text>
          </View>
        }
        ListFooterComponent={
          isLoading && allMatches.length > 0 ? (
            <ActivityIndicator color={T.accent} style={{ padding: 16 }} />
          ) : null
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={T.accent} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  center: { flex: 1, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center' },
  header: {
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: T.cardBorder,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: T.text },
  headerSub: { fontSize: 13, color: T.textMuted, marginTop: 2 },
  list: { padding: 18, paddingTop: 16 },
  card: {
    backgroundColor: T.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: T.cardBorder,
    gap: 6,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: T.text, flex: 1 },
  cardFmt: {
    fontSize: 12,
    fontWeight: '600',
    color: T.accent,
    backgroundColor: 'rgba(134,238,96,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cardMeta: { fontSize: 13, color: T.textDim },
  cardVenue: { fontSize: 13, color: T.textMuted },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: T.progressTrack,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: T.accent, borderRadius: 2 },
  capacity: { fontSize: 12, color: T.textDim, fontWeight: '600' },
  distance: { fontSize: 12, color: T.textMuted },
  empty: { alignItems: 'center', padding: 40 },
  emptyText: { color: T.textMuted, fontSize: 15 },
  errorText: { color: T.red, fontSize: 15, marginBottom: 16 },
  retryBtn: {
    backgroundColor: T.secondaryButton,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: { color: T.text, fontWeight: '600' },
});
