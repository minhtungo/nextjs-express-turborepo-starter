import { assertAuthenticated } from "@/lib/auth/auth";
import { createMiddleware, createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient();

const authenticationMiddleware = createMiddleware().define(async ({ next }) => {
  const user = await assertAuthenticated();

  return next({ ctx: { user } });
});

export const authActionClient = actionClient.use(authenticationMiddleware);
