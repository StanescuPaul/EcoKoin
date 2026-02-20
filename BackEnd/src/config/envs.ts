import dotenv from "dotenv";
dotenv.config();

export const envs = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "",
};

if (!envs.DATABASE_URL) {
  throw new Error("ERROR: DATABASE_URL is missing!");
}

if (!envs.JWT_SECRET) {
  throw new Error("ERROR: JWT is missing!");
}
