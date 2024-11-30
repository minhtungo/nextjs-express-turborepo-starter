'use client';

import LoaderButton from '@/components/LoaderButton';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@repo/ui/form';
import { Input } from '@repo/ui/input';
import { authRoutes } from '@/config';
import AuthFormWrapper from '@/features/auth/components/AuthFormWrapper';
import FormResponse from '@/features/auth/components/FormResponse';

import { useResetPasswordForm } from '@/features/auth/hooks/useResetPasswordForm';

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const { form, onSubmit, isPending, error, success } = useResetPasswordForm(token);

  return (
    <AuthFormWrapper
      title='Reset Password'
      description='To help keep your account secure, we require a password you haven’t used before.'
      noBorderMobile
      backButtonHref={authRoutes.signIn}
      backButtonLabel='Back to Sign In'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type='password' placeholder='Password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirm_password'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type='password' placeholder='Confirm Password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <FormResponse variant='destructive' description={error} title='Error' />}
          {success && <FormResponse description={success} title='Success' variant='success' />}
          <LoaderButton className='w-full' isPending={isPending}>
            Reset Password
          </LoaderButton>
        </form>
      </Form>
    </AuthFormWrapper>
  );
};

export default ResetPasswordForm;
