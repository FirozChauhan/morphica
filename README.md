# Morphica

Stateless, serverless image processing — one request, zero persistence.

## Stack

| Concern | Choice |
|---|---|
| Framework | [Next.js](https://nextjs.org) (App Router, TypeScript) |
| Hosting | [Vercel](https://vercel.com) (free Hobby tier) |
| Auth | [Clerk](https://clerk.com) (email + password) |
| Database | [Neon Postgres](https://neon.tech) (pooled connection) |
| ORM | [drizzle](https://orm.drizzle.team) |
| Image processing | [sharp](https://sharp.pixelplumbing.com) (in-memory) |
| UI | [shadcn/ui](https://ui.shadcn.com), Tailwind CSS |

## Getting started

### 1. Set up environment variables

Copy `.env.example` to `.env.local` and fill in the values:

- **Clerk**: Create an app at https://dashboard.clerk.com, copy the publishable key, secret key, and webhook signing secret.
- **Neon Postgres**: Create a database at https://console.neon.tech, copy the pooled connection string.

### 2. Install dependencies

```bash
npm install
```

### 3. Run database migrations

```bash
npm run db:migrate
```

### 4. Start the dev server

```bash
npm run dev
```

### 5. Configure Clerk webhook

In your Clerk dashboard, add a webhook endpoint pointing to:

```
https://your-domain.com/api/webhooks/clerk
```

Select the `user.created` event.

## API

### `POST /api/process`

Authenticated via `Authorization: Bearer <api_key>`.

**Request:** `multipart/form-data`

| Field | Type | Required | Notes |
|---|---|---|---|
| `image` | file | yes | jpeg, png, webp, or gif; ≤ 3 MB |
| `op` | string | yes | currently only `resize` |
| `width` | int | no | must be ≥ 1; at least one dimension required |
| `height` | int | no | must be ≥ 1; at least one dimension required |

**Response:** `200` with processed image bytes, or `400`/`401`/`413`/`415` with JSON error.

## Project structure

```
proxy.ts                    — Clerk auth (Next.js Proxy)
app/
  layout.tsx                — ClerkProvider
  page.tsx                  — Landing page
  dashboard/
    layout.tsx              — Auth guard, nav
    page.tsx                — Overview stats
    api-keys/page.tsx       — Key management
    usage/page.tsx          — Usage table
  api/
    process/route.ts        — Image processing
    demo/route.ts           — Session-authed demo endpoint
    keys/route.ts           — Create/revoke API keys
    webhooks/clerk/route.ts — Clerk user sync
lib/
  db.ts                     — Neon + drizzle
  auth.ts                   — Clerk helper
  keys.ts                   — API key generation/hashing
  sharp.ts                  — Image pipeline
  stats.ts                  — Dashboard queries
  format.ts                 — Formatting utilities
schema/
  index.ts                  — Drizzle schema
migrations/                 — Generated SQL
```

## Notes

- Animated GIFs are de-animated (first frame only) via `sharp({ animated: false })`.
- Usage is logged asynchronously after the response is sent using `after()`.
- sharp is configured as an external package in `next.config.ts` for the Node.js runtime.

## Author

**Firoz Khan Chauhan**