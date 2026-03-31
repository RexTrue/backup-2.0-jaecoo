import { Request, Response, NextFunction } from 'express';

const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX ?? 120);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000);

interface RateRecord {
  count: number;
  expiresAt: number;
}

const rateMap = new Map<string, RateRecord>();

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';
  const now = Date.now();
  const existing = rateMap.get(key);

  if (!existing || existing.expiresAt < now) {
    rateMap.set(key, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
  } else {
    if (existing.count >= RATE_LIMIT_MAX) {
      res.status(429).json({
        statusCode: 429,
        message: 'Too many requests, please try again later.',
      });
      return;
    }
    existing.count += 1;
  }

  if (Math.random() < 0.003) {
    const expiration = Date.now();
    for (const [ip, rec] of rateMap.entries()) {
      if (rec.expiresAt < expiration) rateMap.delete(ip);
    }
  }

  next();
}
