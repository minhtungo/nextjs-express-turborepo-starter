import { protectedProcedure, router } from '@api/trpc';
import { updateProfileSchema, changeUserPasswordSchema } from '@repo/validation/user';
import { userService } from '@api/modules/user/userService';
import { TRPCError } from '@trpc/server';
import { StatusCodes } from 'http-status-codes';

export const userRouter = router({
  // Get current user profile
  me: protectedProcedure.query(({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User not found',
      });
    }
    return ctx.user;
  }),

  // Update user profile
  updateProfile: protectedProcedure.input(updateProfileSchema).mutation(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication failed',
      });
    }

    const result = await userService.updateUser(ctx.user.id, input);

    if (!result.success) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: result.message,
      });
    }

    return result.data;
  }),

  // Change password
  changePassword: protectedProcedure.input(changeUserPasswordSchema).mutation(async ({ ctx, input }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication failed',
      });
    }

    const result = await userService.changePassword(ctx.user.id, input);

    if (!result.success) {
      throw new TRPCError({
        code: result.statusCode === StatusCodes.UNAUTHORIZED ? 'UNAUTHORIZED' : 'INTERNAL_SERVER_ERROR',
        message: result.message,
      });
    }

    return result.data;
  }),
});

export type UserRouter = typeof userRouter;
