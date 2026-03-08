import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { T } from '@/constants/theme';
import { useMatchDetail } from '@/lib/hooks/useMatchDetail';
import { useChat } from '@/lib/hooks/useChat';
import { useAuth } from '@/lib/auth/useAuth';
import { formatMatchDate, formatMatchTime, formatCapacity } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/Button';

export default function MatchDetailScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { match, role, isLoading, error, join, leave, reload } = useMatchDetail(matchId);
  const { messages, isLoading: chatLoading, isSending, send } = useChat(matchId);
  const [text, setText] = useState('');

  const canChat = role === 'host' || role === 'joined';

  async function handleShare() {
    if (!match) return;
    await Share.share({ url: match.shareUrl, message: `${match.title} — ${match.shareUrl}` });
  }

  async function handleJoin() {
    try {
      await join();
    } catch (e: any) {
      Alert.alert('Hata', e?.response?.data?.error?.message ?? 'Katılım başarısız');
    }
  }

  async function handleLeave() {
    Alert.alert('Maçtan Ayrıl', 'Bu maçtan ayrılmak istediğine emin misin?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Ayrıl', style: 'destructive', onPress: async () => { try { await leave(); } catch {} } },
    ]);
  }

  async function handleSend() {
    const msg = text.trim();
    if (!msg || isSending) return;
    setText('');
    await send(msg);
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={T.accent} size="large" />
      </View>
    );
  }

  if (error || !match) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error ?? 'Maç bulunamadı'}</Text>
        <Button label="Geri Dön" onPress={() => router.back()} variant="secondary" />
      </View>
    );
  }

  const pct = match.joinedCount / match.capacity;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{match.title}</Text>
        <TouchableOpacity onPress={handleShare}>
          <Text style={styles.shareBtn}>Paylaş</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.fmtBadge}>{match.fmt}</Text>
            <Text style={styles.date}>{formatMatchDate(match.startsAt)} • {formatMatchTime(match.startsAt)}</Text>
          </View>
          <Text style={styles.venue}>{match.venueName}</Text>
          <Text style={styles.district}>{match.district}, {match.city}</Text>

          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.min(pct * 100, 100)}%` }]} />
            </View>
            <Text style={styles.capacityText}>{formatCapacity(match.joinedCount, match.capacity)} oyuncu</Text>
          </View>

          <Text style={styles.host}>Organizatör: {match.host.name}</Text>
        </View>

        {/* Description */}
        {match.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Açıklama</Text>
            <Text style={styles.description}>{match.description}</Text>
          </View>
        ) : null}

        {/* Participants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Katılımcılar ({match.participants.length})</Text>
          {match.participants.map((p) => (
            <View key={p.id} style={styles.participantRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>{p.name[0]}</Text>
              </View>
              <Text style={styles.participantName}>{p.name}</Text>
              {p.id === match.host.id ? <Text style={styles.hostBadge}>Host</Text> : null}
            </View>
          ))}
        </View>

        {/* Chat */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Maç Sohbeti</Text>

          {chatLoading ? (
            <ActivityIndicator color={T.accent} />
          ) : messages.length === 0 ? (
            <Text style={styles.emptyChat}>Henüz mesaj yok.</Text>
          ) : (
            messages.map((msg) => {
              const isMe = msg.userId === user?.id;
              return (
                <View key={msg.id} style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                  <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>{msg.text}</Text>
                </View>
              );
            })
          )}

          {!canChat && (
            <View style={styles.gateBox}>
              <Text style={styles.gateText}>Mesaj göndermek için maça katıl.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer actions */}
      <View style={styles.footer}>
        {role === 'visitor' && (
          <Button label="Maça Katıl" onPress={handleJoin} />
        )}
        {role === 'joined' && (
          <Button label="Maçtan Ayrıl" onPress={handleLeave} variant="danger" />
        )}
        {canChat && (
          <View style={styles.chatInput}>
            <TextInput
              style={styles.input}
              placeholder="Mesaj yaz..."
              placeholderTextColor={T.textMuted}
              value={text}
              onChangeText={setText}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!text.trim() || isSending}
              style={styles.sendBtn}
            >
              <Text style={styles.sendText}>Gönder</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  center: { flex: 1, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center', gap: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.cardBorder,
    gap: 12,
  },
  back: { width: 32 },
  backText: { color: T.accent, fontSize: 22 },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '700', color: T.text },
  shareBtn: { color: T.accent, fontSize: 14, fontWeight: '600' },
  scroll: { flex: 1 },
  summaryCard: {
    margin: 18,
    backgroundColor: T.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: T.cardBorder,
    gap: 8,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fmtBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: T.accent,
    backgroundColor: 'rgba(134,238,96,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  date: { fontSize: 14, color: T.textDim },
  venue: { fontSize: 16, fontWeight: '700', color: T.text },
  district: { fontSize: 13, color: T.textMuted },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: T.progressTrack,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: T.accent, borderRadius: 2 },
  capacityText: { fontSize: 12, color: T.textDim, fontWeight: '600' },
  host: { fontSize: 13, color: T.textMuted },
  section: { paddingHorizontal: 18, paddingBottom: 24, gap: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: T.textDim, textTransform: 'uppercase', letterSpacing: 0.5 },
  description: { fontSize: 14, color: T.text, lineHeight: 22 },
  participantRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: T.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { color: T.text, fontWeight: '700', fontSize: 15 },
  participantName: { flex: 1, color: T.text, fontSize: 15 },
  hostBadge: {
    fontSize: 11,
    color: T.accent,
    backgroundColor: 'rgba(134,238,96,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: '600',
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 14,
    marginVertical: 2,
  },
  bubbleMe: { backgroundColor: T.accent, alignSelf: 'flex-end' },
  bubbleThem: { backgroundColor: T.cardElevated, alignSelf: 'flex-start' },
  bubbleText: { color: T.text, fontSize: 14 },
  bubbleTextMe: { color: T.onAccent },
  emptyChat: { color: T.textMuted, fontSize: 14 },
  gateBox: {
    backgroundColor: T.cardElevated,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  gateText: { color: T.textMuted, fontSize: 14 },
  footer: { padding: 18, paddingBottom: 34, gap: 10, borderTopWidth: 1, borderTopColor: T.cardBorder },
  chatInput: {
    flexDirection: 'row',
    backgroundColor: T.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.cardBorder,
    paddingHorizontal: 14,
    alignItems: 'center',
    gap: 10,
    height: 48,
  },
  input: { flex: 1, color: T.text, fontSize: 15 },
  sendBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: T.accent,
    borderRadius: 10,
  },
  sendText: { color: T.onAccent, fontWeight: '700', fontSize: 13 },
  errorText: { color: T.red, fontSize: 15 },
});
