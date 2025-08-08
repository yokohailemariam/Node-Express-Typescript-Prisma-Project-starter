import { ENV } from '@/config/env';
import cors from 'cors';

export function buildCors() {
  const origins = ENV.CORS_ORIGIN?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) ?? ['http://localhost:3000'];
  return cors({
    origin: origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    exposedHeaders: ['X-Request-Id', 'ETag'],
    maxAge: 600,
  });
}
