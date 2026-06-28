"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

/* -------------------------------------------------------------------------- */
/*                                   COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function SignupPage() {
  const supabase = createClient();

  /* ---------------------------------------------------------------------- */
  /*                                  STATE                                 */
  /* ---------------------------------------------------------------------- */

  const [fullName, setFullName] =
    useState("");

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

  const [success, setSuccess] =
    useState(false);

  /* ---------------------------------------------------------------------- */
  /*                               SIGNUP FLOW                              */
  /* ---------------------------------------------------------------------- */

  async function handleSignup(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      setError(null);

      /* -------------------------------------------------------------- */
      /* CREATE AUTH ACCOUNT */
      /* -------------------------------------------------------------- */

      const {
        data,
        error,
      } =
        await supabase.auth.signUp(
          {
            email,

            password,

            options: {
              data: {
                full_name:
                  fullName,
              },
            },
          },
        );

      if (error) {
        console.error(
          "Signup error:",
          error.message,
        );

        setError(
          error.message,
        );

        return;
      }

      if (!data.user) {
        setError(
          "Unable to create account.",
        );

        return;
      }

      /* -------------------------------------------------------------- */
      /* CREATE PROFILE ROW */
      /* -------------------------------------------------------------- */

      const {
        error:
          profileError,
      } =
        await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,

            email,

            full_name:
              fullName,

            onboarding_completed:
              false,
          });

      if (profileError) {
        console.error(
          "Profile creation error:",
          profileError.message,
        );

        setError(
          "Account created but profile setup failed.",
        );

        return;
      }

      setSuccess(true);

      /* -------------------------------------------------------------- */
      /* WAIT FOR SESSION */
      /* -------------------------------------------------------------- */

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            400,
          ),
      );

      /* -------------------------------------------------------------- */
      /* HARD REDIRECT */
      /* -------------------------------------------------------------- */

      window.location.href =
        "/onboarding";
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
  /*                                    UI                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#FDF8F3] via-[#F8F1EA] to-[#F4ECE4] px-5 py-10">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#E7D4C3]/40 blur-3xl" />

        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#DCC2AE]/30 blur-3xl" />
      </div>

      {/* card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[2.8rem] border border-white/60 bg-white/75 backdrop-blur-2xl shadow-[0_30px_90px_rgba(91,63,43,0.12)]">
        {/* texture */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 to-transparent" />

        <div className="relative px-8 py-10 sm:px-10">
          {/* header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7A553D] to-[#5B3F2B] text-white shadow-[0_14px_32px_rgba(111,78,55,0.28)]">
              <span className="font-serif text-2xl">
                C
              </span>
            </div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E8DED5] bg-white/70 px-4 py-2 backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-[#7A553D]" />

              <span className="text-[11px] uppercase tracking-[0.22em] text-[#A27E65]">
                Founding Access
              </span>
            </div>

            <h1 className="font-serif text-5xl leading-none text-[#4B3326]">
              Create Account
            </h1>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#8C7463]">
              Create your private Capacity Map and begin connecting your own wellness signals.
            </p>
          </div>

          {/* success */}
          {success && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-700 backdrop-blur-md">
              <CheckCircle2 className="h-4 w-4" />

              <span>
                Account created successfully.
              </span>
            </div>
          )}

          {/* error */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-700 backdrop-blur-md">
              {error}
            </div>
          )}

          {/* form */}
          <form
            onSubmit={
              handleSignup
            }
            className="space-y-5"
          >
            {/* full name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6B4A36]">
                Full Name
              </label>

              <input
                type="text"
                required
                value={fullName}
                onChange={(e) =>
                  setFullName(
                    e.target.value,
                  )
                }
                placeholder="Sophia Anderson"
                className="w-full rounded-2xl border border-[#E8DED5] bg-white/70 px-4 py-3.5 text-sm text-[#4B3326] outline-none transition-all duration-300 focus:border-[#B08968] focus:bg-white focus:ring-4 focus:ring-[#EADFD4]"
              />
            </div>

            {/* email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#6B4A36]">
                Email Address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value,
                  )
                }
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-[#E8DED5] bg-white/70 px-4 py-3.5 text-sm text-[#4B3326] outline-none transition-all duration-300 focus:border-[#B08968] focus:bg-white focus:ring-4 focus:ring-[#EADFD4]"
              />
            </div>

            {/* password */}
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
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value,
                    )
                  }
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  className="w-full rounded-2xl border border-[#E8DED5] bg-white/70 px-4 py-3.5 pr-12 text-sm text-[#4B3326] outline-none transition-all duration-300 focus:border-[#B08968] focus:bg-white focus:ring-4 focus:ring-[#EADFD4]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword,
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A8475]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* submit */}
            <button
              type="submit"
              disabled={
                loading
              }
              className="group relative mt-2 flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#7A553D] via-[#6B4A36] to-[#53392B] text-sm font-medium text-white shadow-[0_14px_30px_rgba(111,78,55,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(111,78,55,0.34)] active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />

                  <span>
                    Creating Account...
                  </span>
                </>
              ) : (
                <>
                  <span>
                    Continue
                  </span>

                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* footer */}
          <p className="mt-7 text-center text-sm text-[#9A8475]">
            Already have an account?{" "}

            <Link
              href="/login"
              className="font-medium text-[#6B4A36]"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}