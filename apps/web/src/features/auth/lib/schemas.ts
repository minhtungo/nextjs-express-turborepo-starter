import { passwordRegex } from '@/lib/regex';
import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email({ message: 'Invalid email' }),
  password: z.string({ required_error: 'auth.error.password' }).min(1, 'auth.error.password'),
  code: z.optional(z.string()),
});

export type signInProps = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .min(1, 'Email is required')
      .email({ message: 'Invalid email' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .max(64, 'Max password length is 64 characters')
      .regex(
        passwordRegex,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirm_password: z
      .string({
        required_error: 'Confirm password is required',
      })
      .min(1, 'Confirm password is required'),
    name: z.string().min(1, 'Name is required'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export type signUpProps = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'auth.error.email')
    .email({ message: 'auth.error.invalidEmail' }),
});

export type forgotPasswordProps = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .max(64, 'Password must be at most 64 characters')
      .regex(
        passwordRegex,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirm_password: z
      .string({
        required_error: 'Confirm password is required',
      })
      .min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export type resetPasswordProps = z.infer<typeof resetPasswordSchema>;

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Code is required'),
});

export type verifyEmailProps = z.infer<typeof verifyEmailSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Token is required'),
});

export type refreshTokenProps = z.infer<typeof refreshTokenSchema>;
