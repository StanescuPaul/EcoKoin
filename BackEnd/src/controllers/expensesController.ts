import db from "../config/db";
import { AppError } from "../utils/appError";
import { sendSuccess } from "../utils/responseHandler";
import { globalCatch } from "../utils/globalCatch";
import { tokenRequest } from "../utils/tokenRequest";
import { Response } from "express";
import { ExpensesType, Prisma } from "@prisma/client";

const nameRegex = /^[a-zA-Z]+$/;

interface ExpensesInput {
  name: string;
  amount: string;
  date: string;
  type: string;
}

interface Expenses {
  name: string;
  amount: number;
  date: Date;
  type: ExpensesType;
}

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

export const expensesCreate = globalCatch(
  async (req: tokenRequest, res: Response) => {
    const { userId } = req.user;
    const { budgetId } = req.params;
    const { name, amount, date, type }: ExpensesInput = req.body; //toate vin ca string din frontend

    if (!userId) {
      throw new AppError("The user doesn't exist", 404);
    }

    if (!budgetId || typeof budgetId !== "string") {
      throw new AppError("The budget doesn't exist", 404);
    }

    const authorizedBudget = await db.budget.findUnique({
      where: { id: budgetId },
    });

    if (!authorizedBudget) {
      throw new AppError("The budget wasn't found", 404);
    }

    if (authorizedBudget.userId !== userId) {
      throw new AppError("Access denied", 401);
    }

    if (!name || !amount || !date || !type) {
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
      throw new AppError("The amount must be a number", 400);
    }

    if (numericAmount <= 0) {
      throw new AppError("The amount must be positive", 400);
    }

    const expensesData: Expenses = {
      name: name,
      amount: numericAmount,
      date: new Date(date),
      type: type as ExpensesType,
    };

    const resultExpensesCreate = await db.$transaction(async (tx) => {
      //tx este o instanta locala identica cu baza de date si abia la final daca totul a mers bine acel tx aplica schimbarile si pe db-ul existent daca nu se sterge tx si db ramane neatinsa
      //$transaction creaza un mediu in care poti face mai multe operatii pe baza de date daca eseaza una esueaza toate si se da rollback la ce era inainte
      const newExpenses = await tx.expenses.create({
        data: {
          ...expensesData, //destructuring si le da match la campuri singur dupa nume
          user: { connect: { id: userId } },
          budget: { connect: { id: budgetId } },
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          totalExpenses: {
            increment: expensesData.amount, //increment pentru ca prisma stie sa faca adunarea direct pe baza de date si evitam cazuri de concurenta
          },
        },
      });

      const budget = await db.budget.findUnique({ where: { id: budgetId } });

      if (!budget || budget.amount <= 0) {
        throw new AppError("Insufficient funds", 400); // la orice throw error se opreste tranzactia si se da rollback la toate resursele din ea
      }

      await tx.budget.update({
        where: { id: budgetId },
        data: {
          amount: {
            decrement: expensesData.amount,
          },
        },
      });

      return newExpenses; //returnez ultimul expenses pentru a putea folosi valoare
    });

    sendSuccess(res, resultExpensesCreate, undefined, 201);
  },
);

interface ExpensesUpdateInput {
  newName?: string;
  addAmount?: string;
  newType?: string;
}

//ToDo: continua ruta de update la expenses
export const expensesUpdate = globalCatch(
  async (req: tokenRequest, res: Response) => {
    const { userId } = req.user;
    const { expensesId } = req.params;
    const { newName, addAmount, newType }: ExpensesUpdateInput = req.body;

    if (!userId) {
      throw new AppError("The user doesn't exist", 404);
    }

    if (!expensesId || typeof expensesId !== "string") {
      throw new AppError("The expenses doesn't exist", 400);
    }

    if (!newName && !addAmount && !newType) {
      throw new AppError("There is no updates", 400);
    }

    if (newName && !nameRegex.test(newName)) {
      throw new AppError("The name must contain only letters", 400);
    }

    if (newName && (newName.trim().length > 18 || newName.length < 3)) {
      throw new AppError("The name must have between 3 and 18 letters", 400);
    }

    const expensesUpdateData: Prisma.ExpensesUpdateInput = {};

    if (newName) {
      expensesUpdateData.name = newName;
    }

    //undefined pentru ca poate sa nu existe
    let numericAddAmount: number | undefined; //am nevoie sa o instantiez in afara if-ului pentru a o putea vedea si folosi pentru update budget in caz ca aceasta exista
    if (addAmount) {
      numericAddAmount = parseFloat(addAmount);

      if (isNaN(numericAddAmount)) {
        //daca nu e numar dam eroare isNaN da true daca nu e numar
        throw new AppError("The amount must be a number", 400);
      }

      if (numericAddAmount <= 0) {
        throw new AppError("The amount must be greater then 0", 400);
      }

      expensesUpdateData.amount = {
        increment: numericAddAmount,
      };
    }

    if (newType) {
      expensesUpdateData.type = newType as ExpensesType;
    }

    const expensesUpdateResult = await db.$transaction(async (tx) => {
      const updatedExpenses = await tx.expenses.update({
        where: { id: expensesId },
        data: expensesUpdateData,
      });

      if (!updatedExpenses) {
        throw new AppError("The expenses doesn'n exist", 400);
      }

      //daca exista un + la amount-ul expenses-ului existent il scadem din baza de date si de la budget
      if (numericAddAmount) {
        if (!updatedExpenses.budgetId) {
          throw new AppError("The expenses doesn't have a budget", 404);
        }

        await tx.budget.update({
          where: { id: updatedExpenses.budgetId },
          data: {
            amount: {
              decrement: numericAddAmount,
            },
          },
        });
      }
      return updatedExpenses;
    });

    sendSuccess(res, expensesUpdateResult, "Update succesfully");
  },
);
