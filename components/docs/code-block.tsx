"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

// Code block styled like the opencode.ai/docs blocks: surface background,
// hairline border, small header strip with a quiet copy button.
export function CodeBlock({
  code,
  label,
}: {
  code: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className="max-w-full overflow-hidden rounded-md border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[0.8125rem] leading-6 text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}
