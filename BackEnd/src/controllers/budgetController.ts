import db from "../config/db";
import { sendSuccess } from "../utils/responseHandler";
import { AppError } from "../utils/appError";
import { Response } from "express";
import { tokenRequest } from "../utils/tokenRequest";
import { globalCatch } from "../utils/globalCatch";
import { Prisma } from "@prisma/client";

interface BudgetProps {
  name: string;
  amount: string;
  startDate: string; //toate string pentru ca asa vin din frontend si trebuie parsate inainte de a fi introduse in database
  endDate?: string;
}

const nameRegex = /^[a-zA-Z]+$/;

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

    if (!amount || !startDate || !name) {
      throw new AppError("The amount,name and start date are empty", 400);
    }

    if (numericAmount <= 0) {
      throw new AppError("The amount have to be more then 0", 400);
    }

    if (!nameRegex.test(name)) {
      throw new AppError("The name must contain only letters", 400);
    }

    if (name.trim().length > 18 && name.length < 2) {
      throw new AppError("The name is too long or to short", 400);
    }

    const budget = await db.budget.create({
      data: {
        name: name,
        amount: numericAmount,
        startDate: new Date(startDate), // le transform in Date pentru ca din frontend ele o sa vina ca string json
        endDate: endDate ? new Date(endDate) : null,
        user: { connect: { id: userId } },
      },
    });

    sendSuccess(res, budget, "Budget created", 201);
  },
);

interface BudgetUpdateInput {
  newName?: string;
  addAmount?: string;
  endDate?: string;
  isCompleted: boolean;
}

//update-ul poate fi facut in orice situatie si farar input-uri dar nu se v-a intampla nimic
export const budgetUpdate = globalCatch(
  async (req: tokenRequest, res: Response) => {
    const { newName, addAmount, endDate, isCompleted }: BudgetUpdateInput =
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

    if (newName && !nameRegex.test(newName)) {
      throw new AppError("The new name must contain only letters", 400);
    }

    if (newName && (newName.trim().length > 18 || newName.length < 3)) {
      throw new AppError("The name must be between 3 and 18 letters", 400);
    }

    const budgetUpdateData: Prisma.BudgetUpdateInput = {
      isCompleted: isCompleted,
    };

    if (newName) {
      budgetUpdateData.name = newName;
    }

    const numericAddAmount: number = parseFloat(addAmount || ""); //o sa ia valaorea NaN daca este ""

    if (addAmount && isNaN(numericAddAmount)) {
      throw new AppError("The amount must be a number", 400);
    }

    if (addAmount && numericAddAmount <= 0) {
      throw new AppError("The amount must be more then 0", 400);
    }

    if (numericAddAmount) {
      //daca vine string gol o sa fie valoarea NaN care este falsly
      budgetUpdateData.amount = {
        increment: numericAddAmount,
      };
    }

    if (endDate) {
      budgetUpdateData.endDate = new Date(endDate);
    }

    await db.budget.update({
      where: { id: budgetId },
      data: budgetUpdateData,
    });

    //varianta buna daca nu sunt si operatii pe update
    // const budgetUpdate = await db.budget.update({
    //   where: { id: budgetId },
    //   data: {
    //     name: newName || undefined, //daca ii dau undefined nu se produc schimbari oricum in baza de date
    //     amount: {
    //       increment: numericAddAmount,// baza de date face automat adunarea
    //     },
    //     endDate: endDate ? new Date(endDate) : undefined,
    //     isCompleted: isCompleted || undefined,
    //   },
    // });

    sendSuccess(res);
  },
);

export const budgetDelete = globalCatch(
  async (req: tokenRequest, res: Response) => {
    const { userId } = req.user;
    const { budgetId } = req.params;

    if (!budgetId || typeof budgetId !== "string") {
      throw new AppError("The budget does not exist", 404);
    }

    const existBudget = await db.budget.findUnique({
      where: { id: budgetId },
    });

    if (!existBudget) {
      throw new AppError("The budget does not exist", 404);
    }

    if (existBudget.userId !== userId) {
      throw new AppError("The budget can not be deleted", 401);
    }

    await db.budget.delete({
      where: { id: budgetId },
    });

    sendSuccess(res, undefined, "Deleted succesfully");
  },
);
