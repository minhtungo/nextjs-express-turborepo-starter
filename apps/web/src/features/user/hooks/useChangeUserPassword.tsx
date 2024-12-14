'use client';

import { useUser } from '@/components/providers/AuthProvider';
import { changeUserPasswordAction } from '@/features/user/actions/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { changeUserPasswordFormSchema } from '@repo/types/user';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const useChangeUserPassword = () => {
  const { user } = useUser();

  const {
    isPending,
    execute,
    result: { serverError, data },
    hasSucceeded,
  } = useAction(changeUserPasswordAction);

  const form = useForm<z.infer<typeof changeUserPasswordFormSchema>>({
    resolver: zodResolver(changeUserPasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof changeUserPasswordFormSchema>) => {
    execute(values);
  };

  return {
    form,
    onSubmit,
    isPending,
    error: data?.error || serverError,
    success: data?.success,
    hasSucceeded,
    user,
  };
};
