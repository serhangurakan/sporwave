import { Router } from 'express';
import * as admin from 'firebase-admin';
import { requireAuth, type AuthRequest } from '../middleware/auth';
import { apiError } from '../utils/response';
import { haversineKm, DISTRICT_COORDS } from '../utils/distance';

const router = Router();
const db = () => admin.firestore();

// GET /matches
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const { city, district, date, userLat, userLng, limit = '20', cursor } = req.query as Record<string, string>;

  if (!city) return apiError(res, 400, 'MISSING_FIELDS', 'city is required');

  const pageLimit = Math.min(parseInt(limit, 10) || 20, 50);

  try {
    let query: FirebaseFirestore.Query = db()
      .collection('matches')
      .where('city', '==', city)
      .where('status', '==', 'planned')
      .orderBy('startsAt', 'asc');

    if (district) {
      query = db()
        .collection('matches')
        .where('city', '==', city)
        .where('district', '==', district)
        .where('status', '==', 'planned')
        .orderBy('startsAt', 'asc');
    }

    if (date) {
      // date format: DD/MM/YYYY
      const [dd, mm, yyyy] = date.split('/');
      const start = new Date(`${yyyy}-${mm}-${dd}T00:00:00Z`);
      const end = new Date(`${yyyy}-${mm}-${dd}T23:59:59Z`);
      query = query
        .where('startsAt', '>=', admin.firestore.Timestamp.fromDate(start))
        .where('startsAt', '<=', admin.firestore.Timestamp.fromDate(end));
    }

    if (cursor) {
      const cursorSnap = await db().collection('matches').doc(cursor).get();
      if (cursorSnap.exists) query = query.startAfter(cursorSnap);
    }

    const snap = await query.limit(pageLimit + 1).get();
    const hasNext = snap.docs.length > pageLimit;
    const docs = hasNext ? snap.docs.slice(0, pageLimit) : snap.docs;

    const lat = userLat ? parseFloat(userLat) : null;
    const lng = userLng ? parseFloat(userLng) : null;

    const items = await Promise.all(
      docs.map(async (doc) => {
        const d = doc.data();
        const hostSnap = await db().collection('users').doc(d.hostUserId).get();
        const hostData = hostSnap.data();

        let distanceKm = 0;
        if (lat !== null && lng !== null) {
          const coords = DISTRICT_COORDS[d.district];
          if (coords) {
            distanceKm = parseFloat(haversineKm(lat, lng, coords[0], coords[1]).toFixed(1));
          }
        } else {
          distanceKm = d.distanceKmByDistrict?.[d.district] ?? 0;
        }

        return {
          id: doc.id,
          title: d.title,
          fmt: d.fmt,
          startsAt: d.startsAt.toDate().toISOString(),
          city: d.city,
          district: d.district,
          venueName: d.venueName,
          distanceKm,
          capacity: d.capacity,
          joinedCount: d.joinedCount,
          host: {
            id: d.hostUserId,
            name: hostData?.name ?? 'Unknown',
          },
        };
      }),
    );

    return res.json({
      items,
      pageInfo: {
        nextCursor: hasNext ? docs[docs.length - 1].id : null,
        hasNext,
      },
    });
  } catch (err) {
    console.error(err);
    return apiError(res, 500, 'INTERNAL_ERROR', 'Failed to fetch matches');
  }
});

// GET /matches/:matchId
router.get('/:matchId', requireAuth, async (req: AuthRequest, res) => {
  const { matchId } = req.params;

  try {
    const matchSnap = await db().collection('matches').doc(matchId).get();
    if (!matchSnap.exists) return apiError(res, 404, 'NOT_FOUND', 'Match not found');

    const d = matchSnap.data()!;

    // Get host
    const hostSnap = await db().collection('users').doc(d.hostUserId).get();
    const hostData = hostSnap.data();

    // Get participants
    const participantsSnap = await db()
      .collection('matchParticipants')
      .where('matchId', '==', matchId)
      .where('status', '==', 'joined')
      .get();

    const participants = await Promise.all(
      participantsSnap.docs.map(async (pDoc) => {
        const pData = pDoc.data();
        const userSnap = await db().collection('users').doc(pData.userId).get();
        const userData = userSnap.data();
        return {
          id: pData.userId,
          name: userData?.name ?? 'Unknown',
          avatarUrl: userData?.avatarUrl ?? null,
          avatarPreset: userData?.avatarPreset ?? null,
        };
      }),
    );

    // Check if current user joined
    const myParticipant = participantsSnap.docs.find((p) => p.data().userId === req.uid);
    const isJoinedByMe = !!myParticipant;

    const distanceKm = d.distanceKmByDistrict?.[d.district] ?? 0;

    return res.json({
      id: matchId,
      title: d.title,
      fmt: d.fmt,
      description: d.description ?? '',
      startsAt: d.startsAt.toDate().toISOString(),
      city: d.city,
      district: d.district,
      venueName: d.venueName,
      distanceKm,
      capacity: d.capacity,
      joinedCount: d.joinedCount,
      isJoinedByMe,
      host: { id: d.hostUserId, name: hostData?.name ?? 'Unknown' },
      participants,
      shareUrl: d.shareUrl,
    });
  } catch (err) {
    console.error(err);
    return apiError(res, 500, 'INTERNAL_ERROR', 'Failed to fetch match');
  }
});

