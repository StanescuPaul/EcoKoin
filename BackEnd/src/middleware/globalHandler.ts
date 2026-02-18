import { sendError } from "../utils/responseHandler";
import { Response, Request, NextFunction } from "express";

export const globalHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status: number = error.statusCode || 500;
  const message: string = error.message || "Internal server error";

  return sendError(res, message, status, error);
};
