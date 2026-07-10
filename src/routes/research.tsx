import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Search, Upload, FileText, X } from "lucide-react";
import { runAssistant } from "@/lib/assistant.functions";
import { OutputBlock } from "@/components/output-block";

type UploadedFile = { data: string; mimeType: string; name: string };

function countWords(s: string): number {
  const t = s.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return btoa(binary);
}

async function extractTextFromDocx(file: File): Promise<string> {
  const mammoth: any = await import("mammoth/mammoth.browser" as any);
  const buf = await file.arrayBuffer();
  const res = await mammoth.extractRawText({ arrayBuffer: buf });
  return (res.value as string).trim();
}

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — ProRedy AI" },
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
  const [uploaded, setUploaded] = useState<UploadedFile | null>(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");

  const inputWords = useMemo(
    () => countWords(content) + (uploaded ? Math.max(1, 0) : 0),
    [content, uploaded],
  );
  const outputWords = useMemo(() => countWords(output), [output]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setParsing(true);
    setError("");
    try {
      const name = file.name.toLowerCase();
      // PDF and images: send to AI multimodally for full understanding of tables/figures/charts
      if (name.endsWith(".pdf") || file.type.startsWith("image/")) {
        const data = await fileToBase64(file);
        setUploaded({
          data,
          mimeType: file.type || (name.endsWith(".pdf") ? "application/pdf" : "application/octet-stream"),
          name: file.name,
        });
      } else if (name.endsWith(".docx")) {
        const text = await extractTextFromDocx(file);
        if (!text) throw new Error("No readable text found in this document.");
        setContent((prev) => (prev ? prev + "\n\n" + text : text));
        setUploaded({ data: "", mimeType: "text/plain", name: file.name });
      } else {
        const text = (await file.text()).trim();
        if (!text) throw new Error("File is empty.");
        setContent((prev) => (prev ? prev + "\n\n" + text : text));
        setUploaded({ data: "", mimeType: "text/plain", name: file.name });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read this file.");
    } finally {
      setParsing(false);
    }
  }

  function clearFile() {
    setUploaded(null);
  }

  async function generate() {
    const hasFile = !!(uploaded && uploaded.data);
    if (!content.trim() && !hasFile) return;
    setLoading(true);
    setError("");
    try {
      const payload: {
        content?: string;
        file?: { data: string; mimeType: string; name: string };
      } = { content };
      if (hasFile && uploaded) payload.file = uploaded;
      const res = await run({ data: { kind: "research", payload } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const canGenerate = (!!content.trim() || !!(uploaded && uploaded.data)) && !loading && !parsing;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" /> AI Research Assistant
          </CardTitle>
          <CardDescription>
            Paste text or upload a document (PDF, DOCX, TXT, MD, images) to get a plain-language
            summary, insights, key topics, and a practical recommendation. Tables, figures, and
            charts in PDFs and images are analyzed directly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor="content">Content or topic</Label>
              <div className="flex items-center gap-2">
                {uploaded && (
                  <span className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    {uploaded.name}
                    <button
                      type="button"
                      onClick={clearFile}
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
                      accept=".pdf,.docx,.txt,.md,.csv,.json,image/*,text/*"
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
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Input word count: {inputWords}</span>
              {uploaded && uploaded.data && (
                <span>+ attached {uploaded.mimeType.startsWith("image/") ? "image" : "PDF"} analyzed directly</span>
              )}
            </div>
          </div>
          <Button onClick={generate} disabled={!canGenerate}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Summarise
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {(output || loading) && (
            <div className="text-xs text-muted-foreground">Summary word count: {outputWords}</div>
          )}
          <OutputBlock text={output} onChange={setOutput} onRegenerate={generate} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
