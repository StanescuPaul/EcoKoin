import { Router } from "express";
import { userProfile } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/profile", authMiddleware, userProfile);

export default router;
