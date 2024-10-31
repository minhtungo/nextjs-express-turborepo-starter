'use client';

import PasswordInput from '@/components/PasswordInput';
import LoaderButton from '@/components/LoaderButton';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authRoutes } from '@/config';
import AuthFormWrapper from '@/features/auth/components/AuthFormWrapper';
import FormResponse from '@/features/auth/components/FormResponse';
import GoogleSignInButton from '@/features/auth/components/GoogleSignInButton';
import { useSignUpForm } from '@/features/auth/hooks/useSignUpForm';
import Link from 'next/link';

const SignUpForm = () => {
  const { form, onSubmit, isPending, error, success } = useSignUpForm();
  return (
    <AuthFormWrapper title='Sign Up' description='Sign up an account' noBorderMobile>
      <GoogleSignInButton />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder={'Name'} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput placeholder='Password' {...field} />
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
                  <PasswordInput placeholder='Confirm Password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <FormResponse variant='destructive' description={error} title='Error' />}
          {success && <FormResponse variant='success' description={success} title='Success' />}
          <div className='grid gap-3 pt-2'>
            <LoaderButton className='w-full' isPending={isPending}>
              Sign Up
            </LoaderButton>
          </div>
        </form>
      </Form>

      <div className='mt-6 text-center text-sm'>
        Already have an account?{' '}
        <Link href={authRoutes.signIn} className='underline'>
          Sign In
        </Link>
      </div>
    </AuthFormWrapper>
  );
};

export default SignUpForm;
