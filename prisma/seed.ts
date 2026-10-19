import { PrismaClient } from "@prisma/client";
import { ensureDefaultCategories } from "../src/lib/categories";

const db = new PrismaClient();

ensureDefaultCategories(db)
  .then(() => console.log("Default categories ready"))
  .finally(() => db.$disconnect());
