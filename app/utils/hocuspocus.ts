/* eslint-disable @typescript-eslint/no-explicit-any */
import { Hocuspocus, onChangePayload } from "@hocuspocus/server";
import { TiptapTransformer } from "@hocuspocus/transformer";
import { Database } from "@hocuspocus/extension-database";
import { getAgent, updateAgent } from "./models";

export function setupHocuspocus() {
  if (globalThis._hocuspocus) {
    globalThis._hocuspocus.destroy();
    console.log("Hocuspocus destroyed");
  }

  const server = (global._hocuspocus = new Hocuspocus({
    port: 3010,
    extensions: [
      new Database({
        fetch: async ({ documentName }) => {
          const [docType, docId, docField] = documentName.split("-");

          if (docType === "agent") {
            const agent = await getAgent(Number(docId));
            if (!agent) return null;
            if (!["title", "prompt"].includes(docField)) return null;

            const data =
              agent[(docField + "_data") as "title_data" | "prompt_data"];

            return data as Buffer;
          }

          return null;
        },
        store: async ({ documentName, state, document }) => {
          const [docType, docId, docField] = documentName.split("-");

          if (docType === "agent") {
            const agent = await getAgent(Number(docId));
            if (!agent) return;
            if (!["title", "prompt"].includes(docField)) return;

            const documentJson = TiptapTransformer.fromYdoc(document);
            const inlineContent = getDocumentContent(documentJson, true);
            if (!inlineContent) return;

            await updateAgent(agent.id, {
              ...agent,
              [docField]: inlineContent,
              [docField + "_data"]: state,
            });
          }
        },
      }),
    ],
    onChange: handleDataChange,
  }));

  server.listen();
}

async function handleDataChange(data: onChangePayload) {
  //   console.log("Data changed", data);
  const [docType, docId, docField] = data.documentName.split("-");
  const documentJson = TiptapTransformer.fromYdoc(data.document);

  if (docType === "agent") {
    const agent = await getAgent(Number(docId));

    if (!agent) {
      return;
    }

    if (!["title", "prompt"].includes(docField)) {
      return;
    }

    const inlineContent = getDocumentContent(documentJson, true);

    if (!inlineContent) {
      return;
    }

    await updateAgent(agent.id, {
      ...agent,
      [docField]: getDocumentContent(documentJson, docField === "title"),
    });
  }
}

function getDocumentContent(documentJson: any, isInline: boolean) {
  if (isInline) {
    return (
      documentJson?.default?.content?.reduce((acc: string, node: any) => {
        return acc + (node?.content?.[0]?.text || "");
      }, "") || ""
    );
  }

  return JSON.stringify(documentJson);
}
