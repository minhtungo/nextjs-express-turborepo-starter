import Spinner from '@/components/Spinner';
import { authRoutes } from '@/lib/config';
import AuthFormWrapper from '@/features/auth/components/AuthFormWrapper';
import ResetPassword from '@/features/auth/components/ResetPassword';
import { Suspense } from 'react';

export default async function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  return (
    <AuthFormWrapper
      title="Reset Password"
      description="To help keep your account secure, we require a password you haven’t used before."
      noBorderMobile
      backButtonHref={authRoutes.signIn}
      backButtonLabel="Back to Sign In"
    >
      <Suspense
        fallback={
          <div className="flex items-center gap-x-2">
            <span>Verifying token</span>
            <Spinner className="size-4" />
          </div>
        }
      >
        <ResetPassword params={params} />
      </Suspense>
    </AuthFormWrapper>
  );
}
