import { Request } from "express";

//tipul de date pe care il poate lua req.user
export interface tokenData {
  userId: string;
}
//prin token request extind Request pentru a putea accesa proprietatea de user cand vreau sa cer din payload jwt datele
export interface tokenRequest extends Request {
  user: tokenData;
}
