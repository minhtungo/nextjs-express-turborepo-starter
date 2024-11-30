import { session } from '@repo/config';
import { cookies } from 'next/headers';

export const getSessionToken = async () => {
  return (await cookies()).get(session.name)?.value;
};

export const setSessionTokenCookie = async (token: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(session.name, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: session.maxAge / 1000,
    path: '/',
  });
};

export const deleteSessionTokenCookie = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(session.name, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  });
};
