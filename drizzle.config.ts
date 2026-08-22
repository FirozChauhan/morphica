// drizzle.config.ts
// Configuration for the drizzle-kit CLI (generate / migrate / push).
//
// Note the dotenv.load() at the top: drizzle-kit only reads `.env` by default,
// but my connection string lives in `.env.local`, so I load that file
// explicitly. Without this, `npm run db:migrate` would see no DATABASE_URL.
import { config } from "dotenv";

config({ path: ".env.local" });

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./schema/index.ts",   // where my tables are defined
  out: "./migrations",           // where generated SQL + snapshots go
  dbCredentials: {
    url: process.env.DATABASE_URL!, // used only by `migrate`/`push`
  },
});
