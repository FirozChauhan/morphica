// The API Keys dashboard tab: table of keys + create/revoke dialogs. It's a
// client component that loads the key list from /api/keys on mount (cached)
// and updates the list in place after create/revoke — no full page reload.
"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, KeyRound, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cachedFetch, clearCached } from "@/lib/client-cache";
import { formatDate, formatDateTime } from "@/lib/format";
import { useDelayedSkeleton } from "@/hooks/use-delayed-skeleton";
import type { ApiKey } from "@/schema";

type CreateDialogState = { name: string; open: boolean } | null;
type RevealDialogState = { name: string; plaintext: string; open: boolean } | null;

function StatusDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`size-1.5 rounded-full ${className}`} />
      <span className="text-sm">{label}</span>
    </span>
  );
}

export function KeysClient() {
  const [keys, setKeys] = useState<ApiKey[] | null>(null);
  const [create, setCreate] = useState<CreateDialogState>(null);
  const [reveal, setReveal] = useState<RevealDialogState>(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const showSkeleton = useDelayedSkeleton();

  const loadKeys = useCallback(async () => {
    const res = await fetch("/api/keys");
    const body = await res.json();
    setKeys(res.ok ? body : null);
  }, []);

  useEffect(() => {
    void cachedFetch<ApiKey[]>("keys", 20_000, () =>
      fetch("/api/keys").then((r) => (r.ok ? r.json() : null)),
    ).then(setKeys);
  }, []);

  async function refreshKeys() {
    clearCached("keys");
    void loadKeys();
  }

  async function handleCreate() {
    if (!create) return;
    setCreating(true);
    setCreateError(null);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: create.name.trim() }),
      });
      const body = await res.json();
      if (!res.ok) {
        setCreateError(
          body.error === "key_limit_reached"
            ? "You've reached the maximum of 10 active keys. Revoke one first."
            : "Failed to create the key.",
        );
        throw new Error(body.error ?? "create_failed");
      }
      setReveal({ name: body.name, plaintext: body.key, open: true });
      setCreate(null);
      refreshKeys();
    } catch {
      setCreate({ name: create.name, open: true });
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    setRevokingId(id);
    try {
      await fetch("/api/keys", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });
      refreshKeys();
    } finally {
      setRevokingId(null);
    }
  }

  async function copyPlaintext() {
    if (!reveal) return;
    try {
      await navigator.clipboard.writeText(reveal.plaintext);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">API Keys</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Keys are shown once at creation and sent via{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              Authorization: Bearer
            </code>
            .
          </p>
        </div>
        <Button onClick={() => setCreate({ name: "", open: true })}>
          <KeyRound />
          Create key
        </Button>
      </div>

      {!keys ? (
        showSkeleton ? (
          <div className="overflow-hidden border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {["Name", "Prefix", "Created", "Last used", "Status", "Actions"].map(
                    (h) => (
                      <TableHead
                        key={h}
                        className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                      >
                        {h}
                      </TableHead>
                    ),
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j} className="py-3">
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="overflow-hidden border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {["Name", "Prefix", "Created", "Last used", "Status", "Actions"].map(
                    (h) => (
                      <TableHead
                        key={h}
                        className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                      >
                        {h}
                      </TableHead>
                    ),
                  )}
                </TableRow>
              </TableHeader>
              <TableBody />
            </Table>
          </div>
        )
      ) : keys.length === 0 ? (
        <div className="border bg-card py-16 text-center">
          <p className="text-sm font-medium">No keys yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first API key to start processing images.
          </p>
        </div>
      ) : (
        <div className="animate-in overflow-hidden border bg-card fade-in-0 slide-in-from-bottom-3 zoom-in-95 duration-500 ease-out">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Name
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Prefix
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Created
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Last used
                </TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key) => (
                <TableRow key={key.id} className="hover:bg-muted/50">
                  <TableCell className="py-3 font-medium">{key.name}</TableCell>
                  <TableCell className="py-3">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {key.keyPrefix}…
                    </code>
                  </TableCell>
                  <TableCell className="py-3 text-muted-foreground">
                    {formatDate(key.createdAt)}
                  </TableCell>
                  <TableCell className="py-3 text-muted-foreground">
                    {key.lastUsedAt ? formatDateTime(key.lastUsedAt) : "—"}
                  </TableCell>
                  <TableCell className="py-3">
                    {key.active ? (
                      <StatusDot className="bg-emerald-500" label="Active" />
                    ) : (
                      <StatusDot className="bg-muted-foreground/40" label="Revoked" />
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    {key.active && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        disabled={revokingId === key.id}
                        onClick={() => handleRevoke(key.id)}
                      >
                        {revokingId === key.id && (
                          <Loader2 className="animate-spin" />
                        )}
                        Revoke
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog
        open={create?.open ?? false}
        onOpenChange={(open) => {
          if (!open) setCreate(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API key</DialogTitle>
            <DialogDescription>
              Give the key a name so you can recognize it later.
            </DialogDescription>
          </DialogHeader>
          <Input
            autoFocus
            placeholder="e.g. production"
            value={create?.name ?? ""}
            onChange={(e) =>
              setCreate({ name: e.target.value, open: true })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
          />
          {createError && (
            <p className="text-xs font-medium text-destructive">
              {createError}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setCreate(null)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating && <Loader2 className="animate-spin" />}
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={reveal?.open ?? false}
        onOpenChange={(open) => {
          if (!open) setReveal(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>API key created</DialogTitle>
            <DialogDescription>
              Copy this key now — you won&apos;t see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <code className="min-w-0 flex-1 break-all border bg-muted px-3 py-2 text-xs">
              {reveal?.plaintext}
            </code>
            <Button variant="outline" size="icon" onClick={copyPlaintext}>
              {copied ? (
                <Check className="text-emerald-600" />
              ) : (
                <Copy />
              )}
            </Button>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setReveal(null)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
