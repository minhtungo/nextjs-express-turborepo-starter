'use client';

import LoaderButton from '@/components/LoaderButton';
import PasswordInput from '@/components/PasswordInput';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/form';
import { Input } from '@repo/ui/input';
import { authRoutes } from '@/config';
import AuthFormWrapper from '@/features/auth/components/AuthFormWrapper';
import FormResponse from '@/features/auth/components/FormResponse';
import GoogleSignInButton from '@/features/auth/components/GoogleSignInButton';

import { useSignInForm } from '@/features/auth/hooks/useSignInForm';

import Link from 'next/link';

const SignInForm = () => {
  const { form, onSubmit, isPending, error, urlError, isTwoFactorEnabled } = useSignInForm();

  return (
    <AuthFormWrapper title='Sign in' description='Sign in to your account' noBorderMobile>
      <GoogleSignInButton />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 mt-4'>
          {!isTwoFactorEnabled ? (
            <>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input autoComplete='email' type='email' placeholder='Email' autoFocus {...field} />
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
                      <PasswordInput autoComplete='current-password password' placeholder='Password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <>
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input type='number' placeholder='123456' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormResponse
                variant='success'
                description='Please enter the code sent to your email'
                title='Code sent'
              />
            </>
          )}

          {(error || urlError) && (
            <FormResponse variant='destructive' description={error || urlError || ''} title='Error' />
          )}

          <div className='pt-2'>
            <LoaderButton className='w-full' isPending={isPending}>
              Sign In
              {/* {data && data.twoFactor ? 'Confirm' : 'Sign In'} */}
            </LoaderButton>
          </div>
        </form>
      </Form>
      <div className='mt-6 text-center text-sm'>
        Don't have an account?{' '}
        <Link href={authRoutes.signUp} className='underline'>
          Sign Up
        </Link>
      </div>
      <div className='text-center'>
        <Link href={authRoutes.forgotPassword} className='inline-block text-sm text-muted-foreground hover:underline'>
          Forgot password?
        </Link>
      </div>
    </AuthFormWrapper>
  );
};

export default SignInForm;
