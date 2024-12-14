import { useUser } from '@/components/providers/AuthProvider';
import { updateUserAction } from '@/features/user/actions/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserSchema } from '@repo/types/user';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const useUpdateUserForm = () => {
  const { user } = useUser();

  const {
    isPending,
    execute,
    result: { serverError, data },
    hasSucceeded,
  } = useAction(updateUserAction);

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || '',
      image: user?.image || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
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
