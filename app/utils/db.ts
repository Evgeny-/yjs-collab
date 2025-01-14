import postgres from "postgres";
import { initDb } from "./init-db";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const sql = postgres(process.env.DATABASE_URL, {});

initDb();
