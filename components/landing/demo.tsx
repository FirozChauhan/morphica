"use client";

// Landing-page live demo. Drop/paste an image, pick a width, and watch it go
// through the real /api/demo endpoint. The result comes back as image bytes,
// which I turn into a blob URL for preview + download.
//
// Styled as the full-bleed "product shot" band of the landing page: a
// surface-colored section framed by the page's horizontal rules, with the
// interactive card centered inside it.

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Download,
  ImageIcon,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 3 * 1024 * 1024;

type Preview = { url: string; contentType: string };

function extFromType(type: string): string {
  // Map the response content-type to a file extension for the download name.
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  if (type.includes("gif")) return "gif";
  return "jpg";
}

export function Demo() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [width, setWidth] = useState("240");
  const [result, setResult] = useState<Preview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  // Mirror `width` into a ref so handleProcess() always reads the latest value
  // even though it's not in its dependency list.
  const widthRef = useRef(width);

  useEffect(() => {
    widthRef.current = width;
  }, [width]);

  // Free the object URLs when the component unmounts / they change, so we
  // don't leak memory.
  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      if (result) URL.revokeObjectURL(result.url);
    };
  }, [sourceUrl, result]);

  const reset = useCallback(() => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (result) URL.revokeObjectURL(result.url);
    setSourceUrl(null);
    setResult(null);
    setFile(null);
    setError(null);
    setWidth("240");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [sourceUrl, result]);

  // Validate + stage a chosen file (click, drag, or paste all funnel here).
  const loadFile = useCallback(
    (next: File | null) => {
      if (!next) return;
      if (!ACCEPTED_TYPES.includes(next.type)) {
        setError("Unsupported file type.");
        return;
      }
      if (next.size > MAX_BYTES) {
        setError("File is larger than 3 MB.");
        return;
      }
      setError(null);
      setResult(null); // a new source invalidates the old result
      setFile(next);
      setSourceUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(next); // local preview, no upload yet
      });
    },
    [],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      loadFile(e.dataTransfer.files[0] ?? null);
    },
    [loadFile],
  );

  // Bonus: paste an image straight from the clipboard.
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const item = Array.from(e.clipboardData.items).find((i) =>
        i.type.startsWith("image/"),
      );
      if (item) loadFile(item.getAsFile());
    },
    [loadFile],
  );

  // Send the image to /api/demo and, on success, turn the returned bytes into
  // a blob URL the user can preview and download.
  async function handleProcess() {
    if (!file) {
      setError("Choose an image first.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.append("image", file);
      form.append("width", widthRef.current);

      const res = await fetch("/api/demo", { method: "POST", body: form });

      if (!res.ok) {
        let message = "Processing failed.";
        try {
          const body = await res.json();
          if (body.error === "no_api_key")
            message = "Create an API key in the dashboard first.";
        } catch {
          // keep default message
        }
        setError(message);
        setLoading(false);
        return;
      }

      const blob = await res.blob();
      const contentType = res.headers.get("content-type") ?? blob.type;
      setResult((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { url: URL.createObjectURL(blob), contentType };
      });
    } catch {
      setError("Processing failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 border-t border-border bg-surface px-6 py-14 max-md:py-10">
      <div className="flex w-full max-w-md items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-secondary-foreground">
          <Sparkles className="size-4 text-muted-foreground" />
          Live demo
        </div>
        {sourceUrl && !result && (
          <button
            type="button"
            onClick={reset}
            className="flex cursor-pointer items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-3" />
            Reset
          </button>
        )}
      </div>

      {result ? (
        <div className="w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-300 ease-out">
          <div className="flex h-56 items-center justify-center rounded-md border border-border bg-elevated">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.url}
              alt="Resized result"
              className="max-h-52 max-w-full object-contain"
            />
          </div>
          <Button
            asChild
            className="mt-3 w-full gap-1.5 rounded-[4px] bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <a
              href={result.url}
              download={`morphica-resized.${extFromType(result.contentType)}`}
            >
              <Download className="size-4" />
              Download
            </a>
          </Button>
        </div>
      ) : (
        <div className="flex w-full max-w-md flex-col">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`flex h-44 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground transition-all duration-200 ${
              dragging
                ? "border-foreground bg-accent text-foreground"
                : "border-border hover:border-ring hover:bg-accent/60"
            }`}
          >
            {sourceUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={sourceUrl}
                alt="Source preview"
                className="max-h-36 max-w-full object-contain"
              />
            ) : (
              <>
                <ImageIcon className="size-6" />
                Drop or paste an image
              </>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => loadFile(e.target.files?.[0] ?? null)}
          />

          <Input
            type="number"
            min={1}
            max={10000}
            placeholder="Width (px)"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="no-spinner mt-4 mb-4 h-11 w-full rounded-[4px] border-border bg-elevated px-3 shadow-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-0"
          />

          <Button
            onClick={handleProcess}
            disabled={loading || !file}
            className="h-11 w-full gap-1.5 rounded-[4px] bg-primary text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
          >
            {loading && <Loader2 className="animate-spin" />}
            {loading ? "Processing…" : "Process"}
          </Button>

          {error && (
            <p className="mt-3 text-xs font-medium text-destructive">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
