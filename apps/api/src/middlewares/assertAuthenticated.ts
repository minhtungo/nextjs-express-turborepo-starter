import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const assertAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("req.isAuthenticated()", req.isAuthenticated());
  if (!req.session || !req.isAuthenticated()) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Session expired or invalid",
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }
  next();
};

export default assertAuthenticated;
