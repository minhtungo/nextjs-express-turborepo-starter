import { resetPasswordAction } from '@/features/auth/actions/auth';
import { useAction } from 'next-safe-action/hooks';

export const useResetPassword = () => {
  return useAction(resetPasswordAction);
};
