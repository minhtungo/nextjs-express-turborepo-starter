import Page from '@/components/layout/Page';
import { Suspense } from 'react';

export default function ForgotPassword() {
  return (
    <Page className='flex h-full w-full items-center justify-center'>
      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
    </Page>
  );
}
