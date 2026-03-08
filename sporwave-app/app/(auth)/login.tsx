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
import { login } from '@/lib/api/auth';
import { mapUser } from '@/lib/utils/mappers';
import { useAuth } from '@/lib/auth/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) return;
    setLoading(true);
    try {
      const res = await login(email, password);
      await authLogin(mapUser(res.user), res.tokens);
    } catch (e: any) {
      Alert.alert('Hata', e?.response?.data?.error?.message ?? 'Giriş yapılamadı');
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
        <Text style={styles.logo}>SporWave</Text>
        <Text style={styles.tagline}>Maç bul, oyna, kazan.</Text>

        <View style={styles.form}>
          <InputField
            label="E-posta"
            placeholder="ornek@mail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <InputField
            label="Şifre"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
            <Text style={styles.forgot}>Şifremi unuttum</Text>
          </TouchableOpacity>
          <Button label="Giriş Yap" onPress={handleLogin} loading={loading} />
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>veya</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          <Button label="Google ile Giriş" onPress={() => {}} variant="secondary" style={styles.socialBtn} />
          <Button label="Apple ile Giriş" onPress={() => {}} variant="secondary" style={styles.socialBtn} />
        </View>

        <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.registerRow}>
          <Text style={styles.registerText}>
            Hesabın yok mu? <Text style={styles.registerLink}>Kayıt ol</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: T.bg },
  scroll: { flex: 1 },
  content: { padding: 24, paddingTop: 80, gap: 24 },
  logo: { fontSize: 36, fontWeight: '800', color: T.accent, textAlign: 'center' },
  tagline: { fontSize: 15, color: T.textDim, textAlign: 'center' },
  form: { gap: 16 },
  forgot: { fontSize: 13, color: T.accent, textAlign: 'right' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: T.cardBorder },
  dividerText: { fontSize: 13, color: T.textMuted },
  socialRow: { gap: 12 },
  socialBtn: { width: '100%' },
  registerRow: { alignItems: 'center', paddingBottom: 24 },
  registerText: { fontSize: 14, color: T.textDim },
  registerLink: { color: T.accent, fontWeight: '600' },
});
