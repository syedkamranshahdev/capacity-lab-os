"use client";

import Link from "next/link";

import { useAuth } from "@/context/AuthContext";

import { UserMenu } from "@/components/ui/UserMenu";

import {
  Bell,
  Leaf,
  Sparkles,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                 GREETING                                   */
/* -------------------------------------------------------------------------- */

function getGreeting(): string {
  const h = new Date().getHours();

  if (h < 12)
    return "Good morning";

  if (h < 17)
    return "Good afternoon";

  return "Good evening";
}

/* -------------------------------------------------------------------------- */
/*                               COMPONENT                                    */
/* -------------------------------------------------------------------------- */

export default function MobileTopbar() {
  const hasUnread = true;

  const { user, loading } =
    useAuth();

  const firstName =
    user?.fullName?.split(" ")[0] ??
    "";

  return (
    <header className="sticky top-0 z-40 border-b border-[#EDE5DC]/80 bg-[rgba(255,252,249,0.82)] backdrop-blur-2xl">
      {/* Ambient Glow */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-24 w-24 rounded-full bg-[#F5ECE3]/60 blur-3xl" />

        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#F0E4D9]/50 blur-3xl" />
      </div>

      {/* CONTENT */}

      <div className="relative flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
        {/* ---------------------------------------------------------------- */}
        {/* LEFT                                                             */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex min-w-0 items-center gap-3">
          {/* MOBILE LOGO */}

          <Link
            href="/"
            className="group flex items-center gap-2 lg:hidden"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7A553D] via-[#6B4A36] to-[#4B3326] shadow-[0_10px_24px_rgba(91,63,43,0.18)] transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
              <Leaf className="h-4 w-4 text-white" />
            </div>

            <div className="flex flex-col leading-none">
              <span className="font-serif text-[15px] tracking-wide text-[#4B3326]">
                Capacity Lab
              </span>

              <span className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#A08978]">
                Capacity OS
              </span>
            </div>
          </Link>

          {/* DESKTOP GREETING */}

          <div className="hidden lg:block">
            {loading ? (
              <div className="space-y-2">
                <div className="h-5 w-40 animate-pulse rounded-lg bg-[#EDE5DC]" />

                <div className="h-3 w-28 animate-pulse rounded-lg bg-[#F3ECE5]" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#B08B6A]" />

                  <p className="text-sm font-semibold text-[#4B3326]">
                    {getGreeting()}
                    {firstName
                      ? `, ${firstName}`
                      : ""}
                  </p>
                </div>

                <p className="mt-1 text-xs text-[#9A8475]">
                  {new Date().toLocaleDateString(
                    "en-US",
                    {
                      weekday:
                        "long",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* RIGHT                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex items-center gap-2">
          {/* NOTIFICATIONS */}

          <Link
            href="/notifications"
            aria-label="Notifications"
            className="group relative flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E8DED5]/80 bg-white/70 text-[#9A8475] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4B9A2] hover:bg-[#FAF7F3] hover:text-[#6B4A36]"
          >
            <Bell
              size={16}
              className="transition-transform duration-300 group-hover:scale-110"
            />

            {/* UNREAD DOT */}

            {hasUnread && (
              <>
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#7A553D]" />

                <span className="absolute right-2 top-2 h-2 w-2 animate-ping rounded-full bg-[#7A553D]/70" />
              </>
            )}
          </Link>

          {/* USER MENU */}

          <UserMenu align="right" />
        </div>
      </div>
    </header>
  );
}