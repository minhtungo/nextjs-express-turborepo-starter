import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { userController } from '@/modules/user/userController';
import { UserSchema } from '@/modules/user/userModel';
import { changeUserPasswordSchema, updateUserSchema } from '@repo/validation/user';
import { validateRequest } from '@/common/lib/httpHandlers';

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register('User', UserSchema);

userRegistry.registerPath({
  method: 'get',
  path: '/user/me',
  tags: ['User'],
  responses: createApiResponse(UserSchema, 'Returns current user information'),
});

userRouter.get('/me', userController.getCurrentUser);

userRegistry.registerPath({
  method: 'patch',
  path: '/user/me',
  tags: ['User'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: updateUserSchema,
        },
      },
    },
  },
  responses: createApiResponse(z.string(), 'User updated successfully'),
});

userRouter.patch('/me', validateRequest(z.object({ body: updateUserSchema })), userController.updateUser);

userRegistry.registerPath({
  method: 'patch',
  path: '/user/me/change-password',
  tags: ['User'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: changeUserPasswordSchema,
        },
      },
    },
  },
  responses: createApiResponse(z.null(), 'Password changed successfully'),
});

userRouter.patch(
  '/me/change-password',
  validateRequest(z.object({ body: changeUserPasswordSchema })),
  userController.changePassword
);
