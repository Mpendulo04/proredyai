import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, RefreshCw, Loader2 } from "lucide-react";

interface Props {
  text: string;
  onChange: (v: string) => void;
  onRegenerate: () => void;
  loading?: boolean;
}

export function OutputBlock({ text, onChange, onRegenerate, loading }: Props) {
  const [copied, setCopied] = useState(false);
  if (!text && !loading) return null;

  return (
    <div className="mt-6 rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Result</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-1">Regenerate</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            disabled={!text}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
          </Button>
        </div>
      </div>
      <Textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        rows={14}
        className="font-sans text-sm leading-relaxed"
        placeholder={loading ? "Generating..." : ""}
      />
      <p className="mt-3 text-center text-xs text-muted-foreground">
        AI-generated content — please review before use.
      </p>
    </div>
  );
}
