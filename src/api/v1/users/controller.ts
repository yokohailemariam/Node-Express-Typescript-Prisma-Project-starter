import { Request, Response, NextFunction } from 'express';
import * as svc from './service';
import { ok, created } from '@/common/utils/response';
import { audit } from '@/common/utils/audit';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.set('Cache-Control', 'public, max-age=60, must-revalidate');

    const limit = Number(req.query.limit ?? 10);
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined;

    if (cursor) {
      const users = await svc.getUsersCursor(cursor, limit);

      const nextCursor = users.length ? users[users.length - 1].id : undefined;
      return ok(res, users, { cursor: { nextCursor, limit } });
    }

    const page = Number(req.query.page ?? 1);
    const [users, total] = await Promise.all([svc.getUsers(page, limit), svc.countUsers()]);

    const pageCount = Math.ceil(total / Math.max(1, Math.min(limit, 100)));
    return ok(res, users, { pagination: { total, page, limit, pageCount } });
  } catch (e) {
    next(e);
  }
};

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.set('Cache-Control', 'public, max-age=60, must-revalidate');
    const user = await svc.getUser(req.params.id);
    return ok(res, user);
  } catch (e) {
    next(e);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await svc.addUser(req.body);
    audit({
      action: 'user.create',
      resource: { type: 'user', id: (user as any).id },
      success: true,
      traceId: res.locals.requestId,
    });
    return created(res, user);
  } catch (e) {
    audit({
      action: 'user.create',
      success: false,
      traceId: res.locals.requestId,
      metadata: { error: (e as Error).message },
    });
    next(e);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await svc.editUser(req.params.id, req.body);
    audit({
      action: 'user.update',
      resource: { type: 'user', id: req.params.id },
      success: true,
      traceId: res.locals.requestId,
    });
    return ok(res, user);
  } catch (e) {
    audit({
      action: 'user.update',
      resource: { type: 'user', id: req.params.id },
      success: false,
      traceId: res.locals.requestId,
      metadata: { error: (e as Error).message },
    });
    next(e);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const okResult = await svc.removeUser(req.params.id);
    audit({
      action: 'user.delete',
      resource: { type: 'user', id: req.params.id },
      success: true,
      traceId: res.locals.requestId,
    });
    return ok(res, okResult);
  } catch (e) {
    audit({
      action: 'user.delete',
      resource: { type: 'user', id: req.params.id },
      success: false,
      traceId: res.locals.requestId,
      metadata: { error: (e as Error).message },
    });
    next(e);
  }
};
