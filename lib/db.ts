// lib/db.ts
// This is where I set up the database connection.
//
// I use Neon's serverless driver because it talks to Postgres over HTTP —
// perfect for Vercel's serverless functions where I don't want to hold a
// persistent connection open between requests. drizzle wraps it and knows my
// schema, so all my queries come back fully type-safe.
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { apiKeys, usage, users } from "@/schema";

// DATABASE_URL is my pooled Neon connection string from .env.local.
// neon() turns it into a query function, and drizzle uses that as its client.
const sql = neon(process.env.DATABASE_URL!);

// Passing the schema here is what unlocks the convenient `db.query.*`
// helpers (e.g. db.query.apiKeys). Without it I'd only get the raw builder.
export const db = drizzle(sql, {
  schema: { users, apiKeys, usage },
});
