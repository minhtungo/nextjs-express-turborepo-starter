import { env } from "@/common/lib/env";

export const config = {
  sessionCookie: {
    name: env.SESSION_COOKIE_NAME,
    maxAge: env.SESSION_COOKIE_MAX_AGE,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    renewThreshold: 1000 * 60 * 60 * 24 * 3,
  },
  resetPasswordToken: {
    length: 32,
    maxAge: 1000 * 60 * 5,
  },
  verificationEmailToken: {
    length: 32,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
