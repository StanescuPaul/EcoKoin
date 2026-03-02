import express from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import budgetRoutes from "./routes/budgetRoutes";
import { globalHandler } from "./middleware/globalHandler";

const app = express();

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/users/:userId", userRoutes);
app.use("/api/users/:userId/budgets", budgetRoutes);

app.use(globalHandler); // aici se arunca erorile din globalCatch

export default app;
