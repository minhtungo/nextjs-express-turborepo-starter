import { commonValidations } from '@/lib/validation';
import { z } from 'zod';

export const changeUserPasswordSchema = z.object({
  currentPassword: z
    .string({
      required_error: 'Password is required',
    })
    .min(1),
  newPassword: commonValidations.password,
});

export const updateUserSchema = z.object({
  image: z.string().optional(),
  name: z.string(),
});

export const changeUserPasswordFormSchema = z.object({
  currentPassword: z
    .string({
      required_error: 'Password is required',
    })
    .min(1),
  newPassword: commonValidations.password,
  confirmNewPassword: z.string().min(1),
});
