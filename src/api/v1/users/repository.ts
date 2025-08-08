import type { CreateUserDto, UpdateUserDto } from './schema';
import { User } from './types';
import { prisma } from '@/infra/db/prisma';

export async function listUsers(page = 1, limit = 20): Promise<User[]> {
  const take = Math.max(1, Math.min(limit, 100));
  const skip = (Math.max(1, page) - 1) * take;
  return prisma.user.findMany({ skip, take, orderBy: { createdAt: 'desc' } });
}

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(input: CreateUserDto): Promise<User> {
  return prisma.user.create({ data: input });
}

export async function updateUser(id: string, input: UpdateUserDto): Promise<User | null> {
  return prisma.user.update({ where: { id }, data: input });
}

export async function deleteUser(id: string): Promise<boolean> {
  await prisma.user.delete({ where: { id } });
  return true;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export async function countUsers(): Promise<number> {
  return prisma.user.count();
}

export async function listUsersCursor(cursor?: string, limit = 10): Promise<User[]> {
  const take = Math.max(1, Math.min(limit, 100));
  if (cursor) {
    return prisma.user.findMany({
      take,
      skip: 1,
      cursor: { id: cursor },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });
  }
  return prisma.user.findMany({
    take,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
  });
}
