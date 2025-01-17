import { env } from '@api/common/lib/env';
import { protectedProcedure, publicProcedure, router } from '@api/trpc';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  sendVerificationEmailSchema,
  signInSchema,
  signUpSchema,
  verifyEmailSchema,
} from '@repo/validation/auth';
import { TRPCError } from '@trpc/server';
import AuthService from './authService';

export const authRouter = router({
  signIn: publicProcedure.input(signInSchema).mutation(async ({ ctx, input }) => {
    const { code } = ctx.req.body;

    const result = await AuthService.authenticateUser(input.email, input.password, code);

    if (!result.success) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid credentials',
      });
    }

    const user = result.data;

    if (!result.success || !user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid credentials',
      });
    }

    return await AuthService.createSession(ctx.req, user);
  }),

  signUp: publicProcedure.input(signUpSchema).mutation(async ({ input }) => {
    return await AuthService.signUp(input);
  }),

  forgotPassword: publicProcedure.input(forgotPasswordSchema).mutation(async ({ input }) => {
    return await AuthService.forgotPassword(input.email);
  }),

  resetPassword: publicProcedure.input(resetPasswordSchema).mutation(async ({ input }) => {
    return await AuthService.resetPassword(input.token, input.password);
  }),

  verifyEmail: publicProcedure.input(verifyEmailSchema).mutation(async ({ input }) => {
    return await AuthService.verifyEmail(input.token);
  }),

  sendVerificationEmail: publicProcedure.input(sendVerificationEmailSchema).mutation(async ({ input }) => {
    return await AuthService.sendVerificationEmail(input.token);
  }),

  handleGoogleCallback: publicProcedure.mutation(async ({ ctx }) => {
    const user = ctx.req.user;
    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not found',
      });
    }
    return ctx.res.redirect(`${env.APP_ORIGIN}/dashboard`);
  }),

  // Protected route example
  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    return await AuthService.destroySession(ctx.req);
  }),
});
