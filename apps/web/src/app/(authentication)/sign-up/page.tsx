import { authRoutes } from '@/config';
import AuthFormWrapper from '@/features/auth/components/AuthFormWrapper';
import SignUpForm from '@/features/auth/components/SignUpForm';
import Link from 'next/link';

export default function SignUp() {
  return (
    <AuthFormWrapper title="Sign Up" description="Sign up an account" noBorderMobile>
      <SignUpForm />
      <div className="mt-6 text-center text-sm">
        Have an account?{' '}
        <Link href={authRoutes.signIn} className="underline">
          Sign In
        </Link>
      </div>
    </AuthFormWrapper>
  );
}
