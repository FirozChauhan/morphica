// lib/auth.ts
// Small helper around Clerk's auth() so I don't repeat the "is there a
// signed-in user?" check everywhere. Returns the Clerk user id or null.
import { auth } from "@clerk/nextjs/server";

export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId ?? null;
}
