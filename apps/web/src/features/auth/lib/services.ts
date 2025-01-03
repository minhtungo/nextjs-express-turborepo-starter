import { apiRoutes } from '@/config';

import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@repo/validation/api';
import {
  forgotPasswordProps,
  resetPasswordProps,
  sendVerificationEmailProps,
  signInProps,
  signUpProps,
} from '@repo/validation/auth';

export const signUpService = async (values: signUpProps) => {
  console.log('signUpService', values);
  const response = await apiClient.post(apiRoutes.auth.signUp, {
    body: values,
  });

  return response;
};

export const signInService = async (values: signInProps): Promise<ApiResponse> => {
  const response = await apiClient.post(apiRoutes.auth.signIn, {
    body: values,
  });

  return response;
};

export const forgotPasswordService = async (values: forgotPasswordProps): Promise<ApiResponse> => {
  const response = await apiClient.post(apiRoutes.auth.forgotPassword, {
    body: values,
  });
  return response;
};

export const verifyEmailService = async (token: string): Promise<ApiResponse> => {
  const response = await apiClient.post(apiRoutes.auth.verifyEmail, {
    body: { token },
  });

  return response;
};

export const resetPasswordService = async (values: resetPasswordProps): Promise<ApiResponse> => {
  const response = await apiClient.post(apiRoutes.auth.resetPassword, {
    body: values,
  });

  return response;
};

export const sendVerificationEmailService = async ({ token }: sendVerificationEmailProps): Promise<ApiResponse> => {
  const response = await apiClient.post(apiRoutes.auth.signIn, {
    body: { token },
  });

  return response;
};

export const signOutService = async (): Promise<ApiResponse> => {
  const response = await apiClient.post(apiRoutes.auth.signOut);
  return response;
};
