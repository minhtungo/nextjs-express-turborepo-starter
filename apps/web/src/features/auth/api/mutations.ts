import {
  forgotPasswordService,
  resetPasswordService,
  sendVerificationEmailService,
  signInService,
  signOutService,
  signUpService,
  verifyEmailService,
} from '@/features/auth/lib/services';
import { useMutation } from '@tanstack/react-query';

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: signUpService,
  });
};

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: signInService,
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: forgotPasswordService,
  });
};

export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: verifyEmailService,
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: resetPasswordService,
  });
};

export const useSendVerificationEmailMutation = () => {
  return useMutation({
    mutationFn: sendVerificationEmailService,
  });
};

export const useSignOutMutation = () => {
  return useMutation({
    mutationFn: signOutService,
  });
};
