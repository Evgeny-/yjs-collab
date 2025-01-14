/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from "./db";

export type Agent = {
  id: number;
  title: string;
  title_data?: Buffer;
  prompt: string;
  prompt_data?: Buffer;
  createdAt: Date;
  updatedAt: Date;
};

export async function createAgent(
  agentData: Omit<Agent, "id" | "createdAt" | "updatedAt">
) {
  const [agent] = await sql<Agent[]>`
    INSERT INTO "agent" (
      title, 
      prompt
    ) VALUES (
      ${agentData.title}, 
      ${agentData.prompt}
    )
    RETURNING *
  `;

  return agent;
}

export async function getAgents(): Promise<Agent[]> {
  const agents = await sql<Agent[]>`
    SELECT * FROM "agent"
  `;
  return agents;
}

export async function getAgent(id: number): Promise<Agent | undefined> {
  const [agent] = await sql<Agent[]>`
    SELECT * FROM "agent"
    WHERE id = ${id}
  `;
  return agent;
}

export async function updateAgent(id: number, data: Omit<Agent, "id">) {
  const [agent] = await sql<Agent[]>`
    UPDATE "agent"
    SET 
      title = COALESCE(${data.title}, title),
      prompt = COALESCE(${data.prompt}, prompt),
      title_data = COALESCE(${data.title_data || null}, title_data),
      prompt_data = COALESCE(${data.prompt_data || null}, prompt_data),
      "updatedAt" = now()
    WHERE id = ${id}
    RETURNING *
  `;

  return agent;
}

export async function deleteAgent(id: number) {
  await sql`
    DELETE FROM "agent"
    WHERE id = ${id}
  `;
  return { success: true };
}
