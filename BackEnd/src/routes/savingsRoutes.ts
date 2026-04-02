import { Router } from "express";
import { savingsCreate, savingsGet } from "../controllers/savingsController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/savings", authMiddleware, savingsGet);
router.post("/savings", authMiddleware, savingsCreate);

export default router;
