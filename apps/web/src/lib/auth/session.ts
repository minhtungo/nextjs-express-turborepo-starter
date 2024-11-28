import { env } from '@repo/env/server';
import { getSession } from '@/lib/auth/auth';
import { cookies } from 'next/headers';

export const getTokenCookie = async (name: string) => {
  return (await cookies()).get(name)?.value;
};

export const deleteTokenCookie = async (name: string) => {
  (await cookies()).delete(name);
};

export const setTokenCookie = async (name: string, payload: string, maxAge: number) => {
  (await cookies()).set(name, payload, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
};

export const getCurrentUser = async () => {
  return await getSession();
};
