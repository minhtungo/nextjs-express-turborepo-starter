import { selectUserSchema } from '@repo/database/users';
import { z } from 'zod';

const SessionUser = selectUserSchema.pick({
  id: true,
  email: true,
  image: true,
  name: true,
});

export type SessionUser = z.infer<typeof SessionUser> | null;

export type Session = {
  user: SessionUser;
};

export const updateUserSchema = selectUserSchema.pick({
  email: true,
  image: true,
  name: true,
  password: true,
});

export type UpdateUser = z.infer<typeof updateUserSchema>;
