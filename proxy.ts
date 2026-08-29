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
import type { NextMiddleware } from "next/server";

const CLERK_PROXY_PATH = "/__clerk";

// Cloudflare bot-management cookies (__cf_bm, _cfuvid, cf_clearance, cf_chl_*)
// are set by Clerk's Cloudflare‑fronted FAPI on every proxied response. Their
// Domain attribute (.frontend-api.clerk.dev, clerkprod-cloudflare.net) can never
// match this app's host, so the browser rejects them on every proxied request:
//
//   Cookie “__cf_bm” has been rejected for invalid domain.
//
// These cookies serve no purpose in this proxied architecture (the proxy talks
// to Cloudflare server‑side, not the browser), so strip them from the response
// to eliminate the console noise.
const CLOUDFLARE_COOKIES = new Set(["__cf_bm", "_cfuvid", "cf_clearance"]);

function isCloudflareCookie(cookie: string): boolean {
  const eq = cookie.indexOf("=");
  const name = (eq === -1 ? cookie : cookie.slice(0, eq)).trim().toLowerCase();
  return CLOUDFLARE_COOKIES.has(name) || name.startsWith("cf_chl_");
}

function stripCloudflareCookies(res: Response): Response {
  try {
    const kept = res.headers.getSetCookie().filter((c) => !isCloudflareCookie(c));
    const headers = new Headers(res.headers);
    headers.delete("set-cookie");
    for (const c of kept) headers.append("set-cookie", c);
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers,
    });
  } catch {
    // If getSetCookie() isn't available in the runtime, keep the response
    // untouched to avoid mangling auth cookies.
    return res;
  }
}

// Configure the Clerk middleware with frontend API proxy support.
const clerk = clerkMiddleware({
  frontendApiProxy: {
    // Proxy on any real host, but keep plain localhost working in dev.
    enabled: (url) => url.hostname !== "localhost",
    path: CLERK_PROXY_PATH,
  },
});

// Wrapper that strips Cloudflare cookies from proxied /__clerk responses.
export const proxy: NextMiddleware = async (req, event) => {
  const res = await clerk(req, event);
  if (!res) return res;

  const path = req.nextUrl.pathname;
  if (path === CLERK_PROXY_PATH || path.startsWith(CLERK_PROXY_PATH + "/")) {
    return stripCloudflareCookies(res);
  }
  return res;
};

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
