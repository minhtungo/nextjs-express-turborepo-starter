import { apiRoutes } from '@/lib/config';

import { api } from '@/lib/api';
import type { ApiResponse } from '@repo/validation/api';
import {
  forgotPasswordProps,
  resetPasswordProps,
  sendVerificationEmailProps,
  signInProps,
  signUpProps,
} from '@repo/validation/auth';
import { SessionUser } from '@repo/validation/user';

export const getCurrentUserService = async (): Promise<ApiResponse<SessionUser | null>> => {
  const response = await api.get<SessionUser | null>(apiRoutes.user.getCurrentUser);
  return response;
};

export const signUpService = async (values: signUpProps) => {
  const response = await api.post(apiRoutes.auth.signUp, values);

  return response;
};

export const signInService = async (values: signInProps): Promise<ApiResponse> => {
  const response = await api.post(apiRoutes.auth.signIn, values);

  return response;
};

export const forgotPasswordService = async (values: forgotPasswordProps): Promise<ApiResponse> => {
  const response = await api.post(apiRoutes.auth.forgotPassword, values);
  return response;
};

export const verifyEmailService = async (token: string): Promise<ApiResponse> => {
  const response = await api.post(apiRoutes.auth.verifyEmail, { token });

  return response;
};

export const resetPasswordService = async (values: resetPasswordProps): Promise<ApiResponse> => {
  const response = await api.post(apiRoutes.auth.resetPassword, values);

  return response;
};

export const sendVerificationEmailService = async (token: sendVerificationEmailProps): Promise<ApiResponse> => {
  const response = await api.post(apiRoutes.auth.sendVerificationEmail, token);

  return response;
};

export const signOutService = async (): Promise<ApiResponse> => {
  const response = await api.post(apiRoutes.auth.signOut);

  return response;
};
