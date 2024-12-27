import { env } from "@/common/lib/env";

export const applicationName = "Lumi";

export const tokenLength = 32;
export const tokenTtl = 1000 * 60 * 5; // 5 min
export const verificationEmailTtl = 1000 * 60 * 60 * 24 * 7; // 7 days

export const saltRounds = 10;

export const appConfig = {
  sessionCookie: {
    name: env.SESSION_COOKIE_NAME,
    maxAge: env.SESSION_COOKIE_MAX_AGE,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    renewThreshold: 1000 * 60 * 60 * 24 * 3,
  },
};
