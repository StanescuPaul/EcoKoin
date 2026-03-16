import db from "../config/db";
import { AppError } from "../utils/appError";
import { sendSuccess } from "../utils/responseHandler";
import { globalCatch } from "../utils/throwController";
import { tokenRequest } from "../utils/tokenRequest";
import { Response } from "express";
export const expensesGet = globalCatch(
  async (req: tokenRequest, res: Response) => {
    const { userId } = req.user;
    const { budgetId } = req.params;

    if (!userId) {
      throw new AppError("The user does not exist", 404);
    }

    if (!budgetId || typeof budgetId !== "string") {
      throw new AppError("The budget does not exist", 404);
    }

    const expenses = await db.expenses.findMany({
      where: {
        budgetId: budgetId,
        budget: { userId: userId },
      },
      orderBy: {
        date: "desc",
      },
    });

    sendSuccess(res, expenses);
  },
);
