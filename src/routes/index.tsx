import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CalendarDays, Search, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      { name: "description", content: "Welcome to the AI Workplace Productivity Assistant. Pick a tool to get started." },
      { property: "og:title", content: "Dashboard — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Welcome to the AI Workplace Productivity Assistant. Pick a tool to get started." },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    title: "Smart Email Generator",
    description: "Draft professional emails with the right tone for clients, managers, or teammates.",
    href: "/email" as const,
    icon: Mail,
  },
  {
    title: "AI Task Planner",
    description: "Turn a list of tasks with deadlines into a prioritized plan and daily schedule.",
    href: "/planner" as const,
    icon: CalendarDays,
  },
  {
    title: "AI Research Assistant",
    description: "Paste an article or upload a document to get a plain-language summary and insights.",
    href: "/research" as const,
    icon: Search,
  },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <section className="rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Welcome to AI Workplace Productivity Assistant
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          Improve workplace productivity using AI-powered tools that help generate professional
          emails, organise tasks, and simplify research.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">Select a tool below or from the sidebar to get started.</p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Card key={t.href} className="group transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <t.icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">{t.title}</CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" className="w-full">
                <Link to={t.href}>
                  Open Tool <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
