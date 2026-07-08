import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Copy, Check, Mail, FileText, ListChecks, BookOpen } from "lucide-react";
import { runAssistant } from "@/lib/assistant.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "AI-powered workplace assistant: draft emails, summarize meeting notes, plan tasks, and research topics.",
      },
      { property: "og:title", content: "Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarize meetings, plan your day, and research topics with an AI workplace assistant.",
      },
    ],
  }),
  component: Home,
});

function Disclaimer() {
  return (
    <p className="mt-6 text-center text-xs text-muted-foreground">
      AI-generated content — please review before use.
    </p>
  );
}

function OutputBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  if (!text) return null;
  return (
    <div className="mt-6 rounded-lg border bg-muted/30 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Result</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
        {text}
      </pre>
    </div>
  );
}

function EmailTab() {
  const run = useServerFn(runAssistant);
  const [topic, setTopic] = useState("");
  const [recipient, setRecipient] = useState("client");
  const [tone, setTone] = useState("formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await run({ data: { kind: "email", payload: { topic, recipient, tone } } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" /> Email Generator
        </CardTitle>
        <CardDescription>
          Draft a professional email tailored to your recipient and tone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">What is the email about?</Label>
          <Textarea
            id="topic"
            placeholder="E.g. Follow up on last week's proposal and ask for a decision by Friday."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={3}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Who is it for?</Label>
            <Select value={recipient} onValueChange={setRecipient}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="team">Team</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="informal">Informal</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleGenerate} disabled={loading || !topic.trim()}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <OutputBlock text={output} />
        <Disclaimer />
      </CardContent>
    </Card>
  );
}

function SummaryTab() {
  const run = useServerFn(runAssistant);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSummarize() {
    if (!notes.trim()) return;
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await run({ data: { kind: "summary", payload: { notes } } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" /> Meeting Notes Summarizer
        </CardTitle>
        <CardDescription>
          Paste raw meeting notes and get a summary, decisions, and action items.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notes">Meeting notes</Label>
          <Textarea
            id="notes"
            placeholder="Paste your meeting notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={10}
          />
        </div>
        <Button onClick={handleSummarize} disabled={loading || !notes.trim()}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Summarize
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <OutputBlock text={output} />
        <Disclaimer />
      </CardContent>
    </Card>
  );
}

function PlannerTab() {
  const run = useServerFn(runAssistant);
  const [tasks, setTasks] = useState("");
  const [timeframe, setTimeframe] = useState("today");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePlan() {
    if (!tasks.trim()) return;
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await run({ data: { kind: "plan", payload: { tasks, timeframe } } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="h-5 w-5" /> Task Planner
        </CardTitle>
        <CardDescription>
          List your tasks and get a prioritized plan with scheduling tips.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tasks">Your tasks (one per line)</Label>
          <Textarea
            id="tasks"
            placeholder={"Finish Q3 report\nCall supplier about delayed shipment\nPrep slides for Thursday review"}
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            rows={8}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timeframe">Timeframe</Label>
          <Input
            id="timeframe"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            placeholder="today / this week"
          />
        </div>
        <Button onClick={handlePlan} disabled={loading || !tasks.trim()}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Plan
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <OutputBlock text={output} />
        <Disclaimer />
      </CardContent>
    </Card>
  );
}

function ResearchTab() {
  const run = useServerFn(runAssistant);
  const [content, setContent] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSummarize() {
    if (!content.trim()) return;
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await run({ data: { kind: "research", payload: { content } } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" /> AI Research Assistant
        </CardTitle>
        <CardDescription>
          Paste an article, report, or topic description and get a plain-language summary, key insights, and a recommendation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="content">Content or topic</Label>
          <Textarea
            id="content"
            placeholder="Paste an article, report, or describe a topic you want to understand..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
          />
        </div>
        <Button onClick={handleSummarize} disabled={loading || !content.trim()}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Summarize
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <OutputBlock text={output} />
        <Disclaimer />
      </CardContent>
    </Card>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Workplace Productivity Assistant
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Draft emails, summarize meetings, plan your day, and research topics — all in one place.
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">
        <Tabs defaultValue="email">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="summary">Meeting Notes</TabsTrigger>
            <TabsTrigger value="planner">Task Planner</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
          </TabsList>
          <TabsContent value="email" className="mt-6">
            <EmailTab />
          </TabsContent>
          <TabsContent value="summary" className="mt-6">
            <SummaryTab />
          </TabsContent>
          <TabsContent value="planner" className="mt-6">
            <PlannerTab />
          </TabsContent>
          <TabsContent value="research" className="mt-6">
            <ResearchTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
