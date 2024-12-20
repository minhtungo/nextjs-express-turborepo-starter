'use server';

import { changeUserPasswordService, updateUserService } from '@/features/user/lib/services';
import { changeUserPasswordFormSchema, updateUserSchema } from '@/features/user/lib/validations';
import { actionClient } from '@/lib/safe-actions';

export const updateUserAction = actionClient.schema(updateUserSchema).action(async ({ parsedInput }) => {
  const result = await updateUserService(parsedInput);

  if (!result.success) {
    return {
      error: result.message || 'An error occurred during reset password',
    };
  }

  return {
    success: result.message || 'Update user successfully',
  };
});

export const changeUserPasswordAction = actionClient
  .schema(changeUserPasswordFormSchema)
  .action(async ({ parsedInput }) => {
    const result = await changeUserPasswordService(parsedInput);

    if (!result.success) {
      return {
        error: result.message || 'An error occurred during reset password',
      };
    }

    return {
      success: result.message || 'Update user successfully',
    };
  });
