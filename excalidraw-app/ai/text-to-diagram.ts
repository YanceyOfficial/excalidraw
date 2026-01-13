import { z } from "zod";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { EDITOR_LS_KEYS } from "@excalidraw/common";

function getOpenAIClient() {
  const apiKey = window.localStorage.getItem(EDITOR_LS_KEYS.OAI_API_KEY);
  if (!apiKey) {
    throw new Error(
      "OpenAI API key missing. Please set it via the OpenAI key settings in the top-right of the app.",
    );
  }
  return createOpenAI({ apiKey });
}

export const MermaidSchema = z.object({
  mermaid: z
    .string()
    .describe("Pure Mermaid syntax compatible with Excalidraw"),
});

const PROMPT = `
You are an expert system designer and technical diagramming assistant.

Generate a valid, clean, and Excalidraw-compatible Mermaid diagram.

Rules:SYSTEM_
- Output ONLY Mermaid syntax
- Do NOT include explanations, comments, or Markdown fences
- Use only Mermaid diagram types supported by Excalidraw:
  - flowchart
  - sequenceDiagram
  - stateDiagram
  - classDiagram
- Use simple node shapes (rectangles, diamonds, rounded boxes)
- Keep node labels concise, technical, and plain text
- Avoid advanced Mermaid features:
  - No custom styling, themes, or CSS
  - No inline HTML
  - No complex subgraph nesting
- Ensure a clear and logical layout (top-down or left-right)
- Prioritize readability and structural correctness

Return the result strictly in the required JSON format.
`.trim();

export async function generateMermaidDiagram(description: string) {
  const client = getOpenAIClient();

  const result = await generateObject({
    model: client("gpt-4.1-mini"),
    schema: MermaidSchema,
    system: PROMPT,
    prompt: `
Diagram type: flowchart
Direction: TD

Diagram description:
${description}
`.trim(),
  });

  return { generatedResponse: result.object.mermaid };
}
