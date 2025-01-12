import { paths } from '@/config/paths';
import AuthFormWrapper from '@/features/auth/components/AuthFormWrapper';
import GoogleSignInButton from '@/features/auth/components/GoogleSignInButton';
import SignInForm from '@/features/auth/components/SignInForm';
import Link from 'next/link';
import { Suspense } from 'react';

export default function SignIn() {
  return (
    <AuthFormWrapper title="Sign in" description="Sign in to your account" noBorderMobile>
      <GoogleSignInButton />
      <Suspense>
        <SignInForm />
      </Suspense>
      <div className="mt-6 text-center text-sm">
        Don't have an account?{' '}
        <Link href={paths.auth.signUp.getHref()} className="underline">
          Sign Up
        </Link>
      </div>
      <div className="text-center">
        <Link
          href={paths.auth.forgotPassword.getHref()}
          className="text-muted-foreground inline-block text-sm hover:underline"
        >
          Forgot password?
        </Link>
      </div>
    </AuthFormWrapper>
  );
}
