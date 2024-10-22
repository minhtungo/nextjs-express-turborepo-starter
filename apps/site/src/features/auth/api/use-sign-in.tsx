'use client';

import { signInAction } from '@/features/auth/actions/auth';
import { useAction } from 'next-safe-action/hooks';

const useSignIn = () => {
  return useAction(signInAction);
};

export default useSignIn;
