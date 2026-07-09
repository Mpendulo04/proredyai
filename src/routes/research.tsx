import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Search, Upload, FileText, X } from "lucide-react";
import { runAssistant } from "@/lib/assistant.functions";
import { OutputBlock } from "@/components/output-block";

async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) {
    const pdfjs: any = await import("pdfjs-dist");
    const workerUrl = (await import("pdfjs-dist/build/pdf.worker.mjs?url" as any)).default;
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
    const buf = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: buf }).promise;
    let out = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      out += content.items.map((it: any) => it.str).join(" ") + "\n\n";
    }
    return out.trim();
  }
  if (name.endsWith(".docx")) {
    const mammoth: any = await import("mammoth/mammoth.browser" as any);
    const buf = await file.arrayBuffer();
    const res = await mammoth.extractRawText({ arrayBuffer: buf });
    return (res.value as string).trim();
  }
  return (await file.text()).trim();
}

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Workplace Productivity Assistant" },
      { name: "description", content: "Summarize articles, reports, or uploaded documents in plain language." },
      { property: "og:title", content: "AI Research Assistant" },
      { property: "og:description", content: "Summarize articles, reports, or uploaded documents in plain language." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const run = useServerFn(runAssistant);
  const [content, setContent] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setParsing(true);
    setError("");
    try {
      const text = await extractTextFromFile(file);
      if (!text) throw new Error("No readable text found in this file.");
      setContent((prev) => (prev ? prev + "\n\n" + text : text));
      setFileName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read this file.");
    } finally {
      setParsing(false);
    }
  }

  async function generate() {
    if (!content.trim()) return;
    setLoading(true);
    setError("");
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
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" /> AI Research Assistant
          </CardTitle>
          <CardDescription>
            Paste text or upload a document (PDF, DOCX, TXT, MD) to get a plain-language summary,
            insights, key topics, and a practical recommendation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor="content">Content or topic</Label>
              <div className="flex items-center gap-2">
                {fileName && (
                  <span className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    {fileName}
                    <button
                      type="button"
                      onClick={() => { setFileName(""); setContent(""); }}
                      className="ml-1 hover:text-foreground"
                      aria-label="Clear file"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <Button asChild variant="outline" size="sm" disabled={parsing}>
                  <label className="cursor-pointer">
                    {parsing ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Upload className="mr-1 h-4 w-4" />}
                    {parsing ? "Reading..." : "Upload document"}
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt,.md,.csv,.json,text/*"
                      className="hidden"
                      onChange={handleFile}
                      disabled={parsing}
                    />
                  </label>
                </Button>
              </div>
            </div>
            <Textarea
              id="content"
              placeholder="Paste an article, report, or describe a topic — or upload a document above..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
            />
          </div>
          <Button onClick={generate} disabled={loading || parsing || !content.trim()}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Summarise
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <OutputBlock text={output} onChange={setOutput} onRegenerate={generate} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
