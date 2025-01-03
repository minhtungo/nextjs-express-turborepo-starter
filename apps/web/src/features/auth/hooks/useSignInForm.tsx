import { afterLoginUrl } from '@/config';
import { useSignInMutation } from '@/features/auth/api/mutations';
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

  const { mutate: signIn, isPending, error } = useSignInMutation();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    signIn(values, {
      onSuccess: () => {
        router.push(redirectTo ?? afterLoginUrl);
      },
    });
  };

  return {
    form,
    onSubmit,
    isPending,
    error: error?.message,
    urlError,
    isTwoFactorEnabled: false,
  };
};
