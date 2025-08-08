import { ENV } from '@/config/env';
import { PrismaClient, Prisma } from '../../generated/prisma';

declare global {
  var prisma: PrismaClient | undefined;
}

const log: Prisma.LogLevel[] =
  ENV.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'];

export const prisma = global.prisma ?? new PrismaClient({ log });

if (ENV.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
