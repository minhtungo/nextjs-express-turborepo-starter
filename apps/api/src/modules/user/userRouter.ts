import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { userController } from '@/modules/user/userController';
import { UserSchema } from '@/modules/user/userModel';

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register('User', UserSchema);

userRegistry.registerPath({
  method: 'get',
  path: '/user/me',
  tags: ['User'],
  responses: createApiResponse(z.array(UserSchema), 'Returns current user information'),
});

userRouter.get('/me', userController.getCurrentUser);

userRegistry.registerPath({
  method: 'patch',
  path: '/user/me',
  tags: ['User'],
  responses: createApiResponse(z.array(UserSchema), 'Success'),
});

userRouter.patch('/', userController.updateUser);

userRegistry.registerPath({
  method: 'patch',
  path: '/user/me/change-password',
  tags: ['User'],
  responses: createApiResponse(z.array(UserSchema), 'Success'),
});

userRouter.patch('/change-password', userController.changePassword);

// userRegistry.registerPath({
//   method: "get",
//   path: "/users/{id}",
//   tags: ["User"],
//   request: { params: GetUserSchema.shape.params },
//   responses: createApiResponse(UserSchema, "Success"),
// });

// userRouter.get("/:id", validateRequest(GetUserSchema), userController.getUser);
