// app/api/webhooks/clerk/route.ts
// Receives Clerk webhooks and keeps my local `users` table in sync.
//
// The request is verified with the CLERK_WEBHOOK_SECRET before I trust any of
// it, so I only ever act on events Clerk actually sent.
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";

import { db } from "@/lib/db";
import { users } from "@/schema";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let evt;
  try {
    // Throws if the signature is invalid — so this is my auth gate.
    evt = await verifyWebhook(request);
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  const { type } = evt;

  if (type === "user.created" || type === "user.updated") {
    // Upsert the user so their local row always matches Clerk.
    const { id } = evt.data;
    const email = evt.data.email_addresses[0]?.email_address ?? "";

    await db
      .insert(users)
      .values({ id, email })
      .onConflictDoUpdate({ target: users.id, set: { email } });
  }

  if (type === "user.deleted") {
    // Account was deleted — remove the row (their keys and usage go with it
    // thanks to ON DELETE CASCADE).
    const { id } = evt.data;
    if (id) {
      await db.delete(users).where(eq(users.id, id));
    }
  }

  return new Response("OK", { status: 200 });
}
