import { Request, Response } from "express";
import { sendSuccess } from "../utils/responseHandler";
import { AppError } from "../utils/appError";
import { globalCatch } from "../utils/throwController";
import { envs } from "../config/envs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../config/db";

interface authInterface {
  email: string;
  password: string;
}

const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = globalCatch(async (req: Request, res: Response) => {
  const { email, password }: authInterface = req.body;
  const salt: number = 10;

  if (!emailRegex.test(email)) {
    throw new AppError("The email is not valid", 400);
  }

  const existingEmail = await db.user.findUnique({
    where: { email: email },
  });

  if (existingEmail) {
    throw new AppError("The email is allready used", 400);
  }

  if (!password || password.length < 12) {
    throw new AppError("Password must contain 12 characters", 400);
  }

  const hashedPassword: string = await bcrypt.hash(password, salt);

  const user = await db.user.create({
    data: {
      email: email,
      password: hashedPassword,
    },
  });

  return sendSuccess(res, user, "Account succesfully created", 201);
});

export const login = globalCatch(async (req: Request, res: Response) => {
  const { email, password }: authInterface = req.body;

  if (!email || !password) {
    throw new AppError("Email or password is missing", 400);
  }

  if (!emailRegex.test(email)) {
    throw new AppError("Invalide email", 400);
  }

  const user = await db.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user || !user.password) {
    throw new AppError("Invalide email or password", 400);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new AppError("invalide email or password", 400);
  }

  const payload = {
    userId: user.id,
  };

  const token = jwt.sign(payload, envs.JWT_SECRET, { expiresIn: "30d" });

  const userLoginData = {
    id: user.id,
    token: token,
  };

  return sendSuccess(res, userLoginData, "Login succesfully", 200);
});
