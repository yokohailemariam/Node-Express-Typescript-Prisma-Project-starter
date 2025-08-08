import { Router } from 'express';
import * as ctrl from './controller';
import { validate } from '@/common/middlewares/validate';
import { createUserSchema, updateUserSchema, listUsersQuerySchema, idParamSchema } from './schema';
import { validateRequest } from '@/common/middlewares/validateRequest';
import { sensitiveLimiter } from '@/common/middlewares/rateLimit';

const router = Router();

router.get('/', validateRequest({ query: listUsersQuerySchema }), ctrl.list);
router.get('/:id', validateRequest({ params: idParamSchema }), ctrl.get);
router.post('/', sensitiveLimiter, validate(createUserSchema), ctrl.create);
router.patch(
  '/:id',
  sensitiveLimiter,
  validateRequest({ params: idParamSchema }),
  validate(updateUserSchema),
  ctrl.update,
);
router.delete('/:id', sensitiveLimiter, validateRequest({ params: idParamSchema }), ctrl.remove);

export default router;
