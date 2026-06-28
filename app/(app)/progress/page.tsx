"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Compass, Loader2, Sparkles } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "@/context/AuthContext";
import { getCheckIns } from "@/lib/capacity/data";
import { capacityDimensions, dimensionMeta, type CapacityCheckIn } from "@/lib/capacity/model";

function average(entries: CapacityCheckIn[], key: "energy" | "sleep" | "regulation" | "recovery" | "readiness") {
  if (!entries.length) return 0;
  return Math.round(entries.reduce((sum, item) => sum + item[key], 0) / entries.length);
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<CapacityCheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    getCheckIns(user.id).then((items) => { setEntries(items); setLoading(false); });
  }, [user?.id]);

  const recent = entries.slice(-14);
  const chartData = useMemo(() => recent.map((item) => ({
    ...item,
    label: new Date(item.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  })), [recent]);

  const averages = useMemo(() => ({
    energy: average(recent, "energy"),
    sleep: average(recent, "sleep"),
    regulation: average(recent, "regulation"),
    recovery: average(recent, "recovery"),
    readiness: average(recent, "readiness"),
  }), [recent]);

  const connections = useMemo(() => {
    const items: string[] = [];
    if (averages.sleep && averages.sleep < 55 && averages.energy < 58) items.push("Lower sleep restoration and lower energy are appearing in the same window. Keep observing both before changing your plan.");
    if (averages.regulation && averages.regulation < 55 && averages.recovery < 58) items.push("Stress regulation and recovery reserve are both below your current baseline. Reducing total load may be a useful experiment.");
    if (averages.readiness && averages.readiness < averages.recovery - 12) items.push("Training readiness is trailing recovery. Motivation, soreness or life context may explain more than recovery alone.");
    const phases = recent.filter((item) => item.cycleContext && !["Not recorded", "Not applicable"].includes(item.cycleContext));
    if (phases.length) items.push("Cycle context is visible in your timeline. More entries are needed before treating any difference as a personal pattern.");
    if (!items.length && recent.length) items.push("No strong connection is visible yet. Continue recording real days rather than filling the gaps with assumptions.");
    return items;
  }, [averages, recent]);

  if (loading) return <div className="flex min-h-[65vh] items-center justify-center gap-3 text-[#73513F]"><Loader2 className="h-5 w-5 animate-spin" /><span className="text-sm">Connecting your entries…</span></div>;

  if (!entries.length) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
        <section className="rounded-[2.7rem] border border-[#E3D7CC] bg-white p-8 text-center shadow-sm sm:p-14">
          <Compass className="mx-auto h-10 w-10 text-[#9A7558]" />
          <p className="mt-6 text-[11px] uppercase tracking-[0.24em] text-[#9A7558]">Your patterns</p>
          <h1 className="mt-3 font-serif text-5xl text-[#3E2D24]">Real insights need real days.</h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#766458]">Your connections view starts empty on purpose. Complete a check-in and Capacity Lab will build a timeline from what you actually record.</p>
          <Link href="/check-in" className="mt-8 inline-flex min-h-13 items-center gap-2 rounded-2xl bg-[#4B3328] px-6 py-3.5 text-sm font-medium text-white">Record my first day <ArrowRight className="h-4 w-4" /></Link>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-7 lg:px-8">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#E0D4C9] bg-white px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-[#846B59]"><Sparkles className="h-3.5 w-3.5" /> Connections</div>
        <h1 className="mt-4 font-serif text-5xl text-[#3E2D24]">Your signals, in context.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#77675B]">This view uses only the days you recorded. It highlights co-occurring signals without claiming that one caused another.</p>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {capacityDimensions.map((dimension) => <article key={dimension} className="rounded-2xl border border-[#E4D8CE] bg-white p-4"><p className="text-[10px] uppercase tracking-[0.16em] text-[#967D6A]">{dimensionMeta[dimension].shortLabel}</p><p className="mt-2 font-serif text-3xl text-[#3E2D24]">{averages[dimension]}</p><p className="mt-1 text-xs text-[#9B897B]">{recent.length}-day average</p></article>)}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.45fr_0.55fr]">
        <article className="rounded-[2.3rem] border border-[#E4D8CE] bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-start justify-between gap-4"><div><p className="text-[11px] uppercase tracking-[0.2em] text-[#967D6A]">Signal timeline</p><h2 className="mt-2 font-serif text-3xl text-[#3E2D24]">What moved together</h2></div><span className="rounded-full bg-[#F2E9E1] px-3 py-1.5 text-xs text-[#745747]">Last {recent.length} entries</span></div>
          <div className="h-[340px] w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData} margin={{ left: -15, right: 12 }}><CartesianGrid stroke="#EEE5DE" vertical={false} strokeDasharray="3 3" /><XAxis dataKey="label" tick={{ fontSize: 11, fill: "#927E70" }} axisLine={false} tickLine={false} /><YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#927E70" }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: 16, border: "1px solid #E5D9CF", boxShadow: "0 15px 40px rgba(60,40,30,.08)" }} /><Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} /><Line type="monotone" dataKey="energy" name="Energy" stroke="#A46F4D" strokeWidth={2.5} dot={{ r: 3 }} /><Line type="monotone" dataKey="sleep" name="Sleep" stroke="#71658C" strokeWidth={2.5} dot={{ r: 3 }} /><Line type="monotone" dataKey="regulation" name="Regulation" stroke="#73907D" strokeWidth={2.5} dot={{ r: 3 }} /><Line type="monotone" dataKey="recovery" name="Recovery" stroke="#4E8798" strokeWidth={2.5} dot={{ r: 3 }} /><Line type="monotone" dataKey="readiness" name="Readiness" stroke="#C08B68" strokeWidth={2.5} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></div>
        </article>

        <article className="rounded-[2.3rem] bg-[#34231C] p-6 text-white shadow-lg sm:p-8">
          <Compass className="h-5 w-5 text-[#D9B99D]" />
          <p className="mt-7 text-[11px] uppercase tracking-[0.22em] text-[#D9B99D]">Connection notes</p>
          <div className="mt-5 space-y-4">{connections.map((item) => <p key={item} className="rounded-2xl border border-white/10 bg-white/7 p-4 text-sm leading-6 text-white/68">{item}</p>)}</div>
          <Link href="/check-in" className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-medium text-[#3D2A21]">Add today’s context <ArrowRight className="h-4 w-4" /></Link>
        </article>
      </section>

      <section className="rounded-[2.3rem] border border-[#E4D8CE] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3"><CalendarDays className="h-5 w-5 text-[#8D674F]" /><h2 className="font-serif text-3xl text-[#3E2D24]">Recent reflections</h2></div>
        <div className="mt-6 divide-y divide-[#EEE5DE]">{recent.slice().reverse().map((entry) => <div key={entry.id} className="grid gap-3 py-5 sm:grid-cols-[140px_1fr_auto] sm:items-center"><div><p className="text-sm font-medium text-[#4A392F]">{new Date(entry.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p><p className="mt-1 text-xs text-[#9A887B]">{entry.cycleContext}</p></div><div><p className="text-sm text-[#6C5A4E]">{entry.note || "No note added."}</p>{entry.symptoms.length > 0 && <p className="mt-2 text-xs text-[#9A887B]">Context: {entry.symptoms.join(" · ")}</p>}</div><span className="w-fit rounded-full bg-[#F1E8E0] px-3 py-1.5 text-xs text-[#6C4D3A]">{Math.round((entry.energy + entry.sleep + entry.regulation + entry.recovery + entry.readiness) / 5)}</span></div>)}</div>
      </section>
    </div>
  );
}
