import SignInForm from '@/features/auth/components/SignInForm';
import { Suspense } from 'react';

export default function SignIn() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
