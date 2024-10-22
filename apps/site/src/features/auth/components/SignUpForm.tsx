'use client';

import Link from 'next/link';

import PasswordInput from '@/components/PasswordInput';
import SubmitButton from '@/components/SubmitButton';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authRoutes } from '@/config';
import useSignUp from '@/features/auth/api/use-sign-up';
import AuthFormWrapper from '@/features/auth/components/AuthFormWrapper';
import OAuthButtons from '@/features/auth/components/OAuthButtons';
import { signUpSchema } from '@/features/auth/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const SignUpForm = () => {
  const {
    isPending,
    execute,
    result: { data, serverError },
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

  return (
    <AuthFormWrapper title='Sign Up' description='Sign up an account' noBorderMobile>
      <Suspense>
        <OAuthButtons />
      </Suspense>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
          {/* @ts-ignore*/}
          {error && <FormError message={t(error.message)} />}
          {/* @ts-ignore*/}
          {data && data.message && <FormSuccess message={t(data.message)} />}
          <div className='grid gap-3 pt-2'>
            <SubmitButton className='w-full' isPending={isPending}>
              Sign Up
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
    </AuthFormWrapper>
  );
};

export default SignUpForm;
