import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

export function requestId() {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = (req.headers['x-request-id'] as string) || randomUUID();
    res.setHeader('X-Request-Id', id);
    res.locals.requestId = id;
    next();
  };
}
