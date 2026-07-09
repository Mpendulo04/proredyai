import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const TaskSchema = z.object({
  name: z.string(),
  deadline: z.string().optional().default(""),
  priority: z.enum(["High", "Medium", "Low"]).default("Medium"),
});

const Input = z.object({
  kind: z.enum(["email", "summary", "plan", "research"]),
  payload: z.object({
    // email
    topic: z.string().optional(),
    recipient: z.string().optional(),
    tone: z.string().optional(),
    // summary
    notes: z.string().optional(),
    // plan
    tasks: z.array(TaskSchema).optional(),
    timeframe: z.string().optional(),
    // research
    content: z.string().optional(),
  }),
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
    const p = data.payload;

    if (data.kind === "email") {
      system =
        "You are a professional workplace writing assistant. Write a complete, ready-to-send email. Include a clear Subject line (prefix with 'Subject: '), a greeting, a professional body, and a closing/sign-off. Use a concise, workplace-appropriate style. Respond ONLY with the email itself, no preamble or explanation.";
      prompt = `Write an email.\nTopic: ${p.topic}\nAudience: ${p.recipient}\nTone: ${p.tone}`;
    } else if (data.kind === "summary") {
      system =
        "You summarize meeting notes for busy professionals. Respond in Markdown with exactly three sections: '## Summary' (a short paragraph), '## Key Decisions' (bulleted), and '## Action Items' (bulleted, each item includes the responsible person in **bold** if identifiable). Use simple, direct language.";
      prompt = `Summarize these meeting notes:\n\n${p.notes}`;
    } else if (data.kind === "research") {
      system =
        "You are a research assistant. Read the provided content and explain it in plain, simple language — no jargon. Respond in Markdown with exactly these four sections in this order: '## Short Summary' (a short paragraph), '## Key Insights' (bulleted), '## Key Topics' (bulleted, short labels), and '## Practical Recommendation' (one short paragraph with concrete advice).";
      prompt = `Content to analyze:\n\n${p.content}`;
    } else {
      system =
        "You are a workplace productivity coach. Given a list of tasks with deadlines and priorities, produce a prioritized plan and a suggested schedule. Respond in Markdown with exactly these three sections in this order: '## Prioritised Tasks' (numbered list, most urgent first, each with a short rationale referencing deadline/priority), '## Suggested Daily Schedule' (bulleted time blocks), and '## Productivity Tip' (one short, practical tip). Use simple, professional language.";
      const taskLines =
        (p.tasks ?? [])
          .map(
            (t, i) =>
              `${i + 1}. ${t.name} — priority: ${t.priority}${t.deadline ? `, deadline: ${t.deadline}` : ""}`,
          )
          .join("\n") || "(none)";
      prompt = `Tasks:\n${taskLines}\n\nTimeframe: ${p.timeframe || "today"}`;
    }

    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system,
      prompt,
    });

    return { text };
  });
