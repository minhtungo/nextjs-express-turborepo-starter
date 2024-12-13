import type { Request, RequestHandler, Response } from 'express';

import { ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/lib/httpHandlers';
import { StatusCodes } from 'http-status-codes';
import { updateUserSchema } from '@repo/types/user';
import { userService } from '@/api/user/userService';

const getUser: RequestHandler = async (_req: Request, res: Response) => {
  const serviceResponse = ServiceResponse.success('Hello', null, StatusCodes.OK);

  return handleServiceResponse(serviceResponse, res);
};

const updateUser: RequestHandler = async (req: Request, res: Response) => {
  const user = req.user;
  const data = updateUserSchema.parse(req.body);

  console.log('data', data);

  if (!user) {
    return handleServiceResponse(ServiceResponse.failure('Authentication failed', null, StatusCodes.UNAUTHORIZED), res);
  }

  const serviceResponse = await userService.updateUser(user.id, data);

  return handleServiceResponse(serviceResponse, res);
};

export const userController = {
  getUser,
  updateUser,
};
