// init-db.ts
import { sql } from "./db";

async function createAgentTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS "agent" (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      title_data BYTEA,
      prompt TEXT NOT NULL,
      prompt_data BYTEA,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

export async function alterAgentTable() {
  await sql`
    ALTER TABLE agent
      ADD COLUMN prompt_data BYTEA,
      ADD COLUMN title_data BYTEA;
  `;
}

export async function initDb() {
  const tables = {
    agent: createAgentTable,
  };

  for (const table of Object.values(tables)) {
    await table();
  }

  // await alterAgentTable();
}
