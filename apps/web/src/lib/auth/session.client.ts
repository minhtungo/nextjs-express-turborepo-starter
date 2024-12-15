import { config } from '@repo/lib';
import { getCookie } from 'cookies-next';

export const getClientSessionToken = () => {
  return getCookie(config.auth.sessionCookie.name);
};
