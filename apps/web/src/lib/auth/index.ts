import { getSession } from '@/features/auth/actions/session';

export const getCurrentUser = async () => {
  const session = await getSession();

  return session?.user;
};
