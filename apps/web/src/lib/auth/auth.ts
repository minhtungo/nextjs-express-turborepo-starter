import { apiRoutes } from '@/config';
import { api } from '@/lib/api/baseFetch';
import { getSessionToken } from '@/lib/auth/session';

export type Session = {
  user: {
    id: string;
    email: string;
  };
} | null;

export const getSession = async (): Promise<Session | null> => {
  const sessionToken = await getSessionToken();

  console.log('sessionToken', sessionToken);
  if (!sessionToken) return null;

  const result = await api.get<{ user: { id: string; email: string } }>(apiRoutes.auth.session, {
    credentials: 'include',
    cache: 'no-store',
    headers: {
      Cookie: `connect.sid=${sessionToken}`,
    },
    body: undefined,
  });

  console.log('result', result);

  if (!result.success) return null;

  return result.data?.user ? { user: result.data.user } : null;
};
