import express from "express";
import { globalHandler } from "./middleware/globalHandler";

const app = express();

app.use(express.json());

app.use(globalHandler); // aici se arunca erorile din throwController

export default app;
