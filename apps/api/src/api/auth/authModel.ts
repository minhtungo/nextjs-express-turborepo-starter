import { commonValidations } from '@/common/utils/commonValidation';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const SignUpSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
  }),
  email: commonValidations.email,
  password: commonValidations.password,
});

export const PostSignUpSchema = z.object({
  body: SignUpSchema,
});

export type SignUp = z.infer<typeof SignUpSchema>;

export const LoginSchema = z.object({
  email: commonValidations.email,
  password: commonValidations.password,
  code: z.string().optional(),
});

export type SignIn = z.infer<typeof LoginSchema>;

export const PostLoginSchema = z.object({
  body: LoginSchema,
});

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const ResetPasswordSchema = z.object({
  token: z.string({
    required_error: 'Token is required',
  }),
  password: z.string({
    required_error: 'Password is required',
  }),
});

export const PostResetPasswordSchema = z.object({
  params: z.object({ token: z.string() }),
  body: z.object({ password: z.string() }),
});

export type ResetPassword = z.infer<typeof ResetPasswordSchema>;

export const ChangePasswordSchema = z.object({
  token: z.string({
    required_error: 'Token is required',
  }),
  password: z.string({
    required_error: 'Password is required',
  }),
});

export const PatchChangePasswordSchema = z.object({
  body: ChangePasswordSchema,
});

export type ChangePassword = z.infer<typeof ChangePasswordSchema>;

export const VerifyEmailSchema = z.object({
  token: z.string({
    required_error: 'Token is required',
  }),
});

export type VerifyEmail = z.infer<typeof VerifyEmailSchema>;

export const LogoutSchema = z.object({
  token: z.string({
    required_error: 'Token is required',
  }),
});

export type Logout = z.infer<typeof LogoutSchema>;

export const ForgotPasswordSchema = z.object({
  email: commonValidations.email,
});

export const PostForgotPasswordSchema = z.object({
  body: ForgotPasswordSchema,
});

export const PostVerifyEmailSchema = z.object({
  params: VerifyEmailSchema,
});

export const TokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().nullable(),
});

export const PostRefreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

export type Tokens = z.infer<typeof TokensSchema>;
