import { getSession } from '@/lib/auth/auth';
import { createMiddleware, createSafeActionClient } from 'next-safe-action';

export const actionClient = createSafeActionClient();

const authenticationMiddleware = createMiddleware().define(async ({ next }) => {
  const session = await getSession();

  return next({ ctx: { user: session?.user } });
});

export const authActionClient = actionClient.use(authenticationMiddleware);
