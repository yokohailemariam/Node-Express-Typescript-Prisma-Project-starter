import { Response } from 'express';

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
};

export type Meta = {
  pagination?: PaginationMeta;
  [k: string]: unknown;
};

function withTrace(res: Response, body: Record<string, unknown>) {
  return { traceId: res.locals.requestId, ...body };
}

export function ok<T>(res: Response, data: T, meta?: Meta) {
  return res.json(withTrace(res, { data, ...(meta ? { meta } : {}) }));
}

export function created<T>(res: Response, data: T, meta?: Meta) {
  return res.status(201).json(withTrace(res, { data, ...(meta ? { meta } : {}) }));
}
