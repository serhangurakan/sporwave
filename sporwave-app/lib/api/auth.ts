import { apiClient } from './client';
import type { AuthResponseDTO, RefreshResponseDTO } from '@/types/api';

export async function register(name: string, email: string, password: string): Promise<AuthResponseDTO> {
  const { data } = await apiClient.post<AuthResponseDTO>('/auth/register', { name, email, password });
  return data;
}

export async function login(email: string, password: string): Promise<AuthResponseDTO> {
  const { data } = await apiClient.post<AuthResponseDTO>('/auth/login', { email, password });
  return data;
}

export async function refresh(refreshToken: string): Promise<RefreshResponseDTO> {
  const { data } = await apiClient.post<RefreshResponseDTO>('/auth/refresh', { refreshToken });
  return data;
}

export async function socialGoogle(idToken: string): Promise<AuthResponseDTO> {
  const { data } = await apiClient.post<AuthResponseDTO>('/auth/social/google', { idToken });
  return data;
}

export async function socialApple(identityToken: string): Promise<AuthResponseDTO> {
  const { data } = await apiClient.post<AuthResponseDTO>('/auth/social/apple', { identityToken });
  return data;
}

export async function forgotPassword(email: string): Promise<void> {
  await apiClient.post('/auth/forgot-password', { email });
}

export async function logout(refreshToken: string): Promise<void> {
  await apiClient.post('/auth/logout', { refreshToken });
}
