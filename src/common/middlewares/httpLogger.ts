import morgan from 'morgan';
import type { Request, Response } from 'express';
import { logger } from '@/common/utils/logger';

morgan.token('id', (_req: Request, res: Response) => res.locals.requestId);

export function httpLogger() {
  const format =
    ':method :url :status :res[content-length] - :response-time ms trace=:id agent=":user-agent"';
  return morgan(format, {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  });
}
