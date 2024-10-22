'use client';

import { forgotPasswordAction, signInAction } from '@/features/auth/actions/auth';
import { useAction } from 'next-safe-action/hooks';

const useForgotPassword = () => {
  return useAction(forgotPasswordAction);
};

export default useForgotPassword;
