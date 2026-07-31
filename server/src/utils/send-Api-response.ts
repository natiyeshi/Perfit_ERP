import { Response } from "express";
import { ApiResponse, PaginationMeta } from "../types";

type SendApiResponse<T> = {
  res: Response;
  statusCode: number;
  success: boolean;
  message: string;
  result: T | null;
  meta?: PaginationMeta;
};

const sendApiResponse = <T>({
  res,
  statusCode,
  success,
  message,
  result,
  meta,
}: SendApiResponse<T>) => {
  return res.status(statusCode).json({
    success,
    message,
    result,
    ...(meta ? { meta } : {}),
  } satisfies ApiResponse<T>);
};

export default sendApiResponse;
