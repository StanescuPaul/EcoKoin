import { sendError } from "../utils/responseHandler";
import { Response, Request, NextFunction } from "express";

//Cand vine AppError/Error sub forma lui error imi pot lua satusul si mesajul de acolo apoi cu sendError imi formatez eroare in modul in care vreau
export const globalHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status: number = error.statusCode;
  const message: string = error.message;

  return sendError(res, message, status, error);
};
