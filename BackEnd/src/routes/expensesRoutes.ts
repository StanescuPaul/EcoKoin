import { Router } from "express";
import express from "express";
import { expensesGet, expensesCreate } from "../controllers/expensesController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router({ mergeParams: true }); //pentru ca ruta sa poata vedea in req.params parametrii din app.ts

router.get("/expenses", authMiddleware, expensesGet);
router.post("/expenses", authMiddleware, expensesCreate);

export default router;
