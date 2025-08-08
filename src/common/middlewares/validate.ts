import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';

export const validate =
  (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
        code: i.code,
      }));
      return res.status(400).json({
        type: 'https://datatracker.ietf.org/doc/html/rfc7807',
        title: 'Bad Request',
        status: 400,
        detail: 'Validation failed',
        instance: req.originalUrl,
        traceId: res.locals.requestId,
        errors: issues,
      });
    }
    req.body = parsed.data as any;
    next();
  };
