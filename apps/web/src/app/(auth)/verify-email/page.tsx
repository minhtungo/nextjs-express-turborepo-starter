import VerificationForm from '@/features/auth/components/VerifyEmailForm';
import { Suspense } from 'react';

export default function Verification() {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <Suspense>
        <VerificationForm />
      </Suspense>
    </div>
  );
}
