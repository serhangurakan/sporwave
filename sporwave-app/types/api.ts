// Raw DTO types — matches the API contract exactly

export interface UserDTO {
  id: string;
  name: string;
  username?: string;
  email: string;
  city: string | null;
  avatarUrl: string | null;
  avatarPreset: 'preset_1' | 'preset_2' | 'preset_3' | 'preset_4' | null;
  sports: string[];
  totalMatches: number;
  onboardingCompleted?: boolean;
}

export interface TokenDTO {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponseDTO {
  user: UserDTO;
  tokens: TokenDTO;
}

export interface RefreshResponseDTO {
  tokens: TokenDTO;
}

export interface MatchHostDTO {
  id: string;
  name: string;
}

export interface MatchParticipantDTO {
  id: string;
  name: string;
  avatarUrl?: string | null;
  avatarPreset?: string | null;
}

export interface MatchListItemDTO {
  id: string;
  title: string;
  fmt: string;
  startsAt: string;
  city: string;
  district: string;
  venueName: string;
  distanceKm: number;
  capacity: number;
  joinedCount: number;
  host: MatchHostDTO;
}

export interface MatchDetailDTO extends MatchListItemDTO {
  description?: string;
  isJoinedByMe: boolean;
  participants: MatchParticipantDTO[];
  shareUrl: string;
}

export interface JoinLeaveResponseDTO {
  id: string;
  joinedCount: number;
  isJoinedByMe: boolean;
}

export interface MessageDTO {
  id: string;
  matchId: string;
  userId: string;
  text: string;
  sentAt: string;
}

export interface PageInfo {
  nextCursor: string | null;
  hasNext: boolean;
}

export interface PaginatedResponseDTO<T> {
  items: T[];
  pageInfo: PageInfo;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

export interface OnboardingRequestDTO {
  city: string;
  sports: string[];
  avatarUrl?: string | null;
  avatarPreset?: string | null;
}
