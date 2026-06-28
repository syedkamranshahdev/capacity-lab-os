"use client";

// components/ui/Avatar.tsx
// Reusable avatar: shows photo if available, falls back to initials.
// Used in topbar, dropdown, settings, etc.

import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

export function Avatar({
  initials,
  avatarUrl,
  size = "md",
  className,
}: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full",
        "bg-gradient-to-br from-[#7A553D] to-[#4B3326]",
        "font-semibold text-white shadow-md ring-2 ring-white/60",
        sizes[size],
        className
      )}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={initials}
          fill
          className="rounded-full object-cover"
        />
      ) : (
        <span className="select-none leading-none">{initials}</span>
      )}
    </div>
  );
}