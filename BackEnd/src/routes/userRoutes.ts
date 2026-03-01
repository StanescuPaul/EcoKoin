import { Router } from "express";
import { userProfile } from "../controllers/userController";
import { userProfileUpdate } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/profile", authMiddleware, userProfile);
router.put("/profile", authMiddleware, userProfileUpdate);

export default router;
