import ResetPasswordForm from '@/features/auth/components/ResetPasswordForm';
import { notFound } from 'next/navigation';
import React from 'react';

interface ResetPassword {
  params: Promise<{ token: string }>;
}

const ResetPassword = async ({ params }: ResetPassword) => {
  const { token } = await params;

  if (!token) {
    notFound();
  }

  return <ResetPasswordForm token={token} />;
};

export default ResetPassword;
