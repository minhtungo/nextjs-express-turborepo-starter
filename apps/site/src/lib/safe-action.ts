import { createSafeActionClient } from 'next-safe-action';

export const actionClient = createSafeActionClient();

// const authenticationMiddleware = createMiddleware().define(async ({ next }) => {
//   //   return next({ ctx: { userId } });
// });
