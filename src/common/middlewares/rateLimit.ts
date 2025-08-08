import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

export const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 100,
  delayMs: (used, req) => {
    const delayAfter = req.slowDown.limit;
    return (used - delayAfter) * 250;
  },
});
