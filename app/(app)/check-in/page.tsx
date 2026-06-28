"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, ChevronRight, CircleCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  capacityDimensions,
  createCheckInResult,
  dimensionMeta,
  scoreToWords,
  type CapacityCheckIn,
  type CapacityDimension,
} from "@/lib/capacity/model";
import { saveCheckIn } from "@/lib/capacity/data";

const scaleLabels: Record<CapacityDimension, [string, string]> = {
  energy: ["Depleted", "Steady"],
  sleep: ["Unrestored", "Restored"],
  regulation: ["Activated", "Settled"],
  recovery: ["Behind", "Recovered"],
  readiness: ["Protect", "Ready"],
};

const symptomOptions = ["Low energy", "Poor sleep", "Soreness", "Brain fog", "High stress", "Cravings", "Cycle discomfort"];
const cycleOptions = ["Not recorded", "Menstrual", "Follicular", "Ovulatory", "Luteal", "Unsure / variable", "Not applicable"];

export default function CheckInPage() {
  const { user } = useAuth();
  const [scores, setScores] = useState<Record<CapacityDimension, number>>({ energy: 60, sleep: 60, regulation: 60, recovery: 60, readiness: 60 });
  const [cycleContext, setCycleContext] = useState("Not recorded");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<ReturnType<typeof createCheckInResult> | null>(null);

  const today = useMemo(() => {
    const date = new Date();
    const offset = date.getTimezoneOffset() * 60_000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 10);
  }, []);

  function toggleSymptom(symptom: string) {
    setSymptoms((current) => current.includes(symptom) ? current.filter((item) => item !== symptom) : [...current, symptom]);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const checkIn: CapacityCheckIn = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      date: today,
      createdAt: new Date().toISOString(),
      ...scores,
      cycleContext,
      symptoms,
      note: note.trim(),
    };
    await saveCheckIn(checkIn, user?.id);
    setSaved(createCheckInResult(checkIn));
    setSaving(false);
  }

  if (saved) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <section className="overflow-hidden rounded-[2.5rem] border border-[#DFD2C7] bg-white shadow-[0_25px_80px_rgba(70,45,32,0.10)]">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            <div className="bg-[#34231C] p-8 text-white sm:p-12">
              <CircleCheck className="h-10 w-10 text-[#D9B99D]" />
              <p className="mt-8 text-[11px] uppercase tracking-[0.25em] text-[#D9B99D]">Today is recorded</p>
              <h1 className="mt-3 font-serif text-5xl">Your capacity is {saved.status.toLowerCase()}.</h1>
              <p className="mt-5 text-sm leading-6 text-white/65">One check-in is a snapshot. A week of check-ins begins to reveal your own pattern.</p>
            </div>
            <div className="p-7 sm:p-10">
              <div className="flex items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.22em] text-[#9B806C]">Today’s capacity</p><p className="mt-2 font-serif text-6xl text-[#3E2D24]">{saved.overall}</p></div><span className="rounded-full bg-[#F0E6DD] px-4 py-2 text-sm text-[#6D4B39]">{scoreToWords(saved.overall)}</span></div>
              <div className="mt-8 rounded-3xl border border-[#E8DDD4] bg-[#FBF8F4] p-5"><p className="text-[11px] uppercase tracking-[0.2em] text-[#9B806C]">Signal asking for attention</p><p className="mt-2 font-serif text-3xl text-[#3E2D24]">{dimensionMeta[saved.primaryFocus].label}</p><p className="mt-2 text-sm leading-6 text-[#776356]">{dimensionMeta[saved.primaryFocus].description}</p></div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link href="/dashboard" className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#4B3328] px-5 text-sm font-medium text-white">Open Capacity Map <ChevronRight className="h-4 w-4" /></Link><Link href="/progress" className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#DCCFC3] px-5 text-sm text-[#654F42]">View patterns</Link></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <div className="mb-8"><div className="inline-flex items-center gap-2 rounded-full border border-[#E0D4C9] bg-white px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-[#846B59]"><Sparkles className="h-3.5 w-3.5" /> 60-second check-in</div><h1 className="mt-4 font-serif text-5xl text-[#3E2D24]">What is your body signalling today?</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-[#77675B]">Record the signal before interpreting it. Over time, Capacity Lab helps you notice what moves together.</p></div>
      <form onSubmit={submit} className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2.2rem] border border-[#E4D8CE] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-3xl text-[#3E2D24]">Five capacity signals</h2>
          <div className="mt-8 space-y-8">
            {capacityDimensions.map((dimension) => (
              <label key={dimension} className="block">
                <div className="mb-3 flex items-end justify-between gap-4"><div><p className="font-medium text-[#47362C]">{dimensionMeta[dimension].label}</p><p className="mt-1 text-xs text-[#8C796B]">{dimensionMeta[dimension].description}</p></div><span className="font-serif text-2xl text-[#6A4B3A]">{scores[dimension]}</span></div>
                <input aria-label={dimensionMeta[dimension].label} type="range" min="20" max="100" step="10" value={scores[dimension]} onChange={(event) => setScores((current) => ({ ...current, [dimension]: Number(event.target.value) }))} className="h-2 w-full cursor-pointer accent-[#664535]" />
                <div className="mt-2 flex justify-between text-[11px] text-[#A08B7D]"><span>{scaleLabels[dimension][0]}</span><span>{scaleLabels[dimension][1]}</span></div>
              </label>
            ))}
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-[2.2rem] border border-[#E4D8CE] bg-white p-6 shadow-sm">
            <h2 className="font-serif text-3xl text-[#3E2D24]">Add context</h2>
            <label className="mt-6 block text-sm font-medium text-[#5C493D]">Cycle context <span className="font-normal text-[#9B887B]">(optional)</span><select value={cycleContext} onChange={(event) => setCycleContext(event.target.value)} className="mt-2 w-full rounded-2xl border border-[#DDD0C5] bg-[#FCFAF7] px-4 py-3 text-sm outline-none focus:border-[#9A7558]">{cycleOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
            <div className="mt-6"><p className="text-sm font-medium text-[#5C493D]">Anything noticeable?</p><div className="mt-3 flex flex-wrap gap-2">{symptomOptions.map((symptom) => <button key={symptom} type="button" onClick={() => toggleSymptom(symptom)} className={"inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs " + (symptoms.includes(symptom) ? "border-[#6B4937] bg-[#F0E5DB] text-[#50372A]" : "border-[#DFD3C9] bg-white text-[#7D695C]")}>{symptoms.includes(symptom) && <Check className="h-3 w-3" />}{symptom}</button>)}</div></div>
            <label className="mt-6 block text-sm font-medium text-[#5C493D]">One useful note <textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={280} placeholder="What changed, helped, or felt different?" className="mt-2 min-h-[110px] w-full resize-none rounded-2xl border border-[#DDD0C5] bg-[#FCFAF7] px-4 py-3 text-sm outline-none focus:border-[#9A7558]" /></label>
          </section>
          <button disabled={saving} type="submit" className="min-h-14 w-full rounded-2xl bg-[#4B3328] px-6 text-sm font-medium text-white shadow-lg hover:-translate-y-0.5 disabled:opacity-60">{saving ? "Saving today’s state…" : "Save today’s state"}</button>
          <p className="px-3 text-center text-xs leading-5 text-[#8D796B]">For educational pattern awareness only. This check-in does not provide medical or training clearance.</p>
        </div>
      </form>
    </div>
  );
}
