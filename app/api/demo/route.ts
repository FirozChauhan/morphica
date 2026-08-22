// app/api/demo/route.ts
// Powers the live demo on the landing page.
//
// Signed-in users get their own active API key to process through (so the
// demo doubles as a real test of the pipeline). Anonymous visitors can also
// use it, but I rate-limit them per-IP so the endpoint can't be abused as a
// free compute farm.
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { db } from "@/lib/db";
import { isRateLimited } from "@/lib/rate-limit";
import { isAllowedMimeType, processImage } from "@/lib/sharp";
import { apiKeys } from "@/schema";

export const runtime = "nodejs";
export const maxDuration = 10;

const MAX_PAYLOAD_BYTES = 3 * 1024 * 1024;
const ANON_LIMIT = 10;         // 10 requests...
const ANON_WINDOW_MS = 60_000; // ...per minute, per IP

function clientIp(request: NextRequest): string {
  // Behind Vercel, the real IP shows up first in x-forwarded-for.
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  const isAnonymous = !userId;

  // Anonymous users get a throttled, one-shot-every-now-and-then experience.
  if (
    isAnonymous &&
    isRateLimited(`demo:${clientIp(request)}`, ANON_LIMIT, ANON_WINDOW_MS)
  ) {
    return new Response(JSON.stringify({ error: "rate_limited" }), {
      status: 429,
      headers: { "content-type": "application/json" },
    });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("multipart/form-data")) {
    return new Response(JSON.stringify({ error: "expected_multipart" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // Same size-cap-first approach as /api/process.
  const rawBody = await request.arrayBuffer();
  if (rawBody.byteLength > MAX_PAYLOAD_BYTES) {
    return new Response(JSON.stringify({ error: "payload_too_large" }), {
      status: 413,
      headers: { "content-type": "application/json" },
    });
  }

  const form = await new Response(rawBody, {
    headers: { "content-type": contentType },
  }).formData();

  const imageFile = form.get("image");
  if (!(imageFile instanceof File)) {
    return new Response(JSON.stringify({ error: "missing_image" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  if (!isAllowedMimeType(imageFile.type)) {
    return new Response(JSON.stringify({ error: "unsupported_media_type" }), {
      status: 415,
      headers: { "content-type": "application/json" },
    });
  }

  const width = parseDimension(form.get("width"));
  if (width === null || Number.isNaN(width)) {
    return new Response(JSON.stringify({ error: "invalid_width" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // Signed-in users must have at least one active key — otherwise point them
  // at the dashboard. (Anonymous users skip this check entirely.)
  if (!isAnonymous) {
    const keyRow = await db.query.apiKeys.findFirst({
      where: and(eq(apiKeys.userId, userId), eq(apiKeys.active, true)),
    });
    if (!keyRow) {
      return new Response(JSON.stringify({ error: "no_api_key" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
  }

  const sourceBytes = await imageFile.arrayBuffer();

  let result;
  try {
    result = await processImage(Buffer.from(sourceBytes), { width });
  } catch {
    return new Response(JSON.stringify({ error: "unprocessable_image" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(new Uint8Array(result.buffer), {
    status: 200,
    headers: { "content-type": result.contentType },
  });
}

function parseDimension(value: FormDataEntryValue | null): number | null {
  if (value === null) return null;
  if (typeof value !== "string" || value.trim() === "") return null;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 10000) return Number.NaN;
  return n;
}
