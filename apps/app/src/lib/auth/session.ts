import config from '@repo/config';
import { cookies } from 'next/headers';

export const getSessionToken = async () => {
  return (await cookies()).get(config.auth.sessionCookie.name)?.value;
};

export const setSessionTokenCookie = async (token: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(config.auth.sessionCookie.name, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: config.auth.sessionCookie.maxAge / 1000,
    path: '/',
  });
};

export const deleteSessionTokenCookie = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(config.auth.sessionCookie.name);
};
