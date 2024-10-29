import { apiRoutes } from '@/config';
import { env } from '@/config/env';
import {
  refreshTokenProps,
  resetPasswordProps,
  sendVerificationEmailProps,
  signInProps,
  signUpProps,
  verifyEmailProps,
} from '@/features/auth/lib/schemas';
import { api, type ApiResponse } from '@/lib/api';
import {
  ForgotPasswordDTO,
  RefreshTokenDTO,
  ResetPasswordDTO,
  SendVerificationEmailDTO,
  SignInDTO,
  SignUpDTO,
  VerifyEmailDTO,
} from '@/types/dto/auth';

export const signUpService = async (values: signUpProps): Promise<SignUpDTO> => {
  const response = await api.post<SignUpDTO>(
    apiRoutes.signUp,
    {
      body: values,
    },
    true
  );

  return response;
};

export const signInService = async (values: signInProps): Promise<SignInDTO> => {
  const response = await api.post<SignInDTO>(
    apiRoutes.signIn,
    {
      body: values,
    },
    true
  );

  return response;
};

export const forgotPasswordService = async (email: string): Promise<ForgotPasswordDTO> => {
  const response = await api.post<ForgotPasswordDTO>(
    apiRoutes.forgotPassword,
    {
      body: { email },
    },
    true
  );
  return response;
};

export const verifyEmailService = async (token: string): Promise<VerifyEmailDTO> => {
  const response = await api.post<VerifyEmailDTO>(
    apiRoutes.verifyEmail,
    {
      body: { token },
    },
    true
  );

  return response;
};

export const resetPasswordService = async (values: resetPasswordProps): Promise<ResetPasswordDTO> => {
  const response = await api.post<ResetPasswordDTO>(
    apiRoutes.resetPassword,
    {
      body: values,
    },
    true
  );

  return response;
};

export const refreshTokenService = async (refreshToken: string): Promise<string> => {
  const result = await api.post<RefreshTokenDTO>(
    apiRoutes.refreshToken,
    {
      body: { refreshToken },
    },
    true
  );

  const updateResponse = await fetch(`${env.NEXT_PUBLIC_BASE_URL}/api/auth/update`, {
    method: 'POST',
    body: JSON.stringify({ accessToken: result.data.accessToken, refreshToken: result.data.refreshToken }),
  });

  if (!updateResponse.ok) throw new Error('Failed to update the tokens');

  return result.data.accessToken;
};

export const sendVerificationEmailService = async ({
  token,
}: sendVerificationEmailProps): Promise<SendVerificationEmailDTO> => {
  const response = await api.post<SendVerificationEmailDTO>(
    apiRoutes.signIn,
    {
      body: { token },
    },
    true
  );

  return response;
};
