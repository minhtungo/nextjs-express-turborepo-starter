'use client';

import { useUser } from '@/components/providers/AuthProvider';
import { changeUserPasswordAction } from '@/features/user/actions/user';
import { changeUserPasswordFormSchema } from '@/features/user/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@repo/ui/hooks/use-toast';

export const useChangeUserPassword = () => {
  const { user } = useUser();
  const { toast } = useToast();

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
    if (hasSucceeded) {
      form.reset();
      toast({
        title: 'Password changed',
        description: 'Your password has been successfully changed.',
      });
    } else {
      toast({
        title: 'Failed to change password',
        description: 'Please check your current password and try again.',
      });
    }
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
