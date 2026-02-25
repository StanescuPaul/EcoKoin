import { Router } from "express";
import { register, login, authPersist } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/authPersist", authMiddleware, authPersist);

export default router;
