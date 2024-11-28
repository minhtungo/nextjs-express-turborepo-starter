'use server';

import { cookie } from '@/config';
import { env } from '@repo/env/server';
import { deleteTokenCookie, getTokenCookie, setTokenCookie } from '@/lib/auth';
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

  setTokenCookie(cookie.session.name, userSession, cookie.session.maxAge);

  setTokenCookie(cookie.accessToken.name, payload.accessToken, cookie.accessToken.maxAge);

  setTokenCookie(cookie.refreshToken.name, payload.refreshToken, cookie.refreshToken.maxAge);
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
  return await getTokenCookie(cookie.accessToken.name);
};

export const getRefreshToken = async () => {
  return await getTokenCookie(cookie.refreshToken.name);
};

export const deleteSession = async () => {
  await deleteTokenCookie(cookie.session.name);
  await deleteTokenCookie(cookie.accessToken.name);
  await deleteTokenCookie(cookie.refreshToken.name);
};

export const updateTokens = async ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
  const session = await getTokenCookie(cookie.session.name);

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

  console.log('newPayload', newPayload);
  const userSession = await new SignJWT(newPayload.user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + cookie.session.maxAge)
    .sign(encodedKey);

  setTokenCookie(cookie.session.name, userSession, cookie.session.maxAge);

  setTokenCookie(cookie.accessToken.name, newPayload.accessToken, cookie.accessToken.maxAge);

  setTokenCookie(cookie.refreshToken.name, newPayload.refreshToken, cookie.refreshToken.maxAge);
};
