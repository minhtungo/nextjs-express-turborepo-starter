'use server';

import { cookie } from '@/config';
import { env } from '@/config/env';
import { jwtVerify, SignJWT } from 'jose';
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
const encodedKey = new TextEncoder().encode(secretKey);

export const createSession = async (payload: Session) => {
  const userSession = await new SignJWT(payload.user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + cookie.session.maxAge)
    .sign(encodedKey);

  const cookieStore = await cookies();

  cookieStore.set(cookie.session.name, userSession, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: cookie.session.maxAge,
  });

  cookieStore.set(cookie.accessToken.name, payload.accessToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: cookie.accessToken.maxAge,
  });

  cookieStore.set(cookie.refreshToken.name, payload.refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: cookie.refreshToken.maxAge,
  });
};

export const getSession = async () => {
  const session = (await cookies()).get(cookie.session.name)?.value;

  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });

    return payload as {
      id: string;
      email: string;
    };
  } catch (error) {
    console.log('Failed to verify user session:', error);
    return null;
  }
};

export const getAccessToken = async () => {
  return (await cookies()).get(cookie.accessToken.name)?.value;
};

export const getRefreshToken = async () => {
  return (await cookies()).get(cookie.refreshToken.name)?.value;
};

export const deleteSession = async () => {
  (await cookies()).delete(cookie.session.name);
  (await cookies()).delete(cookie.accessToken.name);
  (await cookies()).delete(cookie.refreshToken.name);
};

export const updateTokens = async ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
  const cookieStore = await cookies();
  const session = cookieStore.get(cookie.session.name)?.value;

  if (!session) return null;

  const { payload } = await jwtVerify<Session>(session, encodedKey, {
    algorithms: ['HS256'],
  });

  if (!payload) throw new Error('Session not found');

  const newPayload: Session = {
    user: {
      ...payload.user,
    },
    accessToken,
    refreshToken,
  };

  await createSession(newPayload);
};
