'use server';

import { afterLoginUrl } from '@/config';
import { createSession, deleteSession } from '@/features/auth/actions/session';
import {
  forgotPasswordSchema,
  refreshTokenSchema,
  resetPasswordSchema,
  sendVerificationEmailSchema,
  signInSchema,
  signUpSchema,
  verifyEmailSchema,
} from '@/features/auth/lib/schemas';
import {
  forgotPasswordService,
  refreshTokenService,
  resetPasswordService,
  sendVerificationEmailService,
  signInService,
  signOutService,
  signUpService,
  verifyEmailService,
} from '@/features/auth/lib/services';
import { actionClient } from '@/lib/safe-actions';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export const signUpAction = actionClient.schema(signUpSchema).action(async ({ parsedInput }) => {
  const result = await signUpService(parsedInput);

  console.log('resulttest', result);

  if (!result.success) {
    return {
      error: result.message || 'An error occurred during sign in',
    };
  }

  return {
    success: 'Please check your email to verify your account',
  };
});

export const signInAction = actionClient
  .schema(
    z.object({
      values: signInSchema,
      redirectTo: z.string().nullable(),
    })
  )
  .action(async ({ parsedInput }) => {
    const result = await signInService(parsedInput.values);

    if (!result.success) {
      return {
        error: result.message || 'An error occurred during sign in',
      };
    }

    if (result.data.isTwoFactorEnabled) {
      return {
        isTwoFactorEnabled: true,
      };
    }

    await createSession({
      user: {
        id: result.data.user.id,
        email: result.data.user.email,
      },
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
    });

    redirect(afterLoginUrl);
  });

export const forgotPasswordAction = actionClient
  .schema(forgotPasswordSchema)
  .action(async ({ parsedInput: { email } }) => {
    const result = await forgotPasswordService(email);

    console.log('resulttest', result);

    if (!result.success) {
      return {
        error: result.message || 'An error occurred during forgot password',
      };
    }

    return {
      success: result.message || 'If a matching account is found, a password reset email will be sent',
    };
  });

export const verifyEmailAction = actionClient.schema(verifyEmailSchema).action(async ({ parsedInput: { token } }) => {
  const result = await verifyEmailService(token);

  return result;
});

export const resetPasswordAction = actionClient.schema(resetPasswordSchema).action(async ({ parsedInput }) => {
  const result = await resetPasswordService(parsedInput);

  if (!result.success) {
    return {
      error: result.message || 'An error occurred during reset password',
    };
  }

  return {
    success: result.message || 'Password reset successfully',
  };
});

export const refreshTokenAction = actionClient
  .schema(refreshTokenSchema)
  .action(async ({ parsedInput: { refreshToken } }) => {
    return refreshTokenService(refreshToken);
  });

export const sendVerificationEmailAction = actionClient
  .schema(sendVerificationEmailSchema)
  .action(async ({ parsedInput }) => {
    return sendVerificationEmailService(parsedInput);
  });

export const signOutAction = actionClient.action(async () => {
  await signOutService();
  await deleteSession();

  redirect('/');
});
