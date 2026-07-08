import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const Input = z.object({
  kind: z.enum(["email", "summary", "plan", "research"]),
  payload: z.record(z.string(), z.string()),
});

export const runAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    let system = "";
    let prompt = "";

    if (data.kind === "email") {
      system =
        "You are a professional writing assistant. Write complete, ready-to-send emails including subject line, greeting, body, and sign-off. Respond ONLY with the email itself, no preamble.";
      prompt = `Write an email.\nTopic: ${data.payload.topic}\nRecipient: ${data.payload.recipient}\nTone: ${data.payload.tone}`;
    } else if (data.kind === "summary") {
      system =
        "You summarize meeting notes. Respond in Markdown with exactly three sections using these headings: '## Summary' (a short paragraph), '## Key Decisions' (bulleted), and '## Action Items' (bulleted, each item includes the responsible person in **bold** if identifiable).";
      prompt = `Summarize these meeting notes:\n\n${data.payload.notes}`;
    } else if (data.kind === "research") {
      system =
        "You are a research assistant. Summarize the provided content in plain language, list the key insights, and give a simple, practical recommendation. Avoid jargon. Respond in Markdown with exactly these headings: '## Summary' (a short paragraph), '## Key Insights' (bulleted), and '## Recommendation' (one short paragraph).";
      prompt = `Content to analyze:\n\n${data.payload.content}`;
    } else {
      system =
        "You are a productivity coach. Given a list of tasks, prioritize them (most urgent first) and produce a schedule. Respond in Markdown with '## Prioritized Tasks' (numbered list, each with a short rationale) and '## Scheduling Tips' (bulleted).";
      prompt = `Tasks:\n${data.payload.tasks}\n\nTimeframe: ${data.payload.timeframe || "today"}`;
    }

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system,
      prompt,
    });

    return { text };
  });
