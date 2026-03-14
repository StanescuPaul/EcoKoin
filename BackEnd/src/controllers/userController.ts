import { Response } from "express";
import { AppError } from "../utils/appError";
import db from "../config/db";
import { sendSuccess } from "../utils/responseHandler";
import { globalCatch } from "../utils/throwController";
import { tokenRequest } from "../utils/tokenRequest";

interface userProps {
  email: string;
  userName: string | null;
  createdAt: Date;
  totalExpenses: number;
  totalSavings: number;
}

export const userProfile = globalCatch(
  //de acum folosesc tokenRequest pentru ca extinde Request normal pentru a putea accesa proprietatea .user
  async (req: tokenRequest, res: Response) => {
    const { userId } = req.user;

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError("The user does not exist", 404);
    }

    const userProfileData: userProps = {
      email: user.email,
      userName: user.userName,
      createdAt: user.createdAt,
      totalExpenses: user.totalExpenses,
      totalSavings: user.totalSavings,
    };

    sendSuccess(res, userProfileData);
  },
);

interface UpdateUserProps {
  userName?: string;
  email?: string;
}

export const userProfileUpdate = globalCatch(
  async (req: tokenRequest, res: Response) => {
    const { userId } = req.user;
    const { newUserName, newEmail } = req.body;
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError("The user does not exist", 404);
    }

    if (!emailRegex.test(newEmail)) {
      throw new AppError("The email is not valid", 400);
    }

    if (newUserName === user.userName && newEmail === user.email) {
      throw new AppError("There is no updates", 400);
    }

    if (newUserName && newUserName.length > 15) {
      throw new AppError("Username is too long", 400);
    }

    const updateData: UpdateUserProps = {};

    if (newUserName && newUserName !== user.userName) {
      updateData.userName = newUserName;
    }

    if (newEmail && newEmail !== user.email) {
      const emailExist = await db.user.findUnique({
        where: { email: newEmail },
      });
      if (emailExist) {
        throw new AppError("Email allready exist", 400);
      }
      updateData.email = newEmail;
    }

    const userUpdate = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    sendSuccess(res, userUpdate);
  },
);
