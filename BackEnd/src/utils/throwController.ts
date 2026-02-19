import { Request, Response, NextFunction } from "express";

export const globalCatch = (throwController: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    throwController(req, res, next).catch((err: Error) => next(err));
  };
};
