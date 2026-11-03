/**
 * Lightweight env validation. Call from server entry points (API / layout).
 * Does not throw in production soft-mode for optional integrations.
 */

const REQUIRED_ALWAYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

const REQUIRED_PRODUCTION = [
  "SESSION_SECRET",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

let validated = false;

export function assertEnv(): void {
  if (validated) return;
  validated = true;

  const missing: string[] = [];

  for (const key of REQUIRED_ALWAYS) {
    if (!process.env[key]) missing.push(key);
  }

  if (process.env.NODE_ENV === "production") {
    for (const key of REQUIRED_PRODUCTION) {
      if (!process.env[key]) missing.push(key);
    }
    if (process.env.SESSION_SECRET === "toko-dev-secret") {
      missing.push("SESSION_SECRET(must-not-be-default)");
    }
  }

  if (missing.length) {
    const msg = `[env] Missing required variables: ${missing.join(", ")}`;
    if (process.env.NODE_ENV === "production") {
      throw new Error(msg);
    }
    console.warn(msg);
  }
}
