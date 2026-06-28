"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarCheck2, ChevronLeft, ChevronRight, ClipboardList, Home, LayoutDashboard, Leaf, LogOut, Settings, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "State Check", href: "/state-check", icon: Home },
  { label: "Capacity Map", href: "/dashboard", icon: LayoutDashboard },
  { label: "Check-in", href: "/check-in", icon: CalendarCheck2 },
  { label: "Practices", href: "/protocols", icon: ClipboardList },
  { label: "Connections", href: "/progress", icon: TrendingUp },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const supabase = createClient();
  const fullName = user?.fullName || "Capacity Member";
  const initials = fullName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "CM";

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <motion.aside animate={{ width: collapsed ? 84 : 280 }} transition={{ duration: 0.3 }} className="relative hidden h-screen shrink-0 flex-col overflow-hidden border-r border-[#E9DED2]/70 bg-[rgba(251,248,245,0.88)] backdrop-blur-2xl lg:flex">
      <div className={cn("flex h-[78px] items-center border-b border-[#EEE4DA]/70 px-5", collapsed ? "justify-center" : "justify-between")}>
        <Link href="/" aria-label="Capacity Lab home" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7A553D] to-[#493127] text-white shadow-lg"><Leaf className="h-4 w-4" /></span>
          {!collapsed && <span><span className="block font-serif text-xl text-[#4B3326]">Capacity Lab</span><span className="mt-1 block text-[9px] uppercase tracking-[0.2em] text-[#A08978]">Understand · Align · Thrive</span></span>}
        </Link>
        <button aria-label={collapsed ? "Expand navigation" : "Collapse navigation"} onClick={() => setCollapsed((value) => !value)} className={cn("flex h-8 w-8 items-center justify-center rounded-full bg-[#F3ECE5] text-[#6B4A36]", collapsed && "absolute right-0 translate-x-1/2")}>{collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}</button>
      </div>

      {!collapsed && <div className="px-4 pt-5"><div className="rounded-[1.7rem] border border-[#EADFD4] bg-white/80 p-4 shadow-sm">
        {loading ? <div className="h-14 animate-pulse rounded-2xl bg-[#EFE6DE]" /> : <><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5A3D2F] text-sm font-semibold text-white">{initials}</span><div className="min-w-0"><p className="truncate text-sm font-semibold text-[#4B3326]">{fullName}</p><p className="truncate text-xs text-[#9A8475]">Founding member</p></div></div><div className="mt-4 rounded-2xl bg-[#F6F0EA] px-3 py-3"><p className="text-[10px] uppercase tracking-[0.18em] text-[#9A8475]">Private pattern space</p><p className="mt-1 text-xs text-[#6B4A36]">Your entries, in context</p></div></>}
      </div></div>}

      <nav aria-label="Member navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {navItems.map((item) => { const active = pathname === item.href; return <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined} className={cn("group relative flex items-center gap-3 rounded-2xl transition", collapsed ? "h-14 justify-center" : "px-4 py-3", active ? "bg-gradient-to-br from-[#7A553D] to-[#493127] text-white shadow-lg" : "text-[#7B6859] hover:bg-[#F3ECE5]")}><item.icon className="relative z-10 h-[18px] w-[18px] shrink-0" />{!collapsed && <span className="relative z-10 text-sm font-medium">{item.label}</span>}</Link>; })}
      </nav>

      <div className="border-t border-[#EEE4DA]/70 px-3 py-4"><button onClick={handleLogout} title={collapsed ? "Sign out" : undefined} className={cn("flex w-full items-center gap-3 rounded-2xl text-[#8B7665] hover:bg-[#F3ECE5]", collapsed ? "h-14 justify-center" : "px-4 py-3")}><LogOut className="h-[18px] w-[18px]" />{!collapsed && <span className="text-sm font-medium">Sign out</span>}</button></div>
    </motion.aside>
  );
}
