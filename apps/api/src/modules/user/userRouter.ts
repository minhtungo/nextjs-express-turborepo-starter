import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@api/api-docs/openAPIResponseBuilders';
import UserController from '@api/modules/user/userController';
import { UserSchema } from '@api/modules/user/userModel';
import { changeUserPasswordSchema, updateProfileSchema } from '@repo/validation/user';
import { validateRequest } from '@api/common/lib/httpHandlers';

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register('User', UserSchema);

userRegistry.registerPath({
  method: 'get',
  path: '/user/me',
  tags: ['User'],
  responses: createApiResponse(UserSchema, 'Returns current user information'),
});

userRouter.get('/me', UserController.getCurrentUser);

userRegistry.registerPath({
  method: 'patch',
  path: '/user/me',
  tags: ['User'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: updateProfileSchema,
        },
      },
    },
  },
  responses: createApiResponse(z.string(), 'User updated successfully'),
});

userRouter.patch('/me', validateRequest(z.object({ body: updateProfileSchema })), UserController.updateUser);

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
  UserController.changePassword
);
