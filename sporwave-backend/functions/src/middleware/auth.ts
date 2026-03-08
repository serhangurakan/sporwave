import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { apiError } from '../utils/response';

export interface AuthRequest extends Request {
  uid?: string;
  userEmail?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    apiError(res, 401, 'UNAUTHORIZED', 'Missing or invalid Authorization header');
    return;
  }
  const token = header.slice(7);
  try {
    const payload = verifyAccessToken(token);
    if (payload.type !== 'access') {
      apiError(res, 401, 'INVALID_TOKEN', 'Invalid token type');
      return;
    }
    req.uid = payload.uid;
    req.userEmail = payload.email;
    next();
  } catch {
    apiError(res, 401, 'TOKEN_EXPIRED', 'Access token expired or invalid');
  }
}
