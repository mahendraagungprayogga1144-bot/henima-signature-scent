import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function makeClient(key: string): SupabaseClient {
  return createClient(supabaseUrl, key, {
    global: {
      fetch: (url: RequestInfo | URL, options?: RequestInit) =>
        fetch(url, { ...options, cache: "no-store" }),
    },
  });
}

/** Browser / public client (anon key). Safe only with RLS policies. */
export const supabaseAnon = makeClient(anonKey);

/**
 * Server DB client. Prefers SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
 * Falls back to anon when service role is unset (local/dev).
 * Non-NEXT_PUBLIC env vars are stripped from client bundles by Next.js.
 */
export const supabase: SupabaseClient = (() => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (typeof window === "undefined" && serviceKey) {
    return makeClient(serviceKey);
  }
  return supabaseAnon;
})();
