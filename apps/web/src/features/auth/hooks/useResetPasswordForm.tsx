import { paths } from '@/config/paths';
import { useResetPassword } from '@/features/auth/api/resetPassword';
import { zodResolver } from '@hookform/resolvers/zod';
import { commonValidations } from '@repo/validation/common';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const resetPasswordFormSchema = z
  .object({
    password: commonValidations.password,
    confirm_password: z
      .string({
        required_error: 'Confirm password is required',
      })
      .min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export const useResetPasswordForm = (token: string) => {
  const router = useRouter();
  const {
    mutate: resetPassword,
    isPending,
    error,
    isSuccess,
  } = useResetPassword({
    onSuccess: () => {
      router.push(paths.auth.signIn.getHref());
    },
  });

  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: '',
      confirm_password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof resetPasswordFormSchema>) => {
    resetPassword({ password: values.password, token });
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
    error: error?.message,
    success: isSuccess ? 'Password has been reset successfully' : null,
  };
};
