import { env } from '@api/common/lib/env';

export const config = {
  sessionCookie: {
    name: env.SESSION_COOKIE_NAME,
    secret: env.SESSION_SECRET,
    maxAge: 60 * 1000 * 60,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    renewThreshold: 60 * 30 * 1000,
  },
  resetPasswordToken: {
    length: 48,
    maxAge: 1000 * 60 * 5,
  },
  verificationEmailToken: {
    length: 48,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
