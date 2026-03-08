import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { T } from '@/constants/theme';
import { useAuth } from '@/lib/auth/useAuth';
import { Button } from '@/components/ui/Button';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    Alert.alert('Çıkış Yap', 'Hesabından çıkmak istediğine emin misin?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Çıkış Yap', style: 'destructive', onPress: logout },
    ]);
  }

  if (!user) return null;

  const PRESET_COLORS: Record<string, string> = {
    preset_1: '#FF6B6B',
    preset_2: '#4ECDC4',
    preset_3: '#45B7D1',
    preset_4: '#96CEB4',
  };

  const avatarColor = user.avatarPreset ? PRESET_COLORS[user.avatarPreset] : T.accent;

  return (
    <ScrollView style={styles.container}>
      {/* Avatar + name */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarInitial}>{user.name[0]}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        {user.username ? <Text style={styles.username}>@{user.username}</Text> : null}
        {user.city ? <Text style={styles.city}>{user.city}</Text> : null}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{user.totalMatches}</Text>
          <Text style={styles.statLabel}>Maç</Text>
        </View>
      </View>

      {/* Sports */}
      {user.sports.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sporlar</Text>
          <View style={styles.sportsRow}>
            {user.sports.map((sport) => (
              <View key={sport} style={styles.sportChip}>
                <Text style={styles.sportLabel}>{sport}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Logout */}
      <View style={styles.logoutSection}>
        <Button label="Çıkış Yap" onPress={handleLogout} variant="danger" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 24, gap: 8 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarInitial: { fontSize: 36, fontWeight: '800', color: T.white },
  name: { fontSize: 22, fontWeight: '800', color: T.text },
  username: { fontSize: 14, color: T.textMuted },
  city: { fontSize: 13, color: T.textDim },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 18,
    gap: 16,
  },
  statCard: {
    backgroundColor: T.card,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1,
    borderColor: T.cardBorder,
  },
  statValue: { fontSize: 28, fontWeight: '800', color: T.accent },
  statLabel: { fontSize: 13, color: T.textDim, marginTop: 4 },
  section: { paddingHorizontal: 18, paddingBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: T.textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  sportsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sportChip: {
    backgroundColor: T.card,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: T.cardBorder,
  },
  sportLabel: { fontSize: 13, color: T.text },
  logoutSection: { paddingHorizontal: 18, paddingBottom: 40 },
});
