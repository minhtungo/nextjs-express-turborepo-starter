import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/userService";
import { handleServiceResponse } from "@/common/lib/httpHandlers";
import { ServiceResponse } from "@/common/models/serviceResponse";
import {
  changeUserPasswordSchema,
  updateUserSchema,
} from "@repo/validation/user";

import { StatusCodes } from "http-status-codes";

const getUser: RequestHandler = async (_req: Request, res: Response) => {
  const serviceResponse = ServiceResponse.success(
    "Hello",
    null,
    StatusCodes.OK,
  );

  return handleServiceResponse(serviceResponse, res);
};

const updateUser: RequestHandler = async (req: Request, res: Response) => {
  const user = req.user;
  const data = updateUserSchema.parse(req.body);

  if (!user) {
    return handleServiceResponse(
      ServiceResponse.failure(
        "Authentication failed",
        null,
        StatusCodes.UNAUTHORIZED,
      ),
      res,
    );
  }

  const serviceResponse = await userService.updateUser(user.id, data);

  return handleServiceResponse(serviceResponse, res);
};

const changePassword = async (req: Request, res: Response) => {
  const user = req.user;
  console.log("changePassword", user);
  if (!user) {
    return handleServiceResponse(
      ServiceResponse.failure(
        "Authentication failed",
        null,
        StatusCodes.UNAUTHORIZED,
      ),
      res,
    );
  }

  const data = changeUserPasswordSchema.parse(req.body);

  const serviceResponse = await userService.changePassword(user.id, data);

  return handleServiceResponse(serviceResponse, res);
};

export const userController = {
  getUser,
  updateUser,
  changePassword,
};
