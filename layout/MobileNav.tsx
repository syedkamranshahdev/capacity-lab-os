"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck2, ClipboardList, LayoutDashboard, Settings, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Check-in", href: "/check-in", icon: CalendarCheck2 },
  { label: "Practices", href: "/protocols", icon: ClipboardList },
  { label: "Capacity", href: "/dashboard", icon: LayoutDashboard },
  { label: "Patterns", href: "/progress", icon: TrendingUp },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();
  return <nav aria-label="Member navigation" className="fixed inset-x-0 bottom-3 z-50 px-3 lg:hidden"><div className="mx-auto max-w-md rounded-[2rem] border border-white/70 bg-white/88 px-2 py-2 shadow-[0_22px_70px_rgba(50,32,24,0.16)] backdrop-blur-2xl"><div className="flex items-end justify-between">{items.map((item) => { const active = pathname === item.href; const central = item.href === "/dashboard"; return <Link key={item.href} href={item.href} className="flex min-w-[58px] flex-col items-center"><span className={cn("flex items-center justify-center transition", central ? "-mt-7 h-16 w-16 rounded-[1.5rem] bg-[#54382B] text-white shadow-lg ring-[6px] ring-[#F8F3EE]" : active ? "h-11 w-11 rounded-2xl bg-[#EFE4DB] text-[#5E4030]" : "h-11 w-11 text-[#9B8677]")}><item.icon className={central ? "h-6 w-6" : "h-5 w-5"} /></span><span className={cn("mt-1 text-[10px]", active || central ? "font-medium text-[#5E4030]" : "text-[#9B8677]", central && "-mt-1")}>{item.label}</span></Link>; })}</div></div></nav>;
}
