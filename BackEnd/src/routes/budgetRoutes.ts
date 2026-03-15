import {
  budgetGet,
  budgetCreate,
  budgetUpdate,
  budgetDelete,
} from "../controllers/budgetController";
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, budgetGet);
router.post("/", authMiddleware, budgetCreate);
router.put("/:budgetId", authMiddleware, budgetUpdate);
router.delete("/:budgetId", authMiddleware, budgetDelete);

export default router;
