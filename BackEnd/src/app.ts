import express from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import budgetRoutes from "./routes/budgetRoutes";
import expensesRoutes from "./routes/expensesRoutes";
import { globalHandler } from "./middleware/globalHandler";

const app = express();

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/users/:userId", userRoutes);
app.use("/api/users/:userId/budgets", budgetRoutes);
app.use("/api/budgets/:budgetId", expensesRoutes);
app.use("/api", expensesRoutes); //pentru a nu lungi prea mult rutele si pentru frontend si pentru backend

app.use(globalHandler); // aici se arunca erorile din globalCatch

export default app;
