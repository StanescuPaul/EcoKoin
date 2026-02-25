import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError";
import { globalCatch } from "../utils/throwController";
import { envs } from "../config/envs";
import { tokenRequest, tokenData } from "../utils/tokenRequest";

export const authMiddleware = globalCatch(
  async (req: tokenRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Unauthorized. No token provided.", 401);
    }

    const decoded = jwt.verify(token, envs.JWT_SECRET) as tokenData;

    req.user = decoded;

    next();
  },
);
