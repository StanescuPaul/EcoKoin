import { budgetGet } from "../controllers/budgetController";
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, budgetGet);

export default router;
