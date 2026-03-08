import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { T } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { register } from '@/lib/api/auth';
import { mapUser } from '@/lib/utils/mappers';
import { useAuth } from '@/lib/auth/useAuth';

export default function RegisterScreen() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [kvkk, setKvkk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name || !email || !password) return;
    if (password !== passwordConfirm) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }
    if (!kvkk) {
      Alert.alert('Hata', 'KVKK metnini onaylamanız gerekiyor');
      return;
    }
    setLoading(true);
    try {
      const res = await register(name, email, password);
      await authLogin(mapUser(res.user), res.tokens);
    } catch (e: any) {
      Alert.alert('Hata', e?.response?.data?.error?.message ?? 'Kayıt yapılamadı');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Hesap Oluştur</Text>

        <View style={styles.form}>
          <InputField label="Ad Soyad" placeholder="Adın Soyadın" value={name} onChangeText={setName} autoCapitalize="words" />
          <InputField label="E-posta" placeholder="ornek@mail.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <InputField label="Şifre" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry />
          <InputField label="Şifre Tekrar" placeholder="••••••••" value={passwordConfirm} onChangeText={setPasswordConfirm} secureTextEntry />

          <TouchableOpacity style={styles.kvkkRow} onPress={() => setKvkk((v) => !v)}>
            <View style={[styles.checkbox, kvkk && styles.checkboxChecked]}>
              {kvkk ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
            <Text style={styles.kvkkText}>
              <Text style={styles.kvkkLink}>KVKK Aydınlatma Metni</Text>'ni okudum ve onaylıyorum
            </Text>
          </TouchableOpacity>

          <Button label="Kayıt Ol" onPress={handleRegister} loading={loading} />
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>veya</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          <Button label="Google ile Kayıt" onPress={() => {}} variant="secondary" />
          <Button label="Apple ile Kayıt" onPress={() => {}} variant="secondary" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: T.bg },
  scroll: { flex: 1 },
  content: { padding: 24, paddingTop: 60, gap: 24 },
  back: { marginBottom: 8 },
  backText: { color: T.accent, fontSize: 15 },
  title: { fontSize: 28, fontWeight: '800', color: T.text },
  form: { gap: 16 },
  kvkkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: T.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: { backgroundColor: T.accent, borderColor: T.accent },
  checkmark: { color: T.onAccent, fontWeight: '700', fontSize: 13 },
  kvkkText: { flex: 1, fontSize: 13, color: T.textDim, lineHeight: 20 },
  kvkkLink: { color: T.accent },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: T.cardBorder },
  dividerText: { fontSize: 13, color: T.textMuted },
  socialRow: { gap: 12, paddingBottom: 24 },
});
