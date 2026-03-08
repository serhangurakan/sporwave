export interface UserDoc {
  email: string;
  name: string;
  username?: string;
  city: string | null;
  sports: string[];
  avatarUrl: string | null;
  avatarPreset: 'preset_1' | 'preset_2' | 'preset_3' | 'preset_4' | null;
  onboardingCompleted: boolean;
  totalMatches: number;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface MatchDoc {
  title: string;
  fmt: string;
  description?: string;
  city: string;
  district: string;
  venueName: string;
  startsAt: FirebaseFirestore.Timestamp;
  capacity: number;
  joinedCount: number;
  hostUserId: string;
  shareUrl: string;
  status: 'planned' | 'cancelled' | 'done';
  distanceKmByDistrict: Record<string, number>;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface MatchParticipantDoc {
  matchId: string;
  userId: string;
  role: 'host' | 'player';
  status: 'joined' | 'left';
  joinedAt: FirebaseFirestore.Timestamp;
  leftAt: FirebaseFirestore.Timestamp | null;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface MatchMessageDoc {
  matchId: string;
  userId: string;
  text: string;
  sentAt: FirebaseFirestore.Timestamp;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface UserSessionDoc {
  userId: string;
  refreshTokenHash: string;
  expiresAt: FirebaseFirestore.Timestamp;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface JwtPayload {
  uid: string;
  email: string;
  type: 'access' | 'refresh';
}
