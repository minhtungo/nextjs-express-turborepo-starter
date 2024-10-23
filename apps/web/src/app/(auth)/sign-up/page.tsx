import SignUpForm from '@/features/auth/components/SignUpForm';
import { Suspense } from 'react';

export default function SignUp() {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <Suspense>
        <SignUpForm />
      </Suspense>
    </div>
  );
}
