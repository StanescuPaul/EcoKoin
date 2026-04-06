import { Router } from "express";
import {
  savingsCreate,
  savingsGet,
  savingsUpdate,
  savingsDelete,
} from "../controllers/savingsController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/savings", authMiddleware, savingsGet);
router.post("/savings", authMiddleware, savingsCreate);
router.put("/savings/:savingsId", authMiddleware, savingsUpdate);
router.delete("savings/:savingsId", authMiddleware, savingsDelete);

export default router;
