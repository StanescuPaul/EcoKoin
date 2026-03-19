import db from "../config/db";
import { globalCatch } from "../utils/globalCatch";
import { AppError } from "../utils/appError";
import { tokenRequest } from "../utils/tokenRequest";
import { Response } from "express";
import { sendSuccess } from "../utils/responseHandler";
import { Prisma } from "@prisma/client";

export const savingsGet = globalCatch(
  async (req: tokenRequest, res: Response) => {
    const { userId } = req.user;
    const { budgetId } = req.params;
    const { name } = req.query;

    if (!userId) {
      throw new AppError("Invalide user id", 403);
    }

    if (!budgetId || typeof budgetId !== "string") {
      throw new AppError("invalide budget id", 403);
    }

    const whereCondition: Prisma.SavingsWhereInput = {
      budgetId: budgetId,
      userId: userId,
    };

    if (typeof name === "string" && name.trim().length > 0) {
      whereCondition.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    const savings = await db.savings.findMany({
      where: whereCondition,
      orderBy: {
        date: "desc",
      },
    });

    sendSuccess(res, savings);
  },
);
