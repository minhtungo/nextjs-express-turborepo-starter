import useSignUp from '@/features/auth/api/use-sign-up';
import { signUpSchema } from '@/features/auth/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const useSignUpForm = () => {
  const {
    isPending,
    execute,
    result: { serverError },
    hasSucceeded,
  } = useSignUp();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirm_password: '',
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    execute(values);
  };

  return {
    form,
    onSubmit,
    isPending,
    error: serverError,
    hasSucceeded,
  };
};
