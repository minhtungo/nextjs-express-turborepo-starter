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
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + cookie.accessToken.maxAge)
    .sign(encodedKey);

  const cookieStore = await cookies();

  cookieStore.set(cookie.accessToken.name, session, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: cookie.accessToken.maxAge,
  });
};

export const getSession = async () => {
  const session = (await cookies()).get(cookie.accessToken.name)?.value;

  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });

    return payload as Session;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};

export const deleteSession = async () => {
  (await cookies()).delete(cookie.accessToken.name);
};

export const updateTokens = async ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
  const session = (await cookies()).get(cookie.accessToken.name)?.value;

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
