import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

type Schemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

export const validateRequest =
  (schemas: Schemas) => (req: Request, res: Response, next: NextFunction) => {
    const issues: { path: string; message: string; in: 'body' | 'query' | 'params' }[] = [];

    const parse = (part: 'body' | 'query' | 'params', schema?: ZodTypeAny) => {
      if (!schema) return;
      const parsed = schema.safeParse((req as any)[part]);
      if (!parsed.success) {
        parsed.error.issues.forEach((i) =>
          issues.push({ path: i.path.join('.'), message: i.message, in: part }),
        );
      } else {
        (req as any)[part] = parsed.data;
      }
    };

    parse('params', schemas.params);
    parse('query', schemas.query);
    parse('body', schemas.body);

    if (issues.length) {
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

    next();
  };
