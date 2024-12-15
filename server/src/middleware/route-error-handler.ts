import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { RouteError, sendApiResponse } from "../utils";
import { StatusCodes } from "http-status-codes";

const routeErrorHandlingMiddleware: ErrorRequestHandler = (
  err: any,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  if (err instanceof RouteError)
    sendApiResponse({
      res,
      statusCode: err.statusCode,
      success: false,
      message: err.message,
      result: err.result,
    });
  else
    sendApiResponse({
      res,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: err.message,
      result: err.data || null,
    });
};

export default routeErrorHandlingMiddleware;
