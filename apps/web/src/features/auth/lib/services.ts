import { apiRoutes } from '@/config';
import {
  forgotPasswordProps,
  refreshTokenProps,
  signInProps,
  signUpProps,
  verifyEmailProps,
} from '@/features/auth/lib/schemas';
import { api, type ApiResponse } from '@/lib/api';
import { ForgotPasswordDTO, SignInDTO, SignUpDTO, VerifyEmailDTO } from '@/types/dto/auth';

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

export const forgotPasswordService = async ({
  email,
}: forgotPasswordProps): Promise<ApiResponse<ForgotPasswordDTO>> => {
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

export const refreshTokenService = async ({ refreshToken }: refreshTokenProps): Promise<ApiResponse<SignInDTO>> => {
  const response = await api.post<SignInDTO>(
    apiRoutes.signIn,
    {
      body: { refreshToken },
    },
    true
  );

  return response;
};
