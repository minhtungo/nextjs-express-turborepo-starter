import { useForgotPassword } from '@/features/auth/api/forgotPassword';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordProps, forgotPasswordSchema } from '@repo/validation/auth';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

export const useForgotPasswordForm = () => {
  const {
    mutate: forgotPassword,
    isPending,
    error,
    isSuccess,
  } = useForgotPassword({
    onSuccess: () => {
      form.reset();
    },
  });

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: forgotPasswordProps) => {
    forgotPassword(values);
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
    error: error?.message,
    success: isSuccess ? "If an account exists with that email, we've sent password reset instructions" : null,
  };
};
