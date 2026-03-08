import { Router } from 'express';
import * as admin from 'firebase-admin';
import { requireAuth, type AuthRequest } from '../middleware/auth';
import { apiError, formatUserResponse } from '../utils/response';

const router = Router();
const db = () => admin.firestore();

// GET /me
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const snap = await db().collection('users').doc(req.uid!).get();
    if (!snap.exists) return apiError(res, 404, 'USER_NOT_FOUND', 'User not found');
    return res.json(formatUserResponse(req.uid!, snap.data()!));
  } catch (err) {
    console.error(err);
    return apiError(res, 500, 'INTERNAL_ERROR', 'Failed to fetch profile');
  }
});

// PUT /me/onboarding
router.put('/onboarding', requireAuth, async (req: AuthRequest, res) => {
  const { city, sports, avatarUrl, avatarPreset } = req.body;

  if (!city || typeof city !== 'string' || city.trim().length === 0) {
    return apiError(res, 400, 'VALIDATION_ERROR', 'city is required');
  }
  if (!sports || !Array.isArray(sports) || sports.length === 0) {
    return apiError(res, 400, 'VALIDATION_ERROR', 'sports must be a non-empty array');
  }
  if (!avatarUrl && !avatarPreset) {
    return apiError(res, 400, 'VALIDATION_ERROR', 'avatarUrl or avatarPreset is required');
  }

  const validPresets = ['preset_1', 'preset_2', 'preset_3', 'preset_4'];
  if (avatarPreset && !validPresets.includes(avatarPreset)) {
    return apiError(res, 400, 'VALIDATION_ERROR', 'Invalid avatarPreset value');
  }

  try {
    const now = admin.firestore.Timestamp.now();
    const update: Record<string, unknown> = {
      city: city.trim(),
      sports,
      onboardingCompleted: true,
      updatedAt: now,
    };

    if (avatarUrl) {
      update.avatarUrl = avatarUrl;
      update.avatarPreset = null;
    } else {
      update.avatarUrl = null;
      update.avatarPreset = avatarPreset;
    }

    await db().collection('users').doc(req.uid!).update(update);
    const snap = await db().collection('users').doc(req.uid!).get();

    return res.json({ user: formatUserResponse(req.uid!, snap.data()!) });
  } catch (err) {
    console.error(err);
    return apiError(res, 500, 'INTERNAL_ERROR', 'Onboarding update failed');
  }
});

export default router;
