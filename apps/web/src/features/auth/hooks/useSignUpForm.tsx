import { useSignUp } from '@/features/auth/api/signUp';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '@repo/validation/auth';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

export const useSignUpForm = () => {
  const {
    mutate: signUp,
    isPending,
    error,
    isSuccess,
    data,
  } = useSignUp({
    onSuccess: () => {
      form.reset();
    },
  });

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
    signUp(values);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
    error: error?.message,
    success: isSuccess ? 'Please check your email to verify your account.' : null,
  };
};
