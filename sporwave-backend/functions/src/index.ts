import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';

import authRouter from './routes/auth';
import meRouter from './routes/me';
import matchesRouter from './routes/matches';

admin.initializeApp();

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/me', meRouter);
app.use('/api/v1/matches', matchesRouter);

// Health check
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

export const api = functions.https.onRequest(app);
