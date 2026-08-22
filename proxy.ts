// proxy.ts
// Next.js 16 renamed "middleware" to "proxy". This runs before every request
// on the routes listed in `config.matcher`.
//
// What it does:
// - /dashboard/*      → clerkMiddleware authenticates the session so auth()
//                       and auth().protect() work in the layout.
// - /api/keys, /api/stats, /api/usage, /api/demo → these are Clerk-session
//   authed, so Clerk needs to run here too.
//
// /api/process and /api/webhooks are deliberately NOT matched: the image API
// is authed by the API key, and the webhook is authed by its signing secret.
import { clerkMiddleware } from "@clerk/nextjs/server";

export const proxy = clerkMiddleware();

export const config = {
  matcher: [
    // Dashboard access itself is enforced by auth().protect() in the
    // dashboard layout (the modern, resource-based approach).
    "/dashboard/:path*",
    "/api/keys",
    "/api/stats",
    "/api/usage",
    "/api/demo",
  ],
};
