import { commonValidations } from '@/lib/validation';
import { z } from 'zod';

export const signInSchema = z.object({
  email: commonValidations.email,
  password: z.string().min(1, 'Password is required'),
  code: z.optional(z.string()),
});

export type signInProps = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    email: commonValidations.email,
    password: commonValidations.password,
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
  email: commonValidations.email,
});

export type forgotPasswordProps = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: commonValidations.password,
    confirm_password: z
      .string({
        required_error: 'Confirm password is required',
      })
      .min(1, 'Confirm password is required'),
    token: z.string().min(1, 'Token is required'),
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

export const sendVerificationEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export type sendVerificationEmailProps = z.infer<typeof sendVerificationEmailSchema>;
