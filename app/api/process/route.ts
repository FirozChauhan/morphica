// app/api/process/route.ts
// THE core endpoint. POST /api/process
//
//   Authorization: Bearer pk_live_...
//   multipart/form-data:
//     image  - file (jpeg/png/webp/gif, ≤ 3 MB)
//     op     - "resize" (only op for now)
//     width  - optional int
//     height - optional int
//
// Flow: authenticate the key → check the payload → resize with sharp → return
// the image bytes → log a usage row (async, after the response is sent).
import { and, eq } from "drizzle-orm";
import { after } from "next/server";

import { db } from "@/lib/db";
import { hashApiKey } from "@/lib/keys";
import { isAllowedMimeType, processImage } from "@/lib/sharp";
import { apiKeys, usage } from "@/schema";

export const runtime = "nodejs"; // sharp needs Node, not the edge runtime
export const maxDuration = 10;    // Vercel Hobby limit is 10s

const MAX_PAYLOAD_BYTES = 3 * 1024 * 1024; // ~3 MB, per the product limits

type ProcessParams = {
  width?: number;
  height?: number;
};

// Parses a form value into a positive integer. Returns:
//   null  → field absent/empty (allowed, since one dimension may be omitted)
//   NaN   → present but invalid (number too small / too big / not an integer)
//   number→ valid pixel dimension
function parseDimension(value: FormDataEntryValue | null): number | null {
  if (value === null) return null;
  if (typeof value !== "string" || value.trim() === "") return null;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 10000) return Number.NaN;
  return n;
}

export async function POST(request: Request) {
  const startedAt = Date.now(); // for the duration_ms usage field

  // --- 1. Authenticate the API key -------------------------------
  const authorization = request.headers.get("authorization") ?? "";
  const apiKey = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : null;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "missing_api_key" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  // Look the key up by its SHA-256 hash (never the plaintext) and make sure
  // it hasn't been revoked.
  const keyRow = await db.query.apiKeys.findFirst({
    where: and(eq(apiKeys.keyHash, hashApiKey(apiKey)), eq(apiKeys.active, true)),
  });

  if (!keyRow) {
    return new Response(JSON.stringify({ error: "invalid_api_key" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  // --- 2. Schedule the usage log (runs AFTER the response is sent) ---
  // I register this right after auth so EVERY authenticated call — success
  // or failure — gets logged. A DB hiccup here never blocks image delivery.
  let status = 200;
  let op = "unknown"; // filled in once we parse the form
  let bytesIn = 0;
  let bytesOut = 0;

  after(async () => {
    await db.insert(usage).values({
      apiKeyId: keyRow.id,
      userId: keyRow.userId,
      op,
      status,
      bytesIn,
      bytesOut,
      durationMs: Date.now() - startedAt,
    });
    await db
      .update(apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiKeys.id, keyRow.id));
  });

  // --- 3. Validate the request -----------------------------------
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("multipart/form-data")) {
    return new Response(JSON.stringify({ error: "expected_multipart" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // Read the whole body into memory so I can (a) enforce the size cap BEFORE
  // parsing, and (b) re-parse the multipart body from the buffer.
  const rawBody = await request.arrayBuffer();
  bytesIn = rawBody.byteLength;
  if (rawBody.byteLength > MAX_PAYLOAD_BYTES) {
    status = 413;
    return new Response(JSON.stringify({ error: "payload_too_large" }), {
      status,
      headers: { "content-type": "application/json" },
    });
  }

  const parsedBody = await new Response(rawBody, {
    headers: { "content-type": contentType }, // keep the boundary
  }).formData();

  const imageFile = parsedBody.get("image");
  if (!(imageFile instanceof File)) {
    status = 400;
    return new Response(JSON.stringify({ error: "missing_image" }), {
      status,
      headers: { "content-type": "application/json" },
    });
  }

  if (!isAllowedMimeType(imageFile.type)) {
    status = 415;
    return new Response(JSON.stringify({ error: "unsupported_media_type" }), {
      status,
      headers: { "content-type": "application/json" },
    });
  }

  const opValue = parsedBody.get("op");
  if (opValue !== "resize") {
    status = 400;
    return new Response(JSON.stringify({ error: "unknown_op" }), {
      status,
      headers: { "content-type": "application/json" },
    });
  }
  op = "resize";

  const width = parseDimension(parsedBody.get("width"));
  const height = parseDimension(parsedBody.get("height"));

  if (Number.isNaN(width) || Number.isNaN(height)) {
    status = 400;
    return new Response(JSON.stringify({ error: "invalid_dimension" }), {
      status,
      headers: { "content-type": "application/json" },
    });
  }

  if (!width && !height) {
    status = 400;
    return new Response(JSON.stringify({ error: "dimension_required" }), {
      status,
      headers: { "content-type": "application/json" },
    });
  }

  // --- 4. Process the image --------------------------------------
  const sourceBytes = await imageFile.arrayBuffer();
  const params: ProcessParams = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };

  let result;
  try {
    result = await processImage(Buffer.from(sourceBytes), params);
  } catch {
    // sharp couldn't decode it — not a valid image after all.
    status = 400;
    return new Response(JSON.stringify({ error: "unprocessable_image" }), {
      status,
      headers: { "content-type": "application/json" },
    });
  }

  bytesOut = result.buffer.byteLength;

  // --- 5. Return the image bytes ---------------------------------
  return new Response(new Uint8Array(result.buffer), {
    status: 200,
    headers: { "content-type": result.contentType },
  });
}
