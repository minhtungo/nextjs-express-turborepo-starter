import { getSession } from '@/features/auth/actions/session';
import { createMiddleware, createSafeActionClient } from 'next-safe-action';

export const actionClient = createSafeActionClient();

const authenticationMiddleware = createMiddleware().define(async ({ next }) => {
  const session = await getSession();

  return next({ ctx: { user: session?.user } });
});

export const authActionClient = actionClient.use(authenticationMiddleware);
