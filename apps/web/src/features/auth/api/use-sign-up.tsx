import { signUpAction } from '@/features/auth/actions/auth';
import { useAction } from 'next-safe-action/hooks';

const useSignUp = () => {
  return useAction(signUpAction);
};

export default useSignUp;
