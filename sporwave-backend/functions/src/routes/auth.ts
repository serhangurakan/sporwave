import { Router } from 'express';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { apiError, formatUserResponse } from '../utils/response';
import { requireAuth, type AuthRequest } from '../middleware/auth';

const router = Router();
const db = () => admin.firestore();

// POST /auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return apiError(res, 400, 'MISSING_FIELDS', 'name, email and password are required');
  }

  try {
    const firebaseUser = await admin.auth().createUser({ email, password, displayName: name });
    const uid = firebaseUser.uid;
    const now = Timestamp.now();

    const userDoc = {
      email,
      name,
      city: null,
      sports: [],
      avatarUrl: null,
      avatarPreset: null,
      onboardingCompleted: false,
      totalMatches: 0,
      createdAt: now,
      updatedAt: now,
    };

    await db().collection('users').doc(uid).set(userDoc);

    const accessToken = signAccessToken(uid, email);
    const refreshToken = signRefreshToken(uid, email);
    await storeSession(uid, refreshToken);

    return res.status(201).json({
      user: formatUserResponse(uid, userDoc),
      tokens: { accessToken, refreshToken },
    });
  } catch (err: any) {
    if (err.code === 'auth/email-already-exists') {
      return apiError(res, 409, 'EMAIL_EXISTS', 'Email already in use');
    }
    console.error(err);
    return apiError(res, 500, 'INTERNAL_ERROR', 'Registration failed');
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return apiError(res, 400, 'MISSING_FIELDS', 'email and password are required');
  }

  try {
    // Verify via Firebase Auth REST (sign-in with email/password)
    const apiKey = process.env.FIREBASE_API_KEY ?? '';
    const resp = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      },
    );

    if (!resp.ok) {
      return apiError(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const fbData = await resp.json() as { localId: string };
    const uid = fbData.localId;

    const userSnap = await db().collection('users').doc(uid).get();
    if (!userSnap.exists) {
      return apiError(res, 404, 'USER_NOT_FOUND', 'User not found');
    }

    const accessToken = signAccessToken(uid, email);
    const refreshToken = signRefreshToken(uid, email);
    await storeSession(uid, refreshToken);

    return res.json({
      user: formatUserResponse(uid, userSnap.data()!),
      tokens: { accessToken, refreshToken },
    });
  } catch (err) {
    console.error(err);
    return apiError(res, 500, 'INTERNAL_ERROR', 'Login failed');
  }
});

// POST /auth/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return apiError(res, 400, 'MISSING_FIELDS', 'refreshToken is required');
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    if (payload.type !== 'refresh') {
      return apiError(res, 401, 'INVALID_TOKEN', 'Invalid token type');
    }

    // Verify session exists
    const hash = hashToken(refreshToken);
    const sessionSnap = await db()
      .collection('userSessions')
      .where('userId', '==', payload.uid)
      .where('refreshTokenHash', '==', hash)
      .limit(1)
      .get();

    if (sessionSnap.empty) {
      return apiError(res, 401, 'SESSION_INVALID', 'Session not found or revoked');
    }

    const session = sessionSnap.docs[0];
    const newAccess = signAccessToken(payload.uid, payload.email);
    const newRefresh = signRefreshToken(payload.uid, payload.email);

    // Rotate session
    await session.ref.update({
      refreshTokenHash: hashToken(newRefresh),
      expiresAt: Timestamp.fromMillis(Date.now() + 30 * 24 * 60 * 60 * 1000),
      updatedAt: Timestamp.now(),
    });

    return res.json({ tokens: { accessToken: newAccess, refreshToken: newRefresh } });
  } catch {
    return apiError(res, 401, 'TOKEN_EXPIRED', 'Refresh token expired or invalid');
  }
});

// POST /auth/social/google
router.post('/social/google', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return apiError(res, 400, 'MISSING_FIELDS', 'idToken is required');

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;
    const email = decoded.email ?? '';
    const name = decoded.name ?? email;

    const ref = db().collection('users').doc(uid);
    const snap = await ref.get();
    const now = Timestamp.now();

    if (!snap.exists) {
      await ref.set({
        email,
        name,
        city: null,
        sports: [],
        avatarUrl: null,
        avatarPreset: null,
        onboardingCompleted: false,
        totalMatches: 0,
        createdAt: now,
        updatedAt: now,
      });
    }

    const accessToken = signAccessToken(uid, email);
    const refreshToken = signRefreshToken(uid, email);
    await storeSession(uid, refreshToken);

    const userSnap = await ref.get();
    return res.json({
      user: formatUserResponse(uid, userSnap.data()!),
      tokens: { accessToken, refreshToken },
    });
  } catch (err) {
    console.error(err);
    return apiError(res, 401, 'INVALID_TOKEN', 'Google ID token verification failed');
  }
});

// POST /auth/social/apple
router.post('/social/apple', async (req, res) => {
  const { identityToken } = req.body;
  if (!identityToken) return apiError(res, 400, 'MISSING_FIELDS', 'identityToken is required');

  try {
    const decoded = await admin.auth().verifyIdToken(identityToken);
    const uid = decoded.uid;
    const email = decoded.email ?? '';
    const name = decoded.name ?? email;

    const ref = db().collection('users').doc(uid);
    const snap = await ref.get();
    const now = Timestamp.now();

    if (!snap.exists) {
      await ref.set({
        email,
        name,
        city: null,
        sports: [],
        avatarUrl: null,
        avatarPreset: null,
        onboardingCompleted: false,
        totalMatches: 0,
        createdAt: now,
        updatedAt: now,
      });
    }

    const accessToken = signAccessToken(uid, email);
    const refreshToken = signRefreshToken(uid, email);
    await storeSession(uid, refreshToken);

    const userSnap = await ref.get();
    return res.json({
      user: formatUserResponse(uid, userSnap.data()!),
      tokens: { accessToken, refreshToken },
    });
  } catch (err) {
    console.error(err);
    return apiError(res, 401, 'INVALID_TOKEN', 'Apple identity token verification failed');
  }
});

// POST /auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return apiError(res, 400, 'MISSING_FIELDS', 'email is required');

  try {
    await admin.auth().generatePasswordResetLink(email);
    // In production: send via email service. Here we use Firebase's built-in email.
    return res.json({ success: true });
  } catch {
    // Always return success to prevent email enumeration
    return res.json({ success: true });
  }
});

// POST /auth/logout
router.post('/logout', requireAuth, async (req: AuthRequest, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return apiError(res, 400, 'MISSING_FIELDS', 'refreshToken is required');

  try {
    const hash = hashToken(refreshToken);
    const snap = await db()
      .collection('userSessions')
      .where('userId', '==', req.uid)
      .where('refreshTokenHash', '==', hash)
      .limit(1)
      .get();

    if (!snap.empty) {
      await snap.docs[0].ref.delete();
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return apiError(res, 500, 'INTERNAL_ERROR', 'Logout failed');
  }
});

// Helpers
function hashToken(token: string): string {
  // Simple deterministic hash using bcrypt synchronous hash
  // In prod use crypto.createHash('sha256')
  const crypto = require('crypto') as typeof import('crypto');
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function storeSession(uid: string, refreshToken: string): Promise<void> {
  const now = Timestamp.now();
  const expiresAt = Timestamp.fromMillis(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await db().collection('userSessions').add({
    userId: uid,
    refreshTokenHash: hashToken(refreshToken),
    expiresAt,
    createdAt: now,
    updatedAt: now,
  });
}

export default router;
