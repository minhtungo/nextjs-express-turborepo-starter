import { signInAction } from '@/features/auth/actions/auth';

import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '@repo/validation/auth';
import { useAction } from 'next-safe-action/hooks';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

export const useSignInForm = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const urlError = searchParams.get('error');

  const {
    isPending,
    execute,
    result: { serverError, data },
    hasSucceeded,
  } = useAction(signInAction);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      code: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    execute({ values, redirectTo });
  };

  return {
    form,
    onSubmit,
    isPending,
    error: data?.error || serverError,
    urlError,
    hasSucceeded,
    isTwoFactorEnabled: false,
  };
};
