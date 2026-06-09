import { Request, Response, NextFunction } from 'express';

interface RateLimitData {
  count: number;
  resetTime: number;
}

const ipRequestCache = new Map<string, RateLimitData>();

const REQUEST_LIMIT = 60; // Max 60 requests
const WINDOW_DURATION_MS = 60 * 1000; // Per 1 minute window

// Periodically clean up expired records (every 10 minutes) to prevent memory leaks
if (process.env.NODE_ENV !== 'test') {
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipRequestCache.entries()) {
      if (now > data.resetTime) {
        ipRequestCache.delete(ip);
      }
    }
  }, 10 * 60 * 1000);

  // Prevent the interval from keeping the Node process alive
  cleanupInterval.unref();
}

/**
 * Custom zero-dependency IP Rate Limiting Middleware.
 * Protects critical APIs from brute force and denial of service.
 */
export const rateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const ipAddress = req.ip || req.socket.remoteAddress || 'unknown-ip';
  const currentTime = Date.now();

  const ipRecord = ipRequestCache.get(ipAddress);

  // If no record exists or window expired, set/reset record and continue
  if (!ipRecord || currentTime > ipRecord.resetTime) {
    ipRequestCache.set(ipAddress, {
      count: 1,
      resetTime: currentTime + WINDOW_DURATION_MS,
    });
    next();
    return;
  }

  // If request count exceeds maximum threshold, reject request with 429
  if (ipRecord.count >= REQUEST_LIMIT) {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP. Please wait a minute before retrying.',
    });
    return;
  }

  // Increment request count and proceed
  ipRecord.count += 1;
  next();
};
