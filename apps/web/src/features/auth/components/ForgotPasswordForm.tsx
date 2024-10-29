'use client';

import LoaderButton from '@/components/LoaderButton';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authRoutes } from '@/config';
import AuthFormWrapper from '@/features/auth/components/AuthFormWrapper';
import FormResponse from '@/features/auth/components/FormResponse';

import { useForgotPasswordForm } from '@/features/auth/hooks/useForgotPassword';

const ForgotPasswordForm = () => {
  const { form, onSubmit, isPending, error, success } = useForgotPasswordForm();

  return (
    <AuthFormWrapper
      title='Forgot Password'
      description="Enter your email address and we'll send you a link to reset your password."
      backButtonHref={authRoutes.signIn}
      backButtonLabel='Back to Sign In'
      noBorderMobile
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type='email' placeholder='Email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <FormResponse variant='error' message={error} />}
          {success && <FormResponse message={success} />}
          <LoaderButton className='w-full' isPending={isPending}>
            Reset Password
          </LoaderButton>
        </form>
      </Form>
    </AuthFormWrapper>
  );
};

export default ForgotPasswordForm;
