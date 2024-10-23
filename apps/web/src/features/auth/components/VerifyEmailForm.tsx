'use client';
import Spinner from '@/components/Spinner';
import { authRoutes } from '@/config';
import { verifyEmailAction } from '@/features/auth/actions/auth';
import AuthFormWrapper from '@/features/auth/components/AuthFormWrapper';
import BackButton from '@/features/auth/components/BackButton';
import FormResponse from '@/features/auth/components/FormResponse';
import ResendVerificationEmail from '@/features/auth/components/ResendVerificationEmail';
import { useAction } from 'next-safe-action/hooks';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';

const VerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const {
    execute,
    isPending,
    result: { serverError: error },
    hasSucceeded,
  } = useAction(verifyEmailAction);

  const onSubmit = useCallback(async () => {
    if (!token) {
      return;
    }

    execute({ token });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <AuthFormWrapper title='Verify your email' noBorderMobile>
      {isPending && (
        <div className='mb-3 text-center'>
          <p className='mb-2 text-muted-foreground'>We are verifying your email.</p>
          <Spinner />
        </div>
      )}
      {error && <FormResponse variant='error' message={error} />}
      {!token && <FormResponse variant='error' message='No token found' />}
      {error && error === 'Expired Token' && <ResendVerificationEmail className='mt-4' token={token!} />}
      {hasSucceeded && (
        <>
          <p className='text-muted-foreground-2 mt-2'>
            Your email has been successfully verified. You can now sign in to your account.
          </p>
          <FormResponse message='An email has been sent to your email address. Please check your inbox to verify your email address.' />
        </>
      )}
      {hasSucceeded && <BackButton variant='outline' href={authRoutes.signIn} label='Sign in' className='mt-4' />}
    </AuthFormWrapper>
  );
};

export default VerificationForm;
