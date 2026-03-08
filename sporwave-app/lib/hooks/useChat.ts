import { useState, useEffect, useCallback } from 'react';
import { getMessages, postMessage } from '@/lib/api/matches';
import { mapMessage } from '@/lib/utils/mappers';
import type { Message } from '@/types/domain';

export function useChat(matchId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getMessages(matchId);
      setMessages(res.items.map(mapMessage));
      setError(null);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message ?? 'Mesajlar yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    load();
  }, [load]);

  const send = useCallback(
    async (text: string) => {
      const tempId = `temp_${Date.now()}`;
      const optimistic: Message = {
        id: tempId,
        matchId,
        userId: 'me',
        text,
        sentAt: new Date(),
      };

      setMessages((prev) => [...prev, optimistic]);
      setIsSending(true);

      try {
        const dto = await postMessage(matchId, text);
        const real = mapMessage(dto);
        setMessages((prev) => prev.map((m) => (m.id === tempId ? real : m)));
      } catch {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      } finally {
        setIsSending(false);
      }
    },
    [matchId],
  );

  return { messages, isLoading, isSending, error, send };
}
