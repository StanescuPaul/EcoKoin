import db from "../config/db";
import { sendSuccess } from "../utils/responseHandler";
import { AppError } from "../utils/appError";
import { Response } from "express";
import { tokenRequest } from "../utils/tokenRequest";
import { globalCatch } from "../utils/throwController";
import { connect } from "node:http2";

interface WhereConditionProp {
  userId: string;
  name?: string;
}

interface BudgetProps {
  name?: string;
  amount: number;
  startDate: Date;
  endDate?: Date;
}

export const budgetGet = globalCatch(
  async (req: tokenRequest, res: Response) => {
    const { userId } = req.user;
    const { name } = req.query;

    const whereCondition: WhereConditionProp = {
      userId: userId,
    };

    //trebuie sa verific daca e string pentru ca doar string accept si dadea typescript eroare pentru ca puteau sa vina si altfel de date
    if (typeof name === "string" && name.length > 0) {
      whereCondition.name = name;
    }

    const budgets = await db.budget.findMany({ where: whereCondition });

    if (name && budgets.length === 0) {
      throw new AppError("No budget with this name", 404);
    }

    sendSuccess(res, budgets);
  },
);

export const budgetCreate = globalCatch(
  async (req: tokenRequest, res: Response) => {
    const { userId } = req.user;
    const { name, amount, startDate, endDate }: BudgetProps = req.body;

    if (!amount || !startDate) {
      throw new AppError("The amount and start date are empty", 400);
    }

    if (amount <= 0) {
      throw new AppError("Amount have to be more then 0", 400);
    }

    if (name && name.length > 20) {
      throw new AppError("The name is too long", 400);
    }

    const budget = await db.budget.create({
      data: {
        name: name,
        amount: amount,
        startDate: new Date(startDate), // le transform in Date pentru ca din frontend ele o sa vina ca string json
        endDate: endDate ? new Date(endDate) : null,
        user: { connect: { id: userId } },
      },
    });

    sendSuccess(res, budget, "Budget created");
  },
);
