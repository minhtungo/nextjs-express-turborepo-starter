import { apiRoutes } from '@/config';
import { api } from '@/lib/api/api';
import { getSessionToken } from '@/lib/auth/session';
import { config } from '@repo/lib';
import { Session, SessionUser } from '@repo/types/user';
import { unauthorized } from 'next/navigation';
import { cache } from 'react';

export const verifySessionToken = cache(async (token: string): Promise<Session | null> => {
  const result = await api.get<Session>(apiRoutes.auth.session, {
    cache: 'no-store',
    headers: {
      Cookie: `${config.auth.sessionCookie.name}=${token}`,
    },
  });

  if (!result.success) return null;

  return result.data?.user ? { user: result.data.user } : null;
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
