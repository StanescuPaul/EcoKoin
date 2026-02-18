export const envs = {
  PORT: process.env.PORT || "3000",
  DATABASE_URL: process.env.DATABASE_URl,
  NODE_ENV: process.env.NODE_ENV || "development",
};

if (!envs.DATABASE_URL) {
  throw new Error("ERROR: DATABASE_URL is missing!");
}
