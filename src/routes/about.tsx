import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — AI Workplace Productivity Assistant" },
      { name: "description", content: "Learn about the AI Workplace Productivity Assistant." },
      { property: "og:title", content: "About — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Learn about the AI Workplace Productivity Assistant." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" /> About
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-foreground">
          <p>
            <strong>AI Workplace Productivity Assistant</strong> is an AI-powered web application
            designed to improve workplace productivity by helping professionals automate everyday
            tasks such as writing emails, organising work schedules, and summarising research.
          </p>
          <p>
            This application demonstrates practical AI use, prompt engineering, and workplace
            productivity in a clean, modern interface.
          </p>
          <p className="text-muted-foreground">Version 1.0</p>
        </CardContent>
      </Card>
    </div>
  );
}
