import type { SessionUser } from '@repo/validation/user';
import { unauthorized } from 'next/navigation';

import { env } from '@/config/env';
import { getUser } from '@/lib/auth';
import { cookies } from 'next/headers';

export const getSessionToken = async () => {
  return (await cookies()).get(env.SESSION_COOKIE_NAME)?.value;
};

export const verifySession = async (): Promise<SessionUser | null> => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) return null;

  return await getUser();
};

export const getCurrentUser = async (): Promise<SessionUser | null> => {
  const user = await verifySession();
  return user ?? null;
};

export const assertAuthenticated = async () => {
  const user = await getCurrentUser();
  if (!user) {
    unauthorized();
  }
  return user;
};
