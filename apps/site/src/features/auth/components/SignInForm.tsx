'use client';

import PasswordInput from '@/components/PasswordInput';
import SubmitButton from '@/components/SubmitButton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authRoutes } from '@/config';
import AuthFormWrapper from '@/features/auth/components/AuthFormWrapper';

import OAuthButtons from '@/features/auth/components/OAuthButtons';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const SignInForm = () => {
  const searchParams = useSearchParams();
  const redirectURL = searchParams.get('redirect');

  const urlError = searchParams.get('error') === 'OAuthAccountNotLinked' ? 'error.OAuthAccountNotLinked' : '';

  //   const { isPending, execute, data, error } = useServerAction(signInWithCredentialsAction);

  //   const form = useForm<z.infer<typeof signInSchema>>({
  //     resolver: zodResolver(signInSchema),
  //     defaultValues: {
  //       email: '',
  //       password: '',
  //     },
  //   });

  //   const onSubmit = async (values: z.infer<typeof signInSchema>) => {
  //     await execute({ values, redirectURL });
  //   };

  return (
    <AuthFormWrapper title='Sign in' description='Sign in to your account' noBorderMobile>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {!data ? (
            <>
              <Suspense>
                <OAuthButtons />
              </Suspense>
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
              <FormSuccess message='Success' />
            </>
          )}
          {(error || urlError) && <FormError message={error?.message} />}
          {/* {successMessage && <FormSuccess message={successMessage} />} */}
          <div className='pt-2'>
            <SubmitButton className='w-full' isPending={isPending}>
              {data && data.twoFactor ? 'Confirm' : 'Sign In'}
            </SubmitButton>
          </div>
        </form>
      </Form>
      <div className='mt-6 text-center text-sm'>
        Already have an account?{' '}
        <Link href={authRoutes.signIn} className='underline'>
          Sign In
        </Link>
      </div>
      <div className='mt-2 text-center'>
        <Link href={authRoutes.forgotPassword} className='inline-block text-xs text-muted-foreground hover:underline'>
          Forgot password?
        </Link>
      </div>
    </AuthFormWrapper>
  );
};

export default SignInForm;
