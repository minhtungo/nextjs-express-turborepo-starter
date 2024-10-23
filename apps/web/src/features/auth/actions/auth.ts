'use server';

import { createSession } from '@/features/auth/actions/session';
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
  signUpService,
  verifyEmailService,
} from '@/features/auth/lib/services';
import { actionClient } from '@/lib/safe-actions';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export const signUpAction = actionClient.schema(signUpSchema).action(async ({ parsedInput }) => {
  const result = await signUpService(parsedInput);

  if (!result.success) {
    throw new Error(result.message);
  }

  await createSession({
    user: {
      id: result.data.user.id,
      email: result.data.user.email,
    },
    accessToken: result.data.accessToken,
    refreshToken: result.data.refreshToken,
  });

  redirect('/');
});

export const signInAction = actionClient
  .schema(
    z.object({
      values: signInSchema,
      redirectTo: z.string().nullable(),
    })
  )
  .action(async ({ parsedInput }) => {
    const result = await signInService(parsedInput);

    if (!result.success) {
      throw new Error(result.message);
    }

    await createSession({
      user: {
        id: result.data.user.id,
        email: result.data.user.email,
      },
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
    });

    redirect('/');
  });

export const forgotPasswordAction = actionClient
  .schema(forgotPasswordSchema)
  .action(async ({ parsedInput: { email } }) => {
    return forgotPasswordService({ email });
  });

export const verifyEmailAction = actionClient.schema(verifyEmailSchema).action(async ({ parsedInput: { token } }) => {
  return verifyEmailService({ token });
});

export const resetPasswordAction = actionClient.schema(resetPasswordSchema).action(async ({ parsedInput }) => {
  return resetPasswordService(parsedInput);
});

export const refreshTokenAction = actionClient
  .schema(refreshTokenSchema)
  .action(async ({ parsedInput: { refreshToken } }) => {
    return refreshTokenService({ refreshToken });
  });

export const sendVerificationEmailAction = actionClient
  .schema(sendVerificationEmailSchema)
  .action(async ({ parsedInput }) => {
    return sendVerificationEmailService(parsedInput);
  });
