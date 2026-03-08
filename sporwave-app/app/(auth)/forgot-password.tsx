import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { T } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { forgotPassword } from '@/lib/api/auth';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    if (!email) return;
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (e: any) {
      Alert.alert('Hata', e?.response?.data?.error?.message ?? 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Geri</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Şifremi Unuttum</Text>
      <Text style={styles.subtitle}>
        E-posta adresinizi girin, sıfırlama bağlantısı gönderelim.
      </Text>

      {sent ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>
            Şifre sıfırlama bağlantısı {email} adresine gönderildi.
          </Text>
        </View>
      ) : (
        <View style={styles.form}>
          <InputField
            label="E-posta"
            placeholder="ornek@mail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Button label="Bağlantı Gönder" onPress={handleSend} loading={loading} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg, padding: 24, paddingTop: 60 },
  back: { marginBottom: 32 },
  backText: { color: T.accent, fontSize: 15 },
  title: { fontSize: 28, fontWeight: '800', color: T.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: T.textDim, lineHeight: 22, marginBottom: 32 },
  form: { gap: 16 },
  successBox: {
    backgroundColor: T.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: T.success,
  },
  successText: { color: T.success, fontSize: 14, lineHeight: 22 },
});
