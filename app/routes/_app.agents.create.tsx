import { Form, MetaFunction, redirect } from "@remix-run/react";
import { ActionFunction } from "@remix-run/node";
import { Alert, Box, Button, Textarea, TextInput } from "@mantine/core";
import { createAgent } from "../utils/models";

export const meta: MetaFunction = () => {
  return [{ title: "Create agent" }];
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();

  const title = String(body.get("title"));
  const prompt = String(body.get("prompt"));

  if (!title || !prompt) {
    return new Response("Missing title or prompt", {
      status: 400,
    });
  }

  const agent = await createAgent({ title, prompt });

  if (agent) {
    return redirect("/agents");
  }
};

export const loader = async () => {
  return { agent: null };
};

export default function AgentCreatePage() {
  return (
    <Form method="post">
      <Box w={400}>
        <h2>Create agent</h2>

        <TextInput label="Agent name" name="title" required />
        <Textarea label="Prompt" name="prompt" mt={10} required />

        <Alert color="orange" my={10}>
          After creation the editor will not contain the typed values, because i
          had no time to convert this text into the ydoc format
        </Alert>

        <Button type="submit" mt={10}>
          Create agent
        </Button>
      </Box>
    </Form>
  );
}
