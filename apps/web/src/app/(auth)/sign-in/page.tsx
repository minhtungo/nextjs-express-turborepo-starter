import SignInForm from '@/features/auth/components/SignInForm';
import { Suspense } from 'react';

export default function SignIn() {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <Suspense>
        <SignInForm />
      </Suspense>
    </div>
  );
}
