/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-named-as-default */
import "./styles.css";

import { HocuspocusProvider } from "@hocuspocus/provider";
import { EditorContent, Extension, useEditor } from "@tiptap/react";
import Collaboration from "@tiptap/extension-collaboration";
import * as Y from "yjs";
import { useEffect, useMemo, useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { Box, Button, Flex } from "@mantine/core";
import { Agent } from "../utils/models";
import { useAppContext } from "../utils/app-context";
import { Form } from "@remix-run/react";

export function AgentEditor({ agent }: { agent: Agent }) {
  const { username } = useAppContext();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const me = useMemo(
    () => ({
      name: username,
      color: getRandomColor(),
    }),
    [username]
  );

  return (
    isReady && (
      <Box>
        <h2>Edit agent</h2>

        <Box>
          <b>Title (it should be inline in future)</b>
          <AgentPrompt agentId={agent.id} user={me} name="title" isInline />
        </Box>

        <Box mt={10}>
          <b>Prompt</b>
          <AgentPrompt agentId={agent.id} user={me} name="prompt" />
        </Box>

        <Flex mt={20}>
          <Box fz={12}>
            Created at {new Date(agent.createdAt).toLocaleString()}
            <br />
            Updated at {new Date(agent.updatedAt).toLocaleString()}
          </Box>
          <div className="spacer"></div>
          <Form method="post">
            <Button
              size="xs"
              color="red"
              variant="outline"
              type="submit"
              name="delete"
              value="true"
            >
              Delete agent
            </Button>
          </Form>
        </Flex>
      </Box>
    )
  );
}

export function AgentPrompt({
  isInline,
  name,
  agentId,
  user,
}: {
  isInline?: boolean;
  name: "title" | "prompt";
  agentId: number;
  user: { name: string; color: string };
}) {
  const doc = useMemo(() => new Y.Doc(), []);

  const [provider] = useState(() => {
    const provider = new HocuspocusProvider({
      url: "ws://127.0.0.1:3010",
      name: `agent-${agentId}-${name}`,
      document: doc,
    });

    // provider.on("awarenessChange", (data: { states: unknown }) => {
    //   console.log("awarenessChange", data.states);
    // });

    return provider;
  });

  useEffect(() => {
    provider.setAwarenessField("user", user);
  }, [provider, user]);

  const extensions = [
    isInline
      ? StarterKit.configure({
          // history: false,
          heading: false,
        })
      : StarterKit.configure({
          // history: false,
          heading: {
            levels: [1, 2],
          },
        }),
    Collaboration.configure({
      document: doc,
    }),
    CollaborationCursor.configure({
      provider,
      user,
    }),
  ]
    .flat()
    .filter(Boolean) as Extension[];

  const editor = useEditor({
    extensions,
  });

  useEffect(() => {
    return () => {
      provider.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <button
        onClick={() => editor?.chain().focus().undo().run()}
        disabled={!editor?.can().undo()}
      >
        Undo
      </button>
      <button
        onClick={() => editor?.chain().focus().redo().run()}
        disabled={!editor?.can().redo()}
      >
        Redo
      </button>

      <EditorContent editor={editor} />
    </div>
  );
}

function getRandomColor() {
  const palette = [
    "#FF6B6B", // red-ish
    "#FFB627", // orange-ish
    "#FFD84D", // yellow-ish
    "#78E08F", // green-ish
    "#1DD3B0", // teal-ish
    "#34ACE0", // light blue-ish
    "#227093", // darker blue
    "#A55EEA", // purple-ish
    "#B33771", // magenta-ish
    "#CD84F1", // lavender-ish
  ];
  return palette[Math.floor(Math.random() * palette.length)];
}
