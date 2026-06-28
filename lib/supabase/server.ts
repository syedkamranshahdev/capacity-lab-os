import {
  cookies,
} from "next/headers";

import {
  createServerClient,
} from "@supabase/ssr";

// ─────────────────────────────────────────────────────────
// Server Supabase Client
// Used in:
// - Server Components
// - Route Handlers
// - Server Actions
// ─────────────────────────────────────────────────────────

export async function createClient() {
  const cookieStore =
    cookies();

  return createServerClient(
    process.env
      .NEXT_PUBLIC_SUPABASE_URL!,

    process.env
      .NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    {
      cookies: {
        get(name: string) {
          return cookieStore.get(
            name,
          )?.value;
        },

        set(
          name: string,
          value: string,
          options,
        ) {
          try {
            cookieStore.set({
              name,
              value,
              ...options,
            });
          } catch {
            // ignored in Server Components
          }
        },

        remove(
          name: string,
          options,
        ) {
          try {
            cookieStore.set({
              name,
              value: "",
              ...options,
            });
          } catch {
            // ignored in Server Components
          }
        },
      },
    },
  );
}