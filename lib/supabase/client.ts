import {
  createBrowserClient,
} from "@supabase/ssr";

import type {
  SupabaseClient,
} from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────
// Singleton Browser Client
// Prevents multiple client instances
// ─────────────────────────────────────────────────────────

let client:
  | SupabaseClient
  | undefined;

export function createClient() {
  if (client) return client;

  client =
    createBrowserClient(
      process.env
        .NEXT_PUBLIC_SUPABASE_URL!,

      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

  return client;
}