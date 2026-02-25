import express from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { globalHandler } from "./middleware/globalHandler";

const app = express();

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/user/:userId", userRoutes);

app.use(globalHandler); // aici se arunca erorile din globalCatch

export default app;
