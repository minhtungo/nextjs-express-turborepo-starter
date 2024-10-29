import { resetPasswordAction } from '@/features/auth/actions/auth';
import { resetPasswordSchema } from '@/features/auth/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const useResetPasswordForm = (token: string) => {
  const {
    isPending,
    execute,
    result: { serverError, data },
    hasSucceeded,
  } = useAction(resetPasswordAction);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirm_password: '',
      token,
    },
  });

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    execute(values);
    form.reset();
  };

  return {
    form,
    onSubmit,
    isPending,
    error: data?.error || serverError,
    success: data?.success,
    hasSucceeded,
  };
};
