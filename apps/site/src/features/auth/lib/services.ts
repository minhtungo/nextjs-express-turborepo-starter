import { apiRoutes } from '@/config';
import { forgotPasswordProps, signInProps, signUpProps, verifyEmailProps } from '@/features/auth/lib/schemas';
import { api } from '@/lib/api';

export const signUpService = async (values: signUpProps) => {
  const response = await api.post(apiRoutes.signUp, {
    body: JSON.stringify(values),
  });

  return response;
};

export const signInService = async (values: signInProps) => {
  const response = await api.post(apiRoutes.signIn, {
    body: JSON.stringify(values),
  });

  return response;
};

export const forgotPasswordService = async ({ email }: forgotPasswordProps) => {
  const response = await api.post(apiRoutes.forgotPassword, {
    body: JSON.stringify({ email }),
  });

  return response;
};

export const verifyEmailService = async ({ token }: verifyEmailProps) => {
  const response = await api.post(apiRoutes.verifyEmail, {
    body: JSON.stringify({ token }),
  });

  return response;
};
