import { getCurrentUserService } from '@/features/auth/lib/services';
import type { Session, SessionUser } from '@repo/validation/user';
import { unauthorized } from 'next/navigation';
import { cache } from 'react';

import { env } from '@/lib/env';
import { cookies } from 'next/headers';

export const getSessionToken = async () => {
  return (await cookies()).get(env.SESSION_COOKIE_NAME)?.value;
};

export const verifySessionToken = cache(async (token: string): Promise<Session | null> => {
  const result = await getCurrentUserService();
  if (!result.success) return null;

  return result.data ? { user: result.data } : null;
});

export const verifySession = async (): Promise<Session | null> => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) return null;

  return await verifySessionToken(sessionToken);
};

export const getCurrentUser = async (): Promise<SessionUser | null> => {
  const session = await verifySession();
  return session?.user ?? null;
};

export const assertAuthenticated = async () => {
  const user = await getCurrentUser();
  if (!user) {
    unauthorized();
  }
  return user;
};
