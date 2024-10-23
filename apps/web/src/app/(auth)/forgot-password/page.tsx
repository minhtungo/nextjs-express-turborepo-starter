import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm';
import { Suspense } from 'react';

export default function ForgotPassword() {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
