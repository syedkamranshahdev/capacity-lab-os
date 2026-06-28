 
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
 
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
 
  const code = searchParams.get("code");
  // `next` is set when user was redirected to login from a protected route
  const next = searchParams.get("next") ?? "/dashboard";
 
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
 
    if (!error) {
      // Redirect to the originally requested URL (or /dashboard)
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
 
  // If something went wrong, redirect to an error page or login
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}