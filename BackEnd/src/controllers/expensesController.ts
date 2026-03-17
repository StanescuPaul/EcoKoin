import db from "../config/db";
import { AppError } from "../utils/appError";
import { sendSuccess } from "../utils/responseHandler";
import { globalCatch } from "../utils/globalCatch";
import { tokenRequest } from "../utils/tokenRequest";
import { Response } from "express";
import { Prisma } from "@prisma/client";

export const expensesGet = globalCatch(
  async (req: tokenRequest, res: Response) => {
    const { userId } = req.user;
    const { budgetId } = req.params;
    const { name } = req.query;

    if (!userId) {
      throw new AppError("The user does not exist", 404);
    }

    if (!budgetId || typeof budgetId !== "string") {
      throw new AppError("The budget does not exist", 404);
    }

    const whereCondition: Prisma.ExpensesWhereInput = {
      budgetId: budgetId,
      budget: { userId: userId },
    };

    if (typeof name === "string" && name.trim().length > 0) {
      whereCondition.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    const expenses = await db.expenses.findMany({
      where: whereCondition,
      orderBy: {
        date: "desc",
      },
    });

    sendSuccess(res, expenses);
  },
);
