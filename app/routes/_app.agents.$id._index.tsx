import { MetaFunction, redirect, useLoaderData } from "@remix-run/react";
import { AgentEditor } from "../agent/agent.client";
import { deleteAgent, getAgent } from "../utils/models";
import { ActionFunction, LoaderFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Agent", description: "Welcome to React Router!" }];
};

export const action: ActionFunction = async ({ request, params }) => {
  const body = new URLSearchParams(await request.text());

  if (body.get("delete")) {
    await deleteAgent(Number(params.id));
  }

  return redirect("/agents");
};

export const loader: LoaderFunction = async ({ params }) => {
  const agent = await getAgent(Number(params.id));

  if (!agent) {
    return new Response("Not found", { status: 404 });
  }

  return { agent };
};

export default function AgentPage() {
  const { agent } = useLoaderData<typeof loader>();

  return <AgentEditor agent={agent} />;
}
