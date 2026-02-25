import { Response } from "express";
import { envs } from "../config/envs";

//din cauza basic value la message si status un trebuie sa il scriu in permanenta daca acesta este statusul
export const sendSuccess = (
  res: Response,
  data: any,
  message: string = "Success",
  status: number = 200,
) => {
  res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string = "Internal server error",
  status: number = 500,
  error: any = null,
) => {
  res.status(status).json({
    success: false,
    message,
    error: envs.NODE_ENV === "development" ? error : undefined, //daca sunt in development sa imi afiseze eroarea daca nu sa nu o afiseze
  });
};
