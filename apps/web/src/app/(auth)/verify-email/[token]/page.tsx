import { paths } from '@/config/paths';
import AuthFormWrapper from '@/features/auth/components/AuthFormWrapper';
import VerifyEmailForm from '@/features/auth/components/VerifyEmailForm';
import { Suspense } from 'react';

export default async function VerifyEmail({ params }: { params: Promise<{ token: string }> }) {
  return (
    <AuthFormWrapper
      title="Verify Email"
      noBorderMobile
      backButtonHref={paths.auth.signIn.getHref()}
      backButtonLabel="Back to Sign In"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailForm params={params} />
      </Suspense>
    </AuthFormWrapper>
  );
}
