'use server';

import { env } from '@repo/env/server';
import { cookies } from 'next/headers';

export type Session = {
  user: {
    id: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
};

const secretKey = env.SESSION_SECRET_KEY;

export const setSessionTokenCookie = async (token: string, expiresAt: Date): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    path: '/',
  });
};

export const deleteSessionTokenCookie = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set('session', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  });
};
