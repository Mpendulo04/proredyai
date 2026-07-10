import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Mail } from "lucide-react";
import { runAssistant } from "@/lib/assistant.functions";
import { OutputBlock } from "@/components/output-block";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — ProRedy AI" },
      { name: "description", content: "Generate professional emails tailored to your audience and tone." },
      { property: "og:title", content: "Smart Email Generator" },
      { property: "og:description", content: "Generate professional emails tailored to your audience and tone." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const run = useServerFn(runAssistant);
  const [topic, setTopic] = useState("");
  const [recipient, setRecipient] = useState("client");
  const [tone, setTone] = useState("formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
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
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" /> Smart Email Generator
          </CardTitle>
          <CardDescription>Draft a professional email tailored to your recipient and tone.</CardDescription>
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
              <Label>Audience</Label>
              <Select value={recipient} onValueChange={setRecipient}>
                <SelectTrigger><SelectValue /></SelectTrigger>
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
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="informal">Informal</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={generate} disabled={loading || !topic.trim()}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Email
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <OutputBlock text={output} onChange={setOutput} onRegenerate={generate} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
