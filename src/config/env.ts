import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z
  .object({
    PORT: z.coerce.number().int().positive().default(3000),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    JWT_SECRET: z.string().min(1),
    DATABASE_URL: z.string().min(1).optional(),
    CORS_ORIGIN: z.string().min(1).default('http://localhost:3000,http://localhost:3001'),
  })
  .refine((env) => env.NODE_ENV !== 'production' || !!env.DATABASE_URL, {
    message: 'DATABASE_URL is required in production',
    path: ['DATABASE_URL'],
  });

export const ENV = envSchema.parse(process.env);
