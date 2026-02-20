import express from "express";
import authRoutes from "./routes/authRoutes";
import { globalHandler } from "./middleware/globalHandler";

const app = express();

app.use(express.json());

app.use("/api", authRoutes);

app.use(globalHandler); // aici se arunca erorile din globalCatch

export default app;
