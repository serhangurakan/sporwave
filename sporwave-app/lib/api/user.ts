import { apiClient } from './client';
import type { UserDTO, OnboardingRequestDTO } from '@/types/api';

export async function getMe(): Promise<UserDTO> {
  const { data } = await apiClient.get<UserDTO>('/me');
  return data;
}

export async function putOnboarding(payload: OnboardingRequestDTO): Promise<UserDTO> {
  const { data } = await apiClient.put<{ user: UserDTO }>('/me/onboarding', payload);
  return data.user;
}
