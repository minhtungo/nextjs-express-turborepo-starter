'use server';

import { forgotPasswordSchema, signInSchema, signUpSchema, verifyEmailSchema } from '@/features/auth/lib/schemas';
import { forgotPasswordService, signInService, signUpService, verifyEmailService } from '@/features/auth/lib/services';
import { actionClient } from '@/lib/safe-actions';

export const signUpAction = actionClient.schema(signUpSchema).action(async ({ parsedInput }) => {
  return signUpService(parsedInput);
});

export const signInAction = actionClient.schema(signInSchema).action(async ({ parsedInput }) => {
  return signInService(parsedInput);
});

export const forgotPasswordAction = actionClient
  .schema(forgotPasswordSchema)
  .action(async ({ parsedInput: { email } }) => {
    return forgotPasswordService(email);
  });

export const verifyEmailAction = actionClient.schema(verifyEmailSchema).action(async ({ parsedInput: { token } }) => {
  return verifyEmailService(token);
});
