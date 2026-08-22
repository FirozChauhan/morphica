// schema/index.ts
// The database model, defined with drizzle. Run `npm run db:generate` after
// changing this file, commit the generated SQL, and apply it with
// `npm run db:migrate`.
import {
  bigserial,
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// One row per account. The id IS the Clerk user id — I never mint my own,
// which keeps everything in sync with Clerk's identity.
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// API keys. The plaintext key is NEVER stored — only keyHash (sha256) and a
// short keyPrefix for display. `active` flips to false on revoke.
export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    keyHash: text("key_hash").notNull(),
    keyPrefix: text("key_prefix").notNull(),
    active: boolean("active").notNull().default(true),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  // Find all keys for a user quickly.
  (table) => [index("api_keys_user_id_idx").on(table.userId)],
);

// One row per API call. Written async-after-the-response so a slow DB write
// never delays image delivery.
export const usage = pgTable(
  "usage",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    apiKeyId: uuid("api_key_id")
      .notNull()
      .references(() => apiKeys.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    op: text("op").notNull(),
    status: integer("status").notNull(),
    bytesIn: integer("bytes_in").notNull(),
    bytesOut: integer("bytes_out").notNull(),
    durationMs: integer("duration_ms").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  // The two hot lookup patterns: the dashboard (per key, newest first) and
  // the stats queries (per user, by day).
  (table) => [
    index("usage_api_key_id_created_at_idx").on(table.apiKeyId, table.createdAt),
    index("usage_user_id_created_at_idx").on(table.userId, table.createdAt),
  ],
);

// Inferred row types — handy when I'm passing rows around in the UI.
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;
export type Usage = typeof usage.$inferSelect;
export type NewUsage = typeof usage.$inferInsert;
