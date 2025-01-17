import { authRouter } from '@api/modules/auth/authRouter.trpc';
import { userRouter } from '@api/modules/user/userRouter.trpc';
import { router } from '@api/trpc';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
});
// Export type definition of API
export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
