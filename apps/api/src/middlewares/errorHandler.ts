import type { ErrorRequestHandler, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

const unexpectedRequest: RequestHandler = (_req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND);
};

const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, next) => {
  res.locals.err = err;
  next(err);
};

export default function errorHandler(): Array<
  RequestHandler | ErrorRequestHandler
> {
  return [unexpectedRequest, addErrorToRequestLog];
}
