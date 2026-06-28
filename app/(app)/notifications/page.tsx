"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell, CheckCircle2, Compass, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getAssessment, getCheckIns } from "@/lib/capacity/data";
import { dimensionMeta, type CapacityCheckIn, type CapacityResult } from "@/lib/capacity/model";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [result, setResult] = useState<CapacityResult | null>(null);
  const [entries, setEntries] = useState<CapacityCheckIn[]>([]);
  useEffect(() => { if (!user?.id) return; Promise.all([getAssessment(user.id), getCheckIns(user.id)]).then(([map, items]) => { setResult(map); setEntries(items); }); }, [user?.id]);
  const today = new Date().toISOString().slice(0, 10);
  const checkedIn = entries.some((item) => item.date === today);
  const latest = entries[entries.length - 1];

  const notices = [
    !result ? { icon: Compass, title: "Your Capacity Map is ready to begin", text: "Complete the State Check to create your first connected view.", href: "/state-check", action: "Begin" } : { icon: Sparkles, title: "Your current focus", text: "Your map points to " + dimensionMeta[result.primaryFocus].label.toLowerCase() + " as the clearest place to begin.", href: "/dashboard", action: "Open map" },
    !checkedIn ? { icon: Bell, title: "Add today’s context", text: "A 60-second check-in helps turn a snapshot into your own pattern.", href: "/check-in", action: "Check in" } : { icon: CheckCircle2, title: "Today is recorded", text: "Your latest state is now part of your personal timeline.", href: "/progress", action: "View pattern" },
    latest && entries.length >= 3 ? { icon: Compass, title: "A pattern is beginning", text: String(entries.length) + " real entries are now available to review together.", href: "/progress", action: "Review" } : null,
  ].filter(Boolean) as Array<{ icon: typeof Bell; title: string; text: string; href: string; action: string }>;

  return <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8"><header><div className="inline-flex items-center gap-2 rounded-full border border-[#E0D4C9] bg-white px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-[#846B59]"><Bell className="h-3.5 w-3.5" /> Gentle updates</div><h1 className="mt-4 font-serif text-5xl text-[#3E2D24]">Useful, not noisy.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-[#77675B]">Only reminders connected to the experience you have actually completed.</p></header><section className="mt-8 space-y-3">{notices.map((notice) => <article key={notice.title} className="flex flex-col gap-5 rounded-[2rem] border border-[#E4D8CE] bg-white p-6 shadow-sm sm:flex-row sm:items-center"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F0E6DD] text-[#76513D]"><notice.icon className="h-5 w-5" /></span><div className="flex-1"><h2 className="font-serif text-2xl text-[#3E2D24]">{notice.title}</h2><p className="mt-2 text-sm leading-6 text-[#7A685B]">{notice.text}</p></div><Link href={notice.href} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#DCCFC3] px-4 text-sm text-[#604B3E]">{notice.action}<ArrowRight className="h-4 w-4" /></Link></article>)}</section></div>;
}
