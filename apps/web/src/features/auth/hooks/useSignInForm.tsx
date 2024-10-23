import useSignIn from '@/features/auth/api/use-sign-in';

import { signInSchema } from '@/features/auth/lib/schemas';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const useSignInForm = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const urlError = searchParams.get('error') === 'OAuthAccountNotLinked' ? 'OAuthAccountNotLinked' : '';

  const {
    isPending,
    execute,
    result: { serverError },
    hasSucceeded,
  } = useSignIn();

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
    error: serverError,
    urlError,
    hasSucceeded,
  };
};
