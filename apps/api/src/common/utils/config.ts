import { env } from '@/common/utils/env';

export const applicationName = 'Lumi';

export const tokenLength = 32;
export const tokenTtl = 1000 * 60 * 5; // 5 min
export const verificationEmailTtl = 1000 * 60 * 60 * 24 * 7; // 7 days

export const saltRounds = 10;

export const jwt = {
  refreshToken: {
    secret: env.REFRESH_TOKEN_SECRET,
    expires: 1000 * 60 * 60 * 24 * 7,
    expiresIn: '7d',
    cookie_name: 'refresh_token',
  },
  accessToken: {
    secret: env.ACCESS_TOKEN_SECRET,
    expires: 1000 * 60 * 60 * 24 * 30 * 3,
    expiresIn: '3d',
    cookie_name: 'access_token',
  },
};
