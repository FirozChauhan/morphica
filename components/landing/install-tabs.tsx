"use client";

// Hero command widget, mirroring the opencode.ai hero: a bordered,
// copyable one-liner with the host highlighted bright. Ships the clone
// command for the repo.
import { useState } from "react";
import { Check, Copy } from "lucide-react";

const COMMAND = "git clone https://github.com/FirozChauhan/morphica.git";

// Split the command so the URL renders bright (font-medium) while the rest
// stays dim — exactly how opencode highlights the host in its commands.
function highlight(cmd: string): { text: string; bright: boolean }[] {
  const parts = cmd.split(/(https?:\/\/[^\s]+)/g);
  return parts.filter(Boolean).map((text) => ({ text, bright: text.startsWith("http") }));
}

export function InstallTabs() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className="inline-flex w-full max-w-[560px] flex-col rounded-md border border-border bg-surface max-md:max-w-full">
      <button
        type="button"
        onClick={copy}
        className="group flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3.5 text-left"
      >
        <code className="overflow-x-auto text-sm whitespace-nowrap text-muted-foreground">
          {highlight(COMMAND).map((part, i) => (
            <span key={i} className={part.bright ? "font-medium text-foreground" : undefined}>
              {part.text}
            </span>
          ))}
        </code>
        {copied ? (
          <Check className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <Copy className="size-4 shrink-0 text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100" />
        )}
      </button>
    </div>
  );
}
