import { apiRoutes } from '@/config';
import { api } from '@/lib/api/api';
import { getSessionToken } from '@/lib/auth/session';
import { AuthenticationError } from '@/lib/errors';
import { config } from '@repo/lib';
import { cache } from 'react';
import { SessionUser, Session } from '@repo/types/user';

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
    throw new AuthenticationError();
  }
  return user;
};
