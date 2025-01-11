import { paths } from '@/config/paths';
import { useSignIn } from '@/features/auth/api/signIn';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema } from '@repo/validation/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

export const useSignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const urlError = searchParams.get('error');

  const {
    mutate: signIn,
    isPending,
    error,
  } = useSignIn({
    onSuccess: () =>
      router.replace(`${redirectTo ? `${decodeURIComponent(redirectTo)}` : paths.app.dashboard.getHref()}`),
  });

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    signIn(values);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
    error: error?.message,
    urlError,
    isTwoFactorEnabled: false,
  };
};
