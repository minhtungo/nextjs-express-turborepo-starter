import { apiRoutes } from '@/config';
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

export const signUpService = async (values: signUpProps): Promise<ApiResponse<SignUpDTO>> => {
  const response = await api.post<SignUpDTO>(
    apiRoutes.signUp,
    {
      body: values,
    },
    true
  );

  return response;
};

export const signInService = async (values: signInProps): Promise<ApiResponse<SignInDTO>> => {
  const response = await api.post<SignInDTO>(
    apiRoutes.signIn,
    {
      body: values,
    },
    true
  );

  return response;
};

export const forgotPasswordService = async (email: string): Promise<ApiResponse<ForgotPasswordDTO>> => {
  const response = await api.post<ForgotPasswordDTO>(
    apiRoutes.forgotPassword,
    {
      body: { email },
    },
    true
  );
  return response;
};

export const verifyEmailService = async ({ token }: verifyEmailProps): Promise<ApiResponse<VerifyEmailDTO>> => {
  const response = await api.post<VerifyEmailDTO>(
    apiRoutes.verifyEmail,
    {
      body: { token },
    },
    true
  );

  return response;
};

export const resetPasswordService = async (values: resetPasswordProps): Promise<ApiResponse<ResetPasswordDTO>> => {
  const response = await api.post<ResetPasswordDTO>(
    apiRoutes.resetPassword,
    {
      body: values,
    },
    true
  );

  return response;
};

export const refreshTokenService = async ({
  refreshToken,
}: refreshTokenProps): Promise<ApiResponse<RefreshTokenDTO>> => {
  const response = await api.post<RefreshTokenDTO>(
    apiRoutes.signIn,
    {
      body: { refreshToken },
    },
    true
  );

  return response;
};

export const sendVerificationEmailService = async ({
  token,
}: sendVerificationEmailProps): Promise<ApiResponse<SendVerificationEmailDTO>> => {
  const response = await api.post<SendVerificationEmailDTO>(
    apiRoutes.signIn,
    {
      body: { token },
    },
    true
  );

  return response;
};
