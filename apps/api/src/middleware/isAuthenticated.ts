import { ServiceResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import passport from "passport";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("jwt", { session: false }, (err: any, user: Express.User | false) => {
    if (err || !user) {
      const serviceResponse = ServiceResponse.failure("Unauthorized", null, StatusCodes.UNAUTHORIZED);
      return handleServiceResponse(serviceResponse, res);
    }
    console.log("Authentication succeeded", user, req.user);
    req.user = user;
    next();
  })(req, res, next);
};

export default isAuthenticated;
