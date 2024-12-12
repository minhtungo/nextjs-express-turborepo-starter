import { selectUserSchema } from '@repo/database/users';
import { z } from 'zod';

export const updateUserSchema = selectUserSchema.pick({
  email: true,
  image: true,
  name: true,
  password: true,
  plan: true,
});

export type UpdateUser = z.infer<typeof updateUserSchema>;
