import { Response } from "express";
import { AppError } from "../utils/appError";
import db from "../config/db";
import { sendSuccess } from "../utils/responseHandler";
import { globalCatch } from "../utils/throwController";
import { tokenRequest, tokenData } from "../utils/tokenRequest";

interface userProps {
  email: string;
  createdAt: Date;
  totalExpenses: number;
  totalSavings: number;
}

export const userProfile = globalCatch(
  async (req: tokenRequest, res: Response) => {
    const { userId } = req.user;

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError("The user does not exist", 404);
    }

    const userProfileData: userProps = {
      email: user.email,
      createdAt: user.createdAt,
      totalExpenses: user.totalExpenses,
      totalSavings: user.totalSavings,
    };

    sendSuccess(res, userProfileData);
  },
);
