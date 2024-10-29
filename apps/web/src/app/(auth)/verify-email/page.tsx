import { authRoutes } from '@/config';
import AuthFormWrapper from '@/features/auth/components/AuthFormWrapper';
import VerifyEmailForm from '@/features/auth/components/VerifyEmailForm';
import { Suspense } from 'react';

export default async function VerifyEmail({ searchParams }: { searchParams: Promise<{ token: string }> }) {
  return (
    <AuthFormWrapper
      title='Verify Email'
      description='Verifying your email address...'
      noBorderMobile
      backButtonHref={authRoutes.signIn}
      backButtonLabel='Back to Sign In'
    >
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailForm searchParams={searchParams} />
      </Suspense>
    </AuthFormWrapper>
  );
}
