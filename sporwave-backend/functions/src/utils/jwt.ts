import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../types';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'sporwave_access_secret_dev';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'sporwave_refresh_secret_dev';
const ACCESS_EXPIRY = '60m';
const REFRESH_EXPIRY = '30d';

export function signAccessToken(uid: string, email: string): string {
  return jwt.sign({ uid, email, type: 'access' } satisfies JwtPayload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRY,
  });
}

export function signRefreshToken(uid: string, email: string): string {
  return jwt.sign({ uid, email, type: 'refresh' } satisfies JwtPayload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRY,
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}
