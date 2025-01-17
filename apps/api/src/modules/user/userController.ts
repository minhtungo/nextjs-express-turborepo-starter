import type { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { handleServiceResponse } from '@api/common/lib/httpHandlers';
import { ServiceResponse } from '@api/common/models/serviceResponse';
import { changeUserPasswordSchema, updateProfileSchema } from '@repo/validation/user';

import { userService } from '@api/modules/user/userService';

const getCurrentUser: RequestHandler = async (req, res) => {
  if (!req.user) {
    return handleServiceResponse(ServiceResponse.failure('Unauthorized', null, StatusCodes.UNAUTHORIZED), res);
  }

  return handleServiceResponse(ServiceResponse.success('User retrieved successfully', req.user), res);
};

const updateUser = async (req: Request, res: Response) => {
  const user = req.user;
  const data = updateProfileSchema.parse(req.body);

  if (!user) {
    return handleServiceResponse(ServiceResponse.failure('Authentication failed', null, StatusCodes.UNAUTHORIZED), res);
  }

  const serviceResponse = await userService.updateUser(user.id, data);

  return handleServiceResponse(serviceResponse, res);
};

const changePassword = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return handleServiceResponse(ServiceResponse.failure('Authentication failed', null, StatusCodes.UNAUTHORIZED), res);
  }

  const data = changeUserPasswordSchema.parse(req.body);

  const serviceResponse = await userService.changePassword(user.id, data);

  return handleServiceResponse(serviceResponse, res);
};

export default {
  getCurrentUser,
  updateUser,
  changePassword,
} as const;
