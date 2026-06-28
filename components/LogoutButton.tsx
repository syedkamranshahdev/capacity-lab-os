"use client";

// components/LogoutButton.tsx
// Client Component — uses browser Supabase client to sign out.
// After signOut(), calls router.refresh() to clear server-side cache,
// then redirects to /login.

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();

    // router.refresh() is REQUIRED — it re-runs the server layout,
    // which will now see no user and redirect to /login.
    router.refresh();
    router.push("/");
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-stone-500 hover:text-stone-800 border border-stone-200 rounded-xl px-4 py-2 transition hover:border-stone-400"
    >
      Sign Out
    </button>
  );
}