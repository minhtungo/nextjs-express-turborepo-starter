import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Resource not found",
  });
};

export default notFoundHandler;
