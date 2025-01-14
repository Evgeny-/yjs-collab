import { MetaFunction, NavLink, useLoaderData } from "@remix-run/react";
import { Anchor, Box } from "@mantine/core";
import { getAgents } from "../utils/models";

export const meta: MetaFunction = () => {
  return [{ title: "Agents" }];
};

export const loader = async () => {
  const agents = await getAgents();

  return { agents };
};

export default function AgentCreatePage() {
  const { agents } = useLoaderData<typeof loader>();

  return (
    <Box>
      <h2>Agents</h2>
      <ul>
        {agents.map((agent) => (
          <li key={agent.id}>
            <Anchor component={NavLink} to={`/agents/${agent.id}`}>
              {agent.title || <i>Untitled</i>}
            </Anchor>
          </li>
        ))}
      </ul>
    </Box>
  );
}
