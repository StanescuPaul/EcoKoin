import db from "../config/db";
import { globalCatch } from "../utils/globalCatch";
import { AppError } from "../utils/appError";
import { tokenRequest } from "../utils/tokenRequest";
import { Response } from "express";
import { sendSuccess } from "../utils/responseHandler";
import { Prisma } from "@prisma/client";
import { connect } from "node:http2";

interface SavingsInput {
  name: string;
  amount: string;
  date: string;
}

interface Savings {
  name: string;
  amount: number;
  date: Date;
}

const nameRegex = /^[a-zA-Z]+$/;

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

export const savingsCreate = globalCatch(
  async (req: tokenRequest, res: Response) => {
    const { name, amount, date }: SavingsInput = req.body;
    const { userId } = req.user;
    const { budgetId } = req.params;

    if (!userId) {
      throw new AppError("Invalide user id", 403);
    }

    if (!budgetId || typeof budgetId !== "string") {
      throw new AppError("invalide budget id", 403);
    }

    const authorizedBudget = await db.budget.findUnique({
      where: { id: budgetId },
    });

    if (!authorizedBudget) {
      throw new AppError("The budget does not exist", 404);
    }

    if (authorizedBudget.userId !== userId) {
      throw new AppError("Access denied", 401);
    }

    if (!name || !amount || !date) {
      throw new AppError("All fields are required", 400);
    }

    if (!nameRegex.test(name)) {
      throw new AppError("The name must contain only letters", 400);
    }

    if (name.trim().length > 18 || name.length < 3) {
      throw new AppError("The name must have between 3 and 18 letters", 400);
    }

    const numericAmount: number = parseFloat(amount);

    if (isNaN(numericAmount)) {
      throw new AppError("The amount must pe a number", 400);
    }

    if (numericAmount <= 0) {
      throw new AppError("The amount must be positive", 400);
    }

    const savingsData: Savings = {
      name: name,
      amount: numericAmount,
      date: new Date(date),
    };

    const resultSavingsCreate = await db.$transaction(async (tx) => {
      const newSavings = await tx.savings.create({
        data: {
          ...savingsData,
          user: { connect: { id: userId } },
          budget: { connect: { id: budgetId } },
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          totalSavings: {
            increment: savingsData.amount,
          },
        },
      });

      const budget = await tx.budget.findUnique({ where: { id: budgetId } });

      if (budget && budget.amount <= 0) {
        throw new AppError("Insufficient funds", 400);
      }

      await tx.budget.update({
        where: { id: budgetId },
        data: {
          amount: {
            decrement: savingsData.amount,
          },
        },
      });

      return newSavings;
    });

    sendSuccess(res, resultSavingsCreate, "Succesfully created", 201);
  },
);

interface SavingsUpdateInput {
  newName?: string;
  newAmount?: string;
}

export const savingsUpdate = globalCatch(
  async (req: tokenRequest, res: Response) => {
    const { newName, newAmount }: SavingsUpdateInput = req.body;
    const { userId } = req.user;
    const { savingsId } = req.params;

    if (!userId) {
      throw new AppError("Invalide user id", 403);
    }

    if (!savingsId && typeof savingsId !== "string") {
      throw new AppError("Invalide savings id", 403);
    }

    if (!newName && !newAmount) {
      throw new AppError("There is no updates", 400);
    }

    if (newName && !nameRegex.test(newName)) {
      throw new AppError("The name must contain only letters", 400);
    }

    if (newName && (newName.trim().length > 18 || newName.length < 3)) {
      throw new AppError("The name must have between 3 and 18 letters", 400);
    }

    const savingsUpdateData: Prisma.SavingsUpdateInput = {};

    if (newName) {
      savingsUpdateData.name = newName;
    }
  },
);
