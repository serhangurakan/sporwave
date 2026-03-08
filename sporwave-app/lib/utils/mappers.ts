import type { UserDTO, MatchListItemDTO, MatchDetailDTO, MessageDTO } from '@/types/api';
import type { User, Match, MatchDetail, Message } from '@/types/domain';

export function mapUser(dto: UserDTO): User {
  return {
    id: dto.id,
    name: dto.name,
    username: dto.username ?? '',
    email: dto.email,
    city: dto.city,
    avatarUrl: dto.avatarUrl,
    avatarPreset: dto.avatarPreset,
    sports: dto.sports,
    totalMatches: dto.totalMatches,
    onboardingCompleted: dto.onboardingCompleted ?? false,
  };
}

export function mapMatch(dto: MatchListItemDTO): Match {
  return {
    id: dto.id,
    title: dto.title,
    fmt: dto.fmt,
    startsAt: new Date(dto.startsAt),
    city: dto.city,
    district: dto.district,
    venueName: dto.venueName,
    distanceKm: dto.distanceKm,
    capacity: dto.capacity,
    joinedCount: dto.joinedCount,
    host: dto.host,
  };
}

export function mapMatchDetail(dto: MatchDetailDTO): MatchDetail {
  return {
    ...mapMatch(dto),
    description: dto.description ?? '',
    isJoinedByMe: dto.isJoinedByMe,
    participants: dto.participants.map((p) => ({
      id: p.id,
      name: p.name,
      avatarUrl: p.avatarUrl ?? null,
      avatarPreset: p.avatarPreset ?? null,
    })),
    shareUrl: dto.shareUrl,
  };
}

export function mapMessage(dto: MessageDTO): Message {
  return {
    id: dto.id,
    matchId: dto.matchId,
    userId: dto.userId,
    text: dto.text,
    sentAt: new Date(dto.sentAt),
  };
}
