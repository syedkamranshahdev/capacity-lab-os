"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, Compass, RefreshCw, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthLoadingScreen } from "@/components/ui/AuthLoadingScreen";
import { getAssessment, getCheckIns } from "@/lib/capacity/data";
import {
  capacityDimensions,
  dimensionMeta,
  scoreToWords,
  type CapacityCheckIn,
  type CapacityResult,
} from "@/lib/capacity/model";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [result, setResult] = useState<CapacityResult | null>(null);
  const [checkIns, setCheckIns] = useState<CapacityCheckIn[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    Promise.all([getAssessment(user.id), getCheckIns(user.id)]).then(([assessment, entries]) => {
      if (!active) return;
      setResult(assessment);
      setCheckIns(entries);
      setDataLoading(false);
    });
    return () => { active = false; };
  }, [user?.id]);

  const firstName = user?.fullName?.split(" ")[0] || "there";
  const today = new Date().toISOString().slice(0, 10);
  const todaysCheckIn = checkIns.find((item) => item.date === today);
  const latestCheckIn = checkIns[checkIns.length - 1];
  const updatedLabel = useMemo(() => result ? new Date(result.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "", [result]);

  if (loading || dataLoading) return <AuthLoadingScreen />;

  if (!result) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <section className="relative overflow-hidden rounded-[2.8rem] bg-[#34231C] px-7 py-12 text-white shadow-[0_28px_90px_rgba(60,40,30,0.20)] sm:px-12 lg:px-16 lg:py-20">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#C09370]/15 blur-3xl" />
          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-[#E2C7B0]"><Compass className="h-3.5 w-3.5" /> Your first step</div>
            <h1 className="mt-6 font-serif text-5xl leading-[1.02] sm:text-6xl">Your Capacity Map starts with what you notice.</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/68">The State Check connects five self-reported signals and gives you one clear place to begin—without diagnosing or forcing your body into a generic rule.</p>
            <Link href="/state-check" className="mt-9 inline-flex min-h-14 items-center gap-2 rounded-2xl bg-white px-6 text-sm font-medium text-[#3F2A20] hover:-translate-y-0.5">Take my Capacity State Check <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2.8rem] bg-[#34231C] p-7 text-white shadow-[0_28px_90px_rgba(60,40,30,0.20)] sm:p-10 lg:p-12">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#C09370]/15 blur-3xl" />
        <div className="relative grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-[#E2C7B0]"><Sparkles className="h-3.5 w-3.5" /> Updated {updatedLabel}</div>
            <h1 className="mt-6 font-serif text-5xl leading-[1.02] sm:text-6xl">Your Capacity Map,<br /><span className="text-[#E1C1A5]">{firstName}.</span></h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/68">{result.summary}</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/8 p-6 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Current capacity state</p>
            <div className="mt-4 flex items-end justify-between gap-4"><div className="flex items-end gap-3"><span className="font-serif text-7xl leading-none">{latestCheckIn ? Math.round((latestCheckIn.energy + latestCheckIn.sleep + latestCheckIn.regulation + latestCheckIn.recovery + latestCheckIn.readiness) / 5) : result.overall}</span><span className="pb-2 text-sm text-white/45">/ 100</span></div><span className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-[#E5C7AE]">{result.status}</span></div>
            <p className="mt-5 border-t border-white/10 pt-5 text-sm text-white/60">Start with <span className="text-white">{dimensionMeta[result.primaryFocus].label.toLowerCase()}</span>, then watch what changes around it.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {capacityDimensions.map((dimension) => {
          const value = latestCheckIn?.[dimension] ?? result.scores[dimension];
          return (
            <article key={dimension} className="rounded-[2rem] border border-[#E5D9CF] bg-white p-5 shadow-[0_10px_35px_rgba(68,45,31,0.04)]">
              <div className="flex items-center justify-between"><span className="text-xs uppercase tracking-[0.16em] text-[#927866]">{dimensionMeta[dimension].shortLabel}</span><span className="font-serif text-3xl text-[#483329]">{value}</span></div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#EDE5DE]"><div className="h-full rounded-full bg-gradient-to-r from-[#B98560] to-[#54382B]" style={{ width: String(value) + "%" }} /></div>
              <p className="mt-4 text-sm font-medium text-[#5D493D]">{scoreToWords(value)}</p>
              <p className="mt-1 text-xs leading-5 text-[#917E70]">{dimensionMeta[dimension].description}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[2.3rem] border border-[#E5D9CF] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-5"><div><p className="text-[11px] uppercase tracking-[0.22em] text-[#987D68]">What connects</p><h2 className="mt-2 font-serif text-4xl text-[#3E2D24]">Patterns worth watching</h2></div><Compass className="h-5 w-5 text-[#9D7658]" /></div>
          <div className="mt-7 space-y-3">{result.connections.map((connection) => <div key={connection} className="rounded-3xl border border-[#E9DED5] bg-[#FBF8F4] p-5 text-sm leading-6 text-[#6E5B4E]">{connection}</div>)}</div>
          <p className="mt-5 text-xs leading-5 text-[#988679]">Connections are generated from your own entries. They are prompts for reflection, not causal or medical conclusions.</p>
        </article>

        <div className="space-y-5">
          <article className="rounded-[2.3rem] border border-[#E5D9CF] bg-[#F0E5DB] p-6 sm:p-8">
            <div className="flex items-center justify-between"><CalendarDays className="h-5 w-5 text-[#6C4B39]" />{todaysCheckIn && <span className="inline-flex items-center gap-1.5 rounded-full bg-white/65 px-3 py-1.5 text-xs text-[#5C483B]"><CheckCircle2 className="h-3.5 w-3.5" /> Recorded</span>}</div>
            <h2 className="mt-6 font-serif text-4xl text-[#3E2D24]">{todaysCheckIn ? "Today is in your pattern." : "Add today’s context."}</h2>
            <p className="mt-3 text-sm leading-6 text-[#6E5B4E]">{todaysCheckIn ? "Your next insight becomes more useful as real days accumulate." : "A 60-second check-in updates your map with energy, sleep, regulation, recovery and readiness."}</p>
            <Link href="/check-in" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#4B3328] px-5 text-sm font-medium text-white">{todaysCheckIn ? "Update today’s check-in" : "Check in now"}<ArrowRight className="h-4 w-4" /></Link>
          </article>

          <article className="rounded-[2.3rem] border border-[#E5D9CF] bg-white p-6">
            <div className="flex items-center justify-between"><div><p className="text-[11px] uppercase tracking-[0.2em] text-[#987D68]">Next useful action</p><p className="mt-2 text-sm leading-6 text-[#5E4B3F]">{result.nextSteps[0]}</p></div></div>
            <div className="mt-5 flex gap-3"><Link href="/progress" className="inline-flex flex-1 items-center justify-center rounded-xl border border-[#DED0C4] px-4 py-3 text-sm text-[#644F42]">View patterns</Link><Link href="/state-check" aria-label="Retake State Check" className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#DED0C4] text-[#644F42]"><RefreshCw className="h-4 w-4" /></Link></div>
          </article>
        </div>
      </section>
    </div>
  );
}
