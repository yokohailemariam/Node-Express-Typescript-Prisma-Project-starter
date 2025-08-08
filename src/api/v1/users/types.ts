import { Request } from 'express';
import { CreateUserDto, UpdateUserDto } from './schema';

export interface CreateUserRequest extends Request {
  body: CreateUserDto;
}

export interface UpdateUserRequest extends Request {
  body: UpdateUserDto;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
