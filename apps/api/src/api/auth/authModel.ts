import { commonValidations } from "@/common/utils/commonValidation";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const LoginInputSchema = z.object({
  email: commonValidations.email,
  password: commonValidations.password,
  code: z.string().optional(),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export const AuthServiceResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: AuthResponseSchema.nullable(),
});

export type AuthServiceResponse = z.infer<typeof AuthServiceResponseSchema>;

export const LoginResponseSchema = z.object({
  id: z.string(),
  email: commonValidations.email,
  accessToken: z.string(),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const SignUpInputSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  email: commonValidations.email,
  password: commonValidations.password,
});

export type SignUpInput = z.infer<typeof SignUpInputSchema>;

export const ResetPasswordSchema = z.object({
  token: z.string({
    required_error: "Token is required",
  }),
  password: z.string({
    required_error: "Password is required",
  }),
});

export const PostResetPasswordSchema = z.object({
  params: z.object({ token: z.string() }),
  body: z.object({ password: z.string() }),
});

export type ResetPassword = z.infer<typeof ResetPasswordSchema>;

export const ChangePasswordSchema = z.object({
  token: z.string({
    required_error: "Token is required",
  }),
  password: z.string({
    required_error: "Password is required",
  }),
});

export const PatchChangePasswordSchema = z.object({
  body: ChangePasswordSchema,
});

export type ChangePassword = z.infer<typeof ChangePasswordSchema>;

export const VerifyEmailSchema = z.object({
  token: z.string({
    required_error: "Token is required",
  }),
});

export type VerifyEmail = z.infer<typeof VerifyEmailSchema>;

export const LogoutSchema = z.object({
  token: z.string({
    required_error: "Token is required",
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
