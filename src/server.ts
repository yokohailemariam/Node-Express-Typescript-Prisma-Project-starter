import app from './app';
import { ENV } from './config/env';
import { prisma } from '@/infra/db/prisma';
import { logger } from '@/common/utils/logger';

const PORT = ENV.PORT;

const server = app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

server.headersTimeout = 65_000;
server.requestTimeout = 60_000;

async function shutdown(reason: string, code = 0) {
  try {
    logger.info(`Shutting down: ${reason}`);
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await prisma.$disconnect();
  } catch (e) {
    logger.error('Error during shutdown', { error: (e as Error).message });
    code = code || 1;
  } finally {
    process.exit(code);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (err) => {
  logger.error('UnhandledRejection', { error: String(err) });
  shutdown('unhandledRejection', 1);
});
process.on('uncaughtException', (err) => {
  logger.error('UncaughtException', { error: err.message, stack: err.stack });
  shutdown('uncaughtException', 1);
});
