import { apiClient } from './client';
import type {
  MatchListItemDTO,
  MatchDetailDTO,
  JoinLeaveResponseDTO,
  MessageDTO,
  PaginatedResponseDTO,
} from '@/types/api';
import { MATCHES_PAGE_SIZE, MESSAGES_PAGE_SIZE } from '@/constants/config';

export interface ListMatchesParams {
  city: string;
  district?: string;
  date?: string; // DD/MM/YYYY
  userLat?: number;
  userLng?: number;
  limit?: number;
  cursor?: string;
}

export async function listMatches(params: ListMatchesParams): Promise<PaginatedResponseDTO<MatchListItemDTO>> {
  const { data } = await apiClient.get<PaginatedResponseDTO<MatchListItemDTO>>('/matches', {
    params: { limit: MATCHES_PAGE_SIZE, ...params },
  });
  return data;
}

export async function getMatch(matchId: string): Promise<MatchDetailDTO> {
  const { data } = await apiClient.get<MatchDetailDTO>(`/matches/${matchId}`);
  return data;
}

export async function joinMatch(matchId: string): Promise<JoinLeaveResponseDTO> {
  const { data } = await apiClient.post<JoinLeaveResponseDTO>(`/matches/${matchId}/join`);
  return data;
}

export async function leaveMatch(matchId: string): Promise<JoinLeaveResponseDTO> {
  const { data } = await apiClient.post<JoinLeaveResponseDTO>(`/matches/${matchId}/leave`);
  return data;
}

export async function getMessages(
  matchId: string,
  cursor?: string,
): Promise<PaginatedResponseDTO<MessageDTO>> {
  const { data } = await apiClient.get<PaginatedResponseDTO<MessageDTO>>(
    `/matches/${matchId}/messages`,
    { params: { limit: MESSAGES_PAGE_SIZE, cursor } },
  );
  return data;
}

export async function postMessage(matchId: string, text: string): Promise<MessageDTO> {
  const { data } = await apiClient.post<MessageDTO>(`/matches/${matchId}/messages`, { text });
  return data;
}
