// Domain models — used in components, derived from DTOs via mappers

export type AvatarPreset = 'preset_1' | 'preset_2' | 'preset_3' | 'preset_4';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  city: string | null;
  avatarUrl: string | null;
  avatarPreset: AvatarPreset | null;
  sports: string[];
  totalMatches: number;
  onboardingCompleted: boolean;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export type MatchFmt = '5v5' | '6v6' | '7v7' | '8v8' | '11v11';

export type MatchRole = 'host' | 'joined' | 'visitor';

export interface MatchHost {
  id: string;
  name: string;
}

export interface MatchParticipant {
  id: string;
  name: string;
  avatarUrl: string | null;
  avatarPreset: string | null;
}

export interface Match {
  id: string;
  title: string;
  fmt: string;
  startsAt: Date;
  city: string;
  district: string;
  venueName: string;
  distanceKm: number;
  capacity: number;
  joinedCount: number;
  host: MatchHost;
}

export interface MatchDetail extends Match {
  description: string;
  isJoinedByMe: boolean;
  participants: MatchParticipant[];
  shareUrl: string;
}

export interface MatchSection {
  title: string;
  data: Match[];
}

export interface Message {
  id: string;
  matchId: string;
  userId: string;
  text: string;
  sentAt: Date;
}

export interface MatchFilters {
  district?: string;
  date?: string; // DD/MM/YYYY
}
