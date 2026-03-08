import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { T } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { putOnboarding } from '@/lib/api/user';
import { mapUser } from '@/lib/utils/mappers';
import { useAuth } from '@/lib/auth/useAuth';
import { SPORTS_LIST } from '@/constants/sports';

const AVATAR_PRESETS = ['preset_1', 'preset_2', 'preset_3', 'preset_4'] as const;
type AvatarPreset = typeof AVATAR_PRESETS[number];

const PRESET_COLORS: Record<AvatarPreset, string> = {
  preset_1: '#FF6B6B',
  preset_2: '#4ECDC4',
  preset_3: '#45B7D1',
  preset_4: '#96CEB4',
};

export default function OnboardingScreen() {
  const { setUser } = useAuth();
  const [step, setStep] = useState(0);
  const [city, setCity] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [avatarPreset, setAvatarPreset] = useState<AvatarPreset | null>(null);
  const [loading, setLoading] = useState(false);

  const steps = ['Şehir', 'Sporlar', 'Avatar'];

  function toggleSport(sport: string) {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport],
    );
  }

  async function handleFinish() {
    if (!avatarPreset) {
      Alert.alert('Hata', 'Lütfen bir avatar seçin');
      return;
    }
    setLoading(true);
    try {
      const userDto = await putOnboarding({
        city,
        sports: selectedSports,
        avatarUrl: null,
        avatarPreset,
      });
      setUser(mapUser(userDto));
    } catch (e: any) {
      Alert.alert('Hata', e?.response?.data?.error?.message ?? 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  function canContinue() {
    if (step === 0) return city.trim().length > 0;
    if (step === 1) return selectedSports.length > 0;
    if (step === 2) return avatarPreset !== null;
    return false;
  }

  return (
    <View style={styles.container}>
      {/* Progress */}
      <View style={styles.progressRow}>
        {steps.map((s, i) => (
          <View key={s} style={[styles.progressDot, i <= step && styles.progressDotActive]} />
        ))}
      </View>
      <Text style={styles.stepLabel}>{steps[step]}</Text>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {step === 0 && (
          <View style={styles.section}>
            <Text style={styles.title}>Hangi şehirdesin?</Text>
            <Text style={styles.subtitle}>Yakınındaki maçları bulabilmek için şehrini gir.</Text>
            <InputField
              placeholder="İstanbul, Ankara, İzmir..."
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
            />
          </View>
        )}

        {step === 1 && (
          <View style={styles.section}>
            <Text style={styles.title}>Hangi sporları oynuyorsun?</Text>
            <Text style={styles.subtitle}>En az bir spor seç.</Text>
            <View style={styles.sportGrid}>
              {SPORTS_LIST.map((sport) => {
                const active = selectedSports.includes(sport.label);
                return (
                  <TouchableOpacity
                    key={sport.id}
                    style={[styles.sportChip, active && styles.sportChipActive]}
                    onPress={() => toggleSport(sport.label)}
                  >
                    <Text style={[styles.sportLabel, active && styles.sportLabelActive]}>
                      {sport.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.section}>
            <Text style={styles.title}>Avatarını seç</Text>
            <Text style={styles.subtitle}>Profilinde gösterilecek avatar.</Text>
            <View style={styles.avatarGrid}>
              {AVATAR_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={[styles.avatarItem, avatarPreset === preset && styles.avatarSelected]}
                  onPress={() => setAvatarPreset(preset)}
                >
                  <View
                    style={[styles.avatarCircle, { backgroundColor: PRESET_COLORS[preset] }]}
                  />
                  {avatarPreset === preset && <Text style={styles.avatarCheck}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step < 2 ? (
          <Button
            label="Devam Et"
            onPress={() => setStep((s) => s + 1)}
            disabled={!canContinue()}
          />
        ) : (
          <Button
            label="Başla"
            onPress={handleFinish}
            loading={loading}
            disabled={!canContinue()}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  progressRow: { flexDirection: 'row', gap: 8, padding: 24, paddingTop: 60 },
  progressDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: T.cardBorder,
  },
  progressDotActive: { backgroundColor: T.accent },
  stepLabel: { fontSize: 12, color: T.textMuted, paddingHorizontal: 24, marginTop: -8 },
  scroll: { flex: 1 },
  content: { padding: 24, gap: 24 },
  section: { gap: 12 },
  title: { fontSize: 24, fontWeight: '800', color: T.text },
  subtitle: { fontSize: 14, color: T.textDim, lineHeight: 22 },
  sportGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sportChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: T.cardBorder,
    backgroundColor: T.card,
  },
  sportChipActive: { borderColor: T.accent, backgroundColor: 'rgba(134,238,96,0.1)' },
  sportLabel: { fontSize: 14, color: T.textDim },
  sportLabelActive: { color: T.accent, fontWeight: '600' },
  avatarGrid: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  avatarItem: {
    padding: 4,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  avatarSelected: { borderColor: T.accent },
  avatarCircle: { width: 72, height: 72, borderRadius: 36 },
  avatarCheck: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: T.accent,
    color: T.onAccent,
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 12,
    fontWeight: '700',
  },
  footer: { padding: 24, paddingBottom: 40 },
});
