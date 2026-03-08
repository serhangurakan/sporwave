import { useState, useEffect, useCallback } from 'react';
import { getMatch, joinMatch, leaveMatch } from '@/lib/api/matches';
import { mapMatchDetail } from '@/lib/utils/mappers';
import { useAuth } from '@/lib/auth/useAuth';
import type { MatchDetail, MatchRole } from '@/types/domain';

export function useMatchDetail(matchId: string) {
  const { user } = useAuth();
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const dto = await getMatch(matchId);
      setMatch(mapMatchDetail(dto));
      setError(null);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message ?? 'Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    load();
  }, [load]);

  const role: MatchRole = (() => {
    if (!match || !user) return 'visitor';
    if (match.host.id === user.id) return 'host';
    if (match.isJoinedByMe) return 'joined';
    return 'visitor';
  })();

  const join = useCallback(async () => {
    if (!match) return;
    const res = await joinMatch(matchId);
    setMatch((prev) =>
      prev ? { ...prev, joinedCount: res.joinedCount, isJoinedByMe: res.isJoinedByMe } : prev,
    );
  }, [matchId, match]);

  const leave = useCallback(async () => {
    if (!match) return;
    const res = await leaveMatch(matchId);
    setMatch((prev) =>
      prev ? { ...prev, joinedCount: res.joinedCount, isJoinedByMe: res.isJoinedByMe } : prev,
    );
  }, [matchId, match]);

  return { match, role, isLoading, error, join, leave, reload: load };
}
