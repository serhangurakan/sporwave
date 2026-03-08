import * as SecureStore from 'expo-secure-store';

const KEYS = {
  ACCESS: 'sporwave.accessToken',
  REFRESH: 'sporwave.refreshToken',
} as const;

export async function getTokens(): Promise<{ accessToken: string; refreshToken: string } | null> {
  const [access, refresh] = await Promise.all([
    SecureStore.getItemAsync(KEYS.ACCESS),
    SecureStore.getItemAsync(KEYS.REFRESH),
  ]);
  if (!access || !refresh) return null;
  return { accessToken: access, refreshToken: refresh };
}

export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(KEYS.ACCESS, accessToken),
    SecureStore.setItemAsync(KEYS.REFRESH, refreshToken),
  ]);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(KEYS.ACCESS),
    SecureStore.deleteItemAsync(KEYS.REFRESH),
  ]);
}
