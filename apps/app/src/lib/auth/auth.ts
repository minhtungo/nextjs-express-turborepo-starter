import { session } from '@repo/config/auth';
import { apiRoutes } from '@/config';
import { api } from '@/lib/api/authFetch';
import { getSessionToken } from '@/lib/auth/session';
import { AuthenticationError } from '@/lib/errors';
import { cache } from 'react';

export type Session = {
  user: {
    id: string;
    email: string;
  };
} | null;

export const validateRequest = async (): Promise<Session | null> => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) return null;

  return validateSessionToken(sessionToken);
};

export const validateSessionToken = cache(async (token: string) => {
  const result = await api.get<{ user: { id: string; email: string } }>(apiRoutes.auth.session, {
    cache: 'no-store',
    headers: {
      Cookie: `${session.name}=${token}`,
    },
  });

  if (!result.success) return null;

  return result.data?.user ? { user: result.data.user } : null;
});

export const getCurrentUser = async (): Promise<UserDTO | undefined> => {
  const session = await validateRequest();
  return session?.user ?? undefined;
};

export const assertAuthenticated = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthenticationError();
  }
  return user;
};
