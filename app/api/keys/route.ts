// app/api/keys/route.ts
// CRUD (well, CR+Revoke) for API keys.
//
// GET  /api/keys  → list my keys
// POST /api/keys  → create a new key (shows plaintext once)
// PATCH /api/keys → revoke a key (active=false, never deleted)
import { auth, clerkClient } from "@clerk/nextjs/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import { db } from "@/lib/db";
import { generateApiKey, hashApiKey, keyPrefix } from "@/lib/keys";
import { apiKeys, users } from "@/schema";

export const runtime = "nodejs";

// I cap active keys per user to prevent someone from spamming millions of
// unused keys. The dashboard WAF is the primary defence, but this is a
// good belt-and-braces limit.
const MAX_ACTIVE_KEYS = 10;

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  // Only the display columns — no keyHash (unnecessary exposure).
  const keys = await db
    .select({
      id: apiKeys.id,
      name: apiKeys.name,
      keyPrefix: apiKeys.keyPrefix,
      active: apiKeys.active,
      lastUsedAt: apiKeys.lastUsedAt,
      createdAt: apiKeys.createdAt,
      revokedAt: apiKeys.revokedAt,
    })
    .from(apiKeys)
    .where(eq(apiKeys.userId, userId))
    .orderBy(desc(apiKeys.createdAt));

  return Response.json(keys);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  let name = "default";
  try {
    const body = await request.json();
    if (typeof body.name === "string" && body.name.trim()) {
      name = body.name.trim().slice(0, 60);
    }
  } catch {
    // default name
  }

  // Check the active-key cap before creating.
  const [activeCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(apiKeys)
    .where(and(eq(apiKeys.userId, userId), eq(apiKeys.active, true)));

  if ((activeCount?.count ?? 0) >= MAX_ACTIVE_KEYS) {
    return new Response(JSON.stringify({ error: "key_limit_reached" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // Fetch the user's email from Clerk to keep the local `users` table in sync
  // (the webhook also does this, but the webhook might fire late or not at all
  // during development).
  const client = await clerkClient();
  const email = await client.users
    .getUser(userId)
    .then((u) => u.emailAddresses[0]?.emailAddress ?? "")
    .catch(() => "");

  // Upsert the user row so the foreign key constraint is satisfied.
  await db
    .insert(users)
    .values({ id: userId, email })
    .onConflictDoUpdate({ target: users.id, set: { email } });

  const apiKey = generateApiKey();

  await db.insert(apiKeys).values({
    id: randomUUID(),
    userId,
    name,
    keyHash: hashApiKey(apiKey),
    keyPrefix: keyPrefix(apiKey),
  });

  return new Response(
    JSON.stringify({ key: apiKey, prefix: keyPrefix(apiKey), name }),
    { status: 201, headers: { "content-type": "application/json" } },
  );
}

export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  let keyId = "";
  try {
    const body = await request.json();
    keyId = typeof body.id === "string" ? body.id : "";
  } catch {
    // handled below
  }

  if (!keyId) {
    return new Response(JSON.stringify({ error: "missing_id" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // Only the owner can revoke their own key.
  const result = await db
    .update(apiKeys)
    .set({ active: false, revokedAt: new Date() })
    .where(and(eq(apiKeys.id, keyId), eq(apiKeys.userId, userId)));

  // rowCount is 0 if the key didn't exist or belonged to another user.
  if ((result as { rowCount?: number }).rowCount === 0) {
    return new Response(JSON.stringify({ error: "not_found" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}