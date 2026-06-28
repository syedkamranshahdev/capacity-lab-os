"use client";

import { useAuth } from "@/context/AuthContext";
import { UserMenu } from "@/components/ui/UserMenu";
import Link from "next/link";
import { Bell,  Leaf } from "lucide-react";

interface DashboardTopbarProps {
  /** Optional page title override */
  title?: string;
}

function getGreeting(): string {
  const h = new Date().getHours();

  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";

  return "Good evening";
}

export function DashboardTopbar({ title }: DashboardTopbarProps) {
  const { user, loading } = useAuth();



  const firstName = user?.fullName?.split(" ")[0] ?? "";

  const greeting =
    title ?? `${getGreeting()}${firstName ? `, ${firstName}` : ""}`;

  const hasUnread = true;

  return (
    <header className="sticky top-0 z-40 hidden md:flex items-center justify-between gap-4 border-b border-[#EDE5DC] bg-white/80 px-6 py-3.5 backdrop-blur-2xl">
      {/* LEFT */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Brand mark */}
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7A553D] to-[#4B3326] shadow-sm">
          <Leaf className="w-4 h-4 text-white" />
        </div>

        {/* Greeting */}
        <div className="min-w-0">
          {loading ? (
            <div className="h-5 w-48 animate-pulse rounded-lg bg-[#EDE5DC]" />
          ) : (
            <>
              <h1 className="truncate text-base font-semibold text-[#4B3326]">
                {greeting}
              </h1>

              <p className="text-xs text-[#9A8475]">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex shrink-0 items-center gap-2">

        {/* Notifications */}
        <Link
          href="/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8DED5] bg-white/70 text-[#9A8475] transition-all duration-300 hover:border-[#C9B09A] hover:bg-[#FAF7F3] hover:text-[#6B4A36]"
          aria-label="Notifications"
        >
          <Bell size={16} />

          {/* unread dot */}
          {hasUnread && (
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#7A553D]" />
          )}
        </Link>

        {/* User menu */}
        <UserMenu align="right" />
      </div>
    </header>
  );
}
