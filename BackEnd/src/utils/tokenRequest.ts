import { Request } from "express";

export interface tokenData {
  userId: string;
}
//prin token request extind Request pentru a putea accesa proprietatea de user cand vreau sa cer din payload jwt datele
export interface tokenRequest extends Request {
  user: tokenData;
}
