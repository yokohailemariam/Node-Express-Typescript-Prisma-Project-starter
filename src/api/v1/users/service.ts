import { AppError } from '@/common/middlewares/AppError';
import * as repo from './repository';
import type { CreateUserDto, UpdateUserDto } from './schema';
import { User } from './types';

export const getUsers = (page?: number, limit?: number) => repo.listUsers(page, limit);

export const countUsers = () => repo.countUsers();

export const getUser = async (id: string): Promise<User> => {
  const user = await repo.getUserById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

export const addUser = async (data: CreateUserDto): Promise<User> => {
  const existing = await repo.getUserByEmail(data.email);
  if (existing) {
    throw new AppError('User with this email already exists', 409);
  }
  return await repo.createUser(data);
};

export const editUser = async (id: string, data: UpdateUserDto): Promise<User | null> => {
  const existing = await repo.getUserById(id);
  if (!existing) {
    throw new AppError('User not found', 404);
  }
  return await repo.updateUser(id, data);
};

export const removeUser = async (id: string): Promise<boolean> => {
  const existing = await repo.getUserById(id);
  if (!existing) {
    throw new AppError('User not found', 404);
  }

  return await repo.deleteUser(id);
};

export const getUsersCursor = (cursor?: string, limit?: number) =>
  repo.listUsersCursor(cursor, limit);