// POST /matches/:matchId/join
router.post('/:matchId/join', requireAuth, async (req: AuthRequest, res) => {
  const { matchId } = req.params;
  const uid = req.uid!;

  try {
    const matchRef = db().collection('matches').doc(matchId);
    const matchSnap = await matchRef.get();

    if (!matchSnap.exists) return apiError(res, 404, 'NOT_FOUND', 'Match not found');

    const d = matchSnap.data()!;
    if (d.status !== 'planned') return apiError(res, 400, 'MATCH_NOT_PLANNED', 'Match is not open for joining');
    if (d.joinedCount >= d.capacity) return apiError(res, 400, 'MATCH_FULL', 'Match is at full capacity');

    const participantId = `${matchId}_${uid}`;
    const participantRef = db().collection('matchParticipants').doc(participantId);
    const participantSnap = await participantRef.get();

    if (participantSnap.exists && participantSnap.data()?.status === 'joined') {
      return apiError(res, 409, 'ALREADY_JOINED', 'You have already joined this match');
    }

    const now = admin.firestore.Timestamp.now();
    const batch = db().batch();

    batch.set(participantRef, {
      matchId,
      userId: uid,
      role: 'player',
      status: 'joined',
      joinedAt: now,
      leftAt: null,
      createdAt: participantSnap.exists ? participantSnap.data()!.createdAt : now,
      updatedAt: now,
    });

    batch.update(matchRef, {
      joinedCount: admin.firestore.FieldValue.increment(1),
      updatedAt: now,
    });

    batch.update(db().collection('users').doc(uid), {
      totalMatches: admin.firestore.FieldValue.increment(1),
      updatedAt: now,
    });

    await batch.commit();

    const updatedSnap = await matchRef.get();
    const updated = updatedSnap.data()!;

    return res.json({
      id: matchId,
      joinedCount: updated.joinedCount,
      isJoinedByMe: true,
    });
  } catch (err) {
    console.error(err);
    return apiError(res, 500, 'INTERNAL_ERROR', 'Failed to join match');
  }
});

// POST /matches/:matchId/leave
router.post('/:matchId/leave', requireAuth, async (req: AuthRequest, res) => {
  const { matchId } = req.params;
  const uid = req.uid!;

  try {
    const matchRef = db().collection('matches').doc(matchId);
    const participantId = `${matchId}_${uid}`;
    const participantRef = db().collection('matchParticipants').doc(participantId);
    const participantSnap = await participantRef.get();

    if (!participantSnap.exists || participantSnap.data()?.status !== 'joined') {
      return apiError(res, 400, 'NOT_JOINED', 'You are not joined to this match');
    }

    const now = admin.firestore.Timestamp.now();
    const batch = db().batch();

    batch.update(participantRef, {
      status: 'left',
      leftAt: now,
      updatedAt: now,
    });

    batch.update(matchRef, {
      joinedCount: admin.firestore.FieldValue.increment(-1),
      updatedAt: now,
    });

    batch.update(db().collection('users').doc(uid), {
      totalMatches: admin.firestore.FieldValue.increment(-1),
      updatedAt: now,
    });

    await batch.commit();

    const updatedSnap = await matchRef.get();
    const updated = updatedSnap.data()!;

    return res.json({
      id: matchId,
      joinedCount: updated.joinedCount,
      isJoinedByMe: false,
    });
  } catch (err) {
    console.error(err);
    return apiError(res, 500, 'INTERNAL_ERROR', 'Failed to leave match');
  }
});

// GET /matches/:matchId/messages
router.get('/:matchId/messages', requireAuth, async (req: AuthRequest, res) => {
  const { matchId } = req.params;
  const { limit = '30', cursor } = req.query as Record<string, string>;
  const pageLimit = Math.min(parseInt(limit, 10) || 30, 100);

  try {
    let query: FirebaseFirestore.Query = db()
      .collection('matchMessages')
      .where('matchId', '==', matchId)
      .orderBy('sentAt', 'asc');

    if (cursor) {
      const cursorSnap = await db().collection('matchMessages').doc(cursor).get();
      if (cursorSnap.exists) query = query.startAfter(cursorSnap);
    }

    const snap = await query.limit(pageLimit + 1).get();
    const hasNext = snap.docs.length > pageLimit;
    const docs = hasNext ? snap.docs.slice(0, pageLimit) : snap.docs;

    const items = docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        matchId: d.matchId,
        userId: d.userId,
        text: d.text,
        sentAt: d.sentAt.toDate().toISOString(),
      };
    });

    return res.json({
      items,
      pageInfo: {
        nextCursor: hasNext ? docs[docs.length - 1].id : null,
        hasNext,
      },
    });
  } catch (err) {
    console.error(err);
    return apiError(res, 500, 'INTERNAL_ERROR', 'Failed to fetch messages');
  }
});

// POST /matches/:matchId/messages
router.post('/:matchId/messages', requireAuth, async (req: AuthRequest, res) => {
  const { matchId } = req.params;
  const { text } = req.body;
  const uid = req.uid!;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return apiError(res, 400, 'MISSING_FIELDS', 'text is required');
  }

  try {
    // Verify user is a joined participant
    const participantId = `${matchId}_${uid}`;
    const participantSnap = await db().collection('matchParticipants').doc(participantId).get();

    if (!participantSnap.exists || participantSnap.data()?.status !== 'joined') {
      return apiError(res, 403, 'NOT_PARTICIPANT', 'You must join the match to send messages');
    }

    const now = admin.firestore.Timestamp.now();
    const messageRef = await db().collection('matchMessages').add({
      matchId,
      userId: uid,
      text: text.trim(),
      sentAt: now,
      createdAt: now,
      updatedAt: now,
    });

    return res.status(201).json({
      id: messageRef.id,
      matchId,
      userId: uid,
      text: text.trim(),
      sentAt: now.toDate().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return apiError(res, 500, 'INTERNAL_ERROR', 'Failed to send message');
  }
});

export default router;
