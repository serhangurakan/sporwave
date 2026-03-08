/**
 * Seed script — run locally against emulator or production:
 *   npx ts-node -P tsconfig.json src/seed/run.ts
 *
 * Set FIRESTORE_EMULATOR_HOST=localhost:8080 for emulator.
 */
import * as admin from 'firebase-admin';
import { SEED_USERS, SEED_MATCHES, SEED_PARTICIPANTS, SEED_MESSAGES } from './data';

// Initialize without service account for emulator, or with SA for production
if (!admin.apps.length) {
  admin.initializeApp({ projectId: 'sporwave-f042c' });
}

const db = admin.firestore();

async function seed() {
  console.log('🌱 Starting seed...');

  // Users
  console.log('  → Writing users...');
  for (const user of SEED_USERS) {
    const { uid, ...data } = user;
    const now = admin.firestore.Timestamp.now();
    await db
      .collection('users')
      .doc(uid)
      .set({ ...data, createdAt: now, updatedAt: now }, { merge: true });
  }
  console.log(`  ✓ ${SEED_USERS.length} users`);

  // Matches
  console.log('  → Writing matches...');
  for (const match of SEED_MATCHES) {
    const { id, startsAt, ...data } = match;
    const now = admin.firestore.Timestamp.now();
    await db
      .collection('matches')
      .doc(id)
      .set({
        ...data,
        startsAt: admin.firestore.Timestamp.fromDate(new Date(startsAt)),
        createdAt: now,
        updatedAt: now,
      }, { merge: true });
  }
  console.log(`  ✓ ${SEED_MATCHES.length} matches`);

  // Participants
  console.log('  → Writing participants...');
  for (const p of SEED_PARTICIPANTS) {
    const { id, ...data } = p;
    const now = admin.firestore.Timestamp.now();
    await db
      .collection('matchParticipants')
      .doc(id)
      .set({ ...data, joinedAt: now, leftAt: null, createdAt: now, updatedAt: now }, { merge: true });
  }
  console.log(`  ✓ ${SEED_PARTICIPANTS.length} participants`);

  // Messages
  console.log('  → Writing messages...');
  const now = Date.now();
  const msgBatch = db.batch();
  for (const msg of SEED_MESSAGES) {
    const sentAt = admin.firestore.Timestamp.fromMillis(now - msg.sentAtOffset * 60 * 1000);
    const ref = db.collection('matchMessages').doc();
    msgBatch.set(ref, {
      matchId: msg.matchId,
      userId: msg.userId,
      text: msg.text,
      sentAt,
      createdAt: sentAt,
      updatedAt: sentAt,
    });
  }
  await msgBatch.commit();
  console.log(`  ✓ ${SEED_MESSAGES.length} messages`);

  console.log('✅ Seed complete!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
