"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

/* -------------------------------------------------------------------------- */
/*                                   COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function LoginPage() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const supabase = createClient();

  /* ---------------------------------------------------------------------- */
  /*                                ROUTING                                 */
  /* ---------------------------------------------------------------------- */

  const nextPath =
    searchParams.get("next") ??
    "/dashboard";

  /* ---------------------------------------------------------------------- */
  /*                                 STATE                                  */
  /* ---------------------------------------------------------------------- */

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(
      null,
    );

  /* ---------------------------------------------------------------------- */
  /*                               LOGIN FLOW                               */
  /* ---------------------------------------------------------------------- */

  async function handleLogin(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      setError(null);

      /* -------------------------------------------------------------- */
      /* SIGN IN */
      /* -------------------------------------------------------------- */

      const {
        data,
        error,
      } =
        await supabase.auth.signInWithPassword(
          {
            email,
            password,
          },
        );

      if (error) {
        console.error(
          "Login error:",
          error.message,
        );

        setError(
          "Invalid email or password.",
        );

        return;
      }

      if (!data.user) {
        setError(
          "Unable to authenticate user.",
        );

        return;
      }

      /* -------------------------------------------------------------- */
      /* WAIT FOR SESSION */
      /* -------------------------------------------------------------- */

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            350,
          ),
      );

      /* -------------------------------------------------------------- */
      /* HARD REDIRECT */
      /* -------------------------------------------------------------- */

      window.location.href =
        nextPath;
    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  /* ---------------------------------------------------------------------- */
  /*                                  UI                                    */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#FDF8F3] via-[#F8F1EA] to-[#F4ECE4] px-5 py-10">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#E8D5C5]/40 blur-3xl" />

        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#DCC2AE]/30 blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[2.8rem] border border-white/60 bg-white/75 backdrop-blur-2xl shadow-[0_30px_90px_rgba(91,63,43,0.12)]">
        {/* texture */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 to-transparent" />

        <div className="relative px-8 py-10 sm:px-10">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            {/* Logo */}
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7A553D] to-[#5B3F2B] text-white shadow-[0_14px_32px_rgba(111,78,55,0.28)]">
              <span className="font-serif text-2xl">
                C
              </span>
            </div>

            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E8DED5] bg-white/70 px-4 py-2 backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-[#7A553D]" />

              <span className="text-[11px] uppercase tracking-[0.22em] text-[#A27E65]">
                Secure Client Access
              </span>
            </div>

            <h1 className="font-serif text-5xl leading-none text-[#4B3326]">
              Welcome Back
            </h1>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#8C7463]">
              Return to your private Capacity Map, check-ins and personal signal patterns.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-700 backdrop-blur-md">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={
              handleLogin
            }
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6B4A36]">
                Email Address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value,
                  )
                }
                className="w-full rounded-2xl border border-[#E8DED5] bg-white/70 px-4 py-3.5 text-sm text-[#4B3326] placeholder:text-[#B7A08F] outline-none transition-all duration-300 focus:border-[#B08968] focus:bg-white focus:ring-4 focus:ring-[#EADFD4]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6B4A36]">
                Password
              </label>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Your password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value,
                    )
                  }
                  className="w-full rounded-2xl border border-[#E8DED5] bg-white/70 px-4 py-3.5 pr-12 text-sm text-[#4B3326] placeholder:text-[#B7A08F] outline-none transition-all duration-300 focus:border-[#B08968] focus:bg-white focus:ring-4 focus:ring-[#EADFD4]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword,
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A8475] transition hover:text-[#6B4A36]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={
                loading
              }
              className="group relative mt-2 flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#7A553D] via-[#6B4A36] to-[#53392B] text-sm font-medium text-white shadow-[0_14px_30px_rgba(111,78,55,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(111,78,55,0.34)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <div className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-[120%]" />

              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  <span>
                    Signing In...
                  </span>
                </>
              ) : (
                <>
                  <span>
                    Enter Dashboard
                  </span>

                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#E8DED5]" />

            <span className="text-[11px] uppercase tracking-[0.25em] text-[#B89B84]">
              Founding Access
            </span>

            <div className="h-px flex-1 bg-[#E8DED5]" />
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-[#9A8475]">
            Don&apos;t have an account?{" "}

            <Link
              href="/signup"
              className="font-medium text-[#6B4A36] transition hover:text-[#4B3326]"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}