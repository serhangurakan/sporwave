import type { Response } from 'express';

export function apiError(res: Response, status: number, code: string, message: string) {
  return res.status(status).json({ error: { code, message } });
}

export function formatUserResponse(uid: string, doc: FirebaseFirestore.DocumentData) {
  return {
    id: uid,
    name: doc.name,
    username: doc.username ?? null,
    email: doc.email,
    city: doc.city ?? null,
    avatarUrl: doc.avatarUrl ?? null,
    avatarPreset: doc.avatarPreset ?? null,
    sports: doc.sports ?? [],
    totalMatches: doc.totalMatches ?? 0,
    onboardingCompleted: doc.onboardingCompleted ?? false,
  };
}

export function formatMatchResponse(
  matchId: string,
  doc: FirebaseFirestore.DocumentData,
  extras: Record<string, unknown> = {},
) {
  return {
    id: matchId,
    title: doc.title,
    fmt: doc.fmt,
    startsAt: doc.startsAt.toDate().toISOString(),
    city: doc.city,
    district: doc.district,
    venueName: doc.venueName,
    capacity: doc.capacity,
    joinedCount: doc.joinedCount,
    ...extras,
  };
}
