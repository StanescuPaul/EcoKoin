import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

//Prisma 7 are nevoie de adapter pentru a functiona
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const db = new PrismaClient({ adapter });

export default db;
