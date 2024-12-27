import { forgotPasswordAction } from '@/features/auth/actions/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@repo/validation/auth';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

export const useForgotPasswordForm = () => {
  const {
    isPending,
    execute,
    result: { serverError, data },
    hasSucceeded,
  } = useAction(forgotPasswordAction);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
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
