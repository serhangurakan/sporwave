import { useState, useCallback, useEffect } from 'react';
import { listMatches } from '@/lib/api/matches';
import { mapMatch } from '@/lib/utils/mappers';
import type { Match, MatchSection, MatchFilters } from '@/types/domain';
import { useAuth } from '@/lib/auth/useAuth';

export function useMatches(filters: MatchFilters = {}) {
  const { user } = useAuth();
  const [sections, setSections] = useState<MatchSection[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const city = user?.city ?? '';

  const fetchMatches = useCallback(
    async (reset = false) => {
      if (!city) return;
      if (reset) setIsRefreshing(true);
      else setIsLoading(true);

      try {
        const res = await listMatches({
          city,
          district: filters.district,
          date: filters.date,
          cursor: reset ? undefined : cursor ?? undefined,
        });

        const mapped = res.items.map(mapMatch);
        const all = reset ? mapped : [...sections.flatMap((s) => s.data), ...mapped];

        setSections(buildSections(all));
        setCursor(res.pageInfo.nextCursor);
        setHasNext(res.pageInfo.hasNext);
        setError(null);
      } catch (e: any) {
        setError(e?.response?.data?.error?.message ?? 'Bir hata oluştu');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [city, filters.district, filters.date, cursor],
  );

  useEffect(() => {
    fetchMatches(true);
    // Only re-run when filters change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, filters.district, filters.date]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasNext) fetchMatches(false);
  }, [isLoading, hasNext, fetchMatches]);

  const refresh = useCallback(() => {
    fetchMatches(true);
  }, [fetchMatches]);

  return { sections, isLoading, isRefreshing, error, hasNext, loadMore, refresh };
}

function buildSections(matches: Match[]): MatchSection[] {
  const sorted = [...matches].sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  return [{ title: 'Yakınındaki Maçlar', data: sorted }];
}
