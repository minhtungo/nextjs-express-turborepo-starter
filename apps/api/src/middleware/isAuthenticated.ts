import { ServiceResponse } from "@/common/models/serviceResponse";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import passport from "passport";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", {}, (err: any, user: Express.User | false) => {
    if (err) {
      next(err);
    }
    console.log("Authentication succeeded", user, req.user);
    next();
  })(req, res, next);
};

export default isAuthenticated;
