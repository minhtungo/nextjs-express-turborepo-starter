import { useForgotPasswordMutation } from '@/features/auth/api/mutations';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordProps, forgotPasswordSchema } from '@repo/validation/auth';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

export const useForgotPasswordForm = () => {
  const { mutate: forgotPassword, isPending, error, isSuccess } = useForgotPasswordMutation();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: forgotPasswordProps) => {
    forgotPassword(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return {
    form,
    onSubmit,
    isPending,
    error: error?.message,
    success: isSuccess ? "If an account exists with that email, we've sent password reset instructions" : null,
  };
};
