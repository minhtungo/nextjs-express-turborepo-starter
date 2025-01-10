'use client';

import { useUser } from '@/components/providers/AuthProvider';
import { useChangePassword } from '@/features/user/api/changePassword';

import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@repo/ui/hooks/use-toast';
import { changeUserPasswordFormSchema } from '@repo/validation/user';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

export const useChangeUserPasswordForm = () => {
  const { user } = useUser();
  const { mutate: changeUserPassword, isPending, error, isSuccess } = useChangePassword();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof changeUserPasswordFormSchema>>({
    resolver: zodResolver(changeUserPasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof changeUserPasswordFormSchema>) => {
    changeUserPassword(values, {
      onSuccess: () => {
        form.reset();
        toast({
          title: 'Password changed',
          description: 'Your password has been successfully changed.',
        });
      },
      onError: () => {
        toast({
          title: 'Failed to change password',
          description: 'Please check your current password and try again.',
        });
      },
    });
  };

  return {
    form,
    onSubmit,
    isPending,
    error: error?.message,
    success: isSuccess ? 'Your password has been successfully changed.' : null,
    user,
  };
};
