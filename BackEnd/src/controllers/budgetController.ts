import db from "../config/db";
import { sendSuccess } from "../utils/responseHandler";
import { AppError } from "../utils/appError";
import { Response } from "express";
import { tokenRequest } from "../utils/tokenRequest";
import { globalCatch } from "../utils/throwController";
import { Prisma } from "@prisma/client";

interface BudgetProps {
  name?: string;
  amount: string;
  startDate: string; //toate string pentru ca asa vin din frontend si trebuie parsate inainte de a fi introduse in database
  endDate?: string;
}

export const budgetGet = globalCatch(
  async (req: tokenRequest, res: Response) => {
    const { userId } = req.user;
    const { name } = req.query;

    //BudgetWhereInput ii spune exact ce tipuri de variabile poate sa foloseasca pentru filter
    const whereCondition: Prisma.BudgetWhereInput = {
      userId: userId,
    };

    //trebuie sa verific daca e string pentru ca doar string accept si dadea typescript eroare pentru ca puteau sa vina si altfel de date
    if (typeof name === "string" && name.trim().length > 0) {
      whereCondition.name = {
        contains: name, // contains pentru a primi orice contine acel nume
        mode: "insensitive", // insensitive pentru a putea cauta indiferent de majuscule
      };
    }

    const budgets = await db.budget.findMany({
      where: whereCondition,
      orderBy: {
        startDate: "desc", //pentru a le primi sortate in ordine crescatoare de la cea mai noua la ce mai veche
      },
    });

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

    const numericAmount = parseFloat(amount);

    if (!amount || !startDate) {
      throw new AppError("The amount and start date are empty", 400);
    }

    if (numericAmount <= 0) {
      throw new AppError("Amount have to be more then 0", 400);
    }

    if (name && name.length > 18) {
      throw new AppError("The name is too long", 400);
    }

    const budget = await db.budget.create({
      data: {
        name: name ? name : null,
        amount: numericAmount,
        startDate: new Date(startDate), // le transform in Date pentru ca din frontend ele o sa vina ca string json
        endDate: endDate ? new Date(endDate) : null,
        user: { connect: { id: userId } },
      },
    });

    sendSuccess(res, budget, "Budget created", 201);
  },
);

interface BudgetUpdateProps {
  newName?: string;
  addAmount?: string;
  endDate?: string;
  isCompleted: boolean;
}

export const budgetUpdate = globalCatch(
  async (req: tokenRequest, res: Response) => {
    const { newName, addAmount, endDate, isCompleted }: BudgetUpdateProps =
      req.body;
    const { budgetId } = req.params;
    const { userId } = req.user;

    if (!budgetId || typeof budgetId !== "string") {
      throw new AppError("The budget does not exist", 404);
    }

    const findBudget = await db.budget.findUnique({
      where: { id: budgetId },
    });

    if (!findBudget) {
      throw new AppError("The budget does not exist", 404);
    }

    if (findBudget && findBudget.userId !== userId) {
      throw new AppError("You don't have permision to update this budget", 401);
    }

    if (!newName && !addAmount && !endDate && isCompleted === false) {
      throw new AppError("There is no updates", 400);
    }

    if (newName && newName.length > 18) {
      throw new AppError("The name is too long", 400);
    }

    const numericAddAmount = parseFloat(addAmount || "");

    if (addAmount !== undefined && isNaN(numericAddAmount)) {
      throw new AppError("The amount is invalide", 400);
    }

    if (numericAddAmount <= 0) {
      throw new AppError("The amount must be positive", 400);
    }

    let newAmount: number | undefined;

    if (numericAddAmount && findBudget) {
      newAmount = findBudget.amount + numericAddAmount;
    }

    const budgetUpdate = await db.budget.update({
      where: { id: budgetId },
      data: {
        name: newName || undefined, //daca ii dau undefined nu se produc schimbari oricum in baza de date
        amount: newAmount || undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isCompleted: isCompleted || undefined,
      },
    });

    sendSuccess(res, budgetUpdate, "Update succesfully", 201);
  },
);
