// proxy.ts
// Next.js 16 renamed "middleware" to "proxy". This runs before requests on
// the routes listed in `config.matcher`.
//
// Two jobs here:
// 1. Auth — Clerk authenticates requests so `auth()` / `auth().protect()`
//    work in layouts, API routes, and pages.
// 2. Frontend API proxy — on Vercel (vercel.app domains) Clerk serves its own
//    JS/API through `/<app>/__clerk`. The middleware intercepts those paths
//    and forwards them to Clerk, and it tells the client to use that URL.
//    Without this, Clerk tries `clerk.<domain>` (a subdomain we can't make
//    work on vercel.app) and the JS fails to load.
import { clerkMiddleware } from "@clerk/nextjs/server";

export const proxy = clerkMiddleware({
  frontendApiProxy: {
    // Proxy on any real host, but keep plain localhost working in dev.
    enabled: (url) => url.hostname !== "localhost",
    path: "/__clerk",
  },
});

export const config = {
  matcher: [
    // Pages that render Clerk (so it can inject the proxy URL).
    "/",
    "/docs",
    "/sign-in/:path*",
    "/sign-up/:path*",
    "/dashboard/:path*",
    // API routes authed by the Clerk session.
    "/api/keys",
    "/api/stats",
    "/api/usage",
    "/api/demo",
    // Clerk's Frontend API proxy path.
    "/__clerk/:path*",
  ],
};
