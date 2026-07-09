import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI — AI Workplace Productivity Assistant" },
      { name: "description", content: "Responsible AI guidance and privacy notice." },
      { property: "og:title", content: "Responsible AI" },
      { property: "og:description", content: "Responsible AI guidance and privacy notice." },
    ],
  }),
  component: ResponsibleAiPage,
});

function ResponsibleAiPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" /> Responsible AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-foreground">
          <p>This application uses Artificial Intelligence to generate content.</p>
          <p className="font-medium">Users should:</p>
          <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
            <li>Review AI-generated outputs before using them.</li>
            <li>Verify important information.</li>
            <li>Avoid sharing confidential or sensitive information.</li>
            <li>Use AI as an assistant rather than a replacement for professional judgement.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Notice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-foreground">
          <p>This application does not require user registration.</p>
          <p>It does not collect, save or store:</p>
          <ul className="ml-5 list-disc space-y-1 text-muted-foreground">
            <li>user accounts</li>
            <li>passwords</li>
            <li>personal information</li>
            <li>prompts</li>
            <li>generated responses</li>
            <li>task lists</li>
            <li>research summaries</li>
          </ul>
          <p>All interactions exist only during the current browser session.</p>
          <p>Refreshing or closing the browser clears all information.</p>
        </CardContent>
      </Card>
    </div>
  );
}
