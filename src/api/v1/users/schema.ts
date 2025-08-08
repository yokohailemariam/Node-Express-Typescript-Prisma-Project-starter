import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().uuid(),
});

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
});

export const updateUserSchema = z
  .object({
    name: z.string().min(1).optional(),
    email: z.email('Invalid email').optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  cursor: z.string().uuid().optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
