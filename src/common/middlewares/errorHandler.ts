import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';
import { logger } from '../utils/logger';
import { ENV } from '@/config/env';
import { Prisma } from '@/generated/prisma';

const titles: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  500: 'Internal Server Error',
};

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let status = err instanceof AppError ? err.statusCode : 500;
  let title = titles[status] ?? 'Error';
  let detail = err.message || 'Internal Server Error';

  // Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      status = 409;
      detail = 'Resource already exists (unique constraint)';
    }
  }

  logger.error(`[${req.method}] ${req.originalUrl} - ${detail}`, {
    stack: err.stack,
    traceId: res.locals.requestId,
  });

  const problem = {
    type: 'about:blank',
    title,
    status,
    detail,
    instance: req.originalUrl,
    traceId: res.locals.requestId,
    ...(ENV.NODE_ENV !== 'production' && { stack: err.stack }),
  };

  res.status(status).json(problem);
};
