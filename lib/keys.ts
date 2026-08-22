// lib/keys.ts
// Everything about creating and verifying API keys.
//
// A key looks like: pk_live_<40 random hex chars>.
// I NEVER store the plaintext key — only its SHA-256 hash. So even if the
// database leaks, the actual keys stay useless. The plaintext is shown to the
// user exactly once, at creation time.
import { createHash, randomBytes } from "node:crypto";

// Every key starts with this prefix so I can recognise our keys at a glance,
// and it lets me build pretty display prefixes like "pk_live_Ab12cd34".
export const API_KEY_PREFIX = "pk_live_";

export function generateApiKey(): string {
  // 20 random bytes = 40 hex characters ≈ 160 bits of entropy. That makes
  // brute-forcing a key completely infeasible.
  const secret = randomBytes(20).toString("hex");
  return `${API_KEY_PREFIX}${secret}`;
}

export function hashApiKey(apiKey: string): string {
  // SHA-256 is the right tool here — fast and one-way. I wouldn't use it for
  // passwords, but API keys are random and high-entropy, so a plain hash is
  // safe and gives me exact-match lookups in the DB.
  return createHash("sha256").update(apiKey).digest("hex");
}

export function keyPrefix(apiKey: string): string {
  // The first 8 chars after the prefix — enough to recognise a key in the
  // dashboard without ever exposing the full thing.
  const secret = apiKey.slice(API_KEY_PREFIX.length);
  return `${API_KEY_PREFIX}${secret.slice(0, 8)}`;
}
