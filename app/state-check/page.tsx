"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Leaf, LockKeyhole, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  calculateCapacityResult,
  capacityDimensions,
  capacityQuestions,
  dimensionMeta,
  scoreToWords,
  type CapacityAnswers,
  type CapacityResult,
} from "@/lib/capacity/model";
import { saveAssessment } from "@/lib/capacity/data";

export default function StateCheckPage() {
  const { user } = useAuth();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<CapacityAnswers>({});
  const [result, setResult] = useState<CapacityResult | null>(null);
  const [saving, setSaving] = useState(false);
  const question = capacityQuestions[step];
  const progress = Math.round(((step + 1) / capacityQuestions.length) * 100);
  const selected = answers[question?.id];

  const completedDate = useMemo(
    () => result ? new Date(result.completedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "",
    [result],
  );

  async function choose(value: string) {
    const nextAnswers = { ...answers, [question.id]: value };
    setAnswers(nextAnswers);
    if (step < capacityQuestions.length - 1) {
      window.setTimeout(() => setStep((current) => current + 1), 160);
      return;
    }
    setSaving(true);
    const nextResult = calculateCapacityResult(nextAnswers);
    await saveAssessment(nextResult, nextAnswers, user?.id);
    setResult(nextResult);
    setSaving(false);
  }

  function restart() {
    setAnswers({});
    setResult(null);
    setStep(0);
    setStarted(true);
  }

  if (result) {
    return (
      <main className="min-h-screen bg-[#F6F1EA] px-4 py-6 sm:px-6 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <header className="mb-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 text-[#3E2D24]">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#493127] text-white"><Leaf className="h-4 w-4" /></span>
              <span className="font-serif text-xl">Capacity Lab</span>
            </Link>
            <span className="rounded-full border border-[#DCCFC3] bg-white/70 px-3 py-1.5 text-xs text-[#7B6859]">Completed {completedDate}</span>
          </header>

          <section className="overflow-hidden rounded-[2.4rem] bg-[#30211B] text-white shadow-[0_28px_90px_rgba(60,40,30,0.20)]">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative overflow-hidden p-7 sm:p-10 lg:p-12">
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#B68A62]/20 blur-3xl" />
                <div className="relative">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#D7B99F]">Your current capacity state</p>
                  <div className="mt-8 flex items-end gap-4">
                    <span className="font-serif text-8xl leading-none">{result.overall}</span>
                    <div className="pb-2"><p className="text-sm text-white/55">out of 100</p><p className="mt-1 text-lg text-[#E7CDB6]">{result.status}</p></div>
                  </div>
                  <p className="mt-8 max-w-md text-base leading-7 text-white/72">{result.summary}</p>
                  <div className="mt-8 rounded-3xl border border-white/10 bg-white/7 p-5">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Start here</p>
                    <p className="mt-2 font-serif text-3xl text-[#F3DED0]">{dimensionMeta[result.primaryFocus].label}</p>
                    <p className="mt-2 text-sm leading-6 text-white/60">{dimensionMeta[result.primaryFocus].description}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#FCFAF7] p-6 text-[#3E2D24] sm:p-10 lg:p-12">
                <div className="flex items-center justify-between gap-4">
                  <div><p className="text-[11px] uppercase tracking-[0.24em] text-[#9A7D68]">Capacity map</p><h1 className="mt-2 font-serif text-4xl">Five signals, one context</h1></div>
                  <Sparkles className="h-5 w-5 text-[#9A7558]" />
                </div>
                <div className="mt-8 space-y-5">
                  {capacityDimensions.map((dimension) => {
                    const score = result.scores[dimension];
                    return (
                      <div key={dimension}>
                        <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                          <span>{dimensionMeta[dimension].shortLabel}</span>
                          <span className="text-[#806B5D]">{scoreToWords(score)} · {score}</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-[#EAE1D8]"><div className="h-full rounded-full bg-gradient-to-r from-[#B88660] to-[#51362A]" style={{ width: String(score) + "%" }} /></div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-9 rounded-3xl border border-[#E6DAD0] bg-white p-5">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#9A7D68]">A connection worth watching</p>
                  <p className="mt-3 text-sm leading-6 text-[#675448]">{result.connections[0]}</p>
                </div>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href={user ? "/dashboard" : "/signup"} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#4B3328] px-5 text-sm font-medium text-white hover:bg-[#35231C]">
                    {user ? "Open my Capacity Map" : "Save my Capacity Map"}<ArrowRight className="h-4 w-4" />
                  </Link>
                  <button onClick={restart} className="min-h-12 rounded-2xl border border-[#DCCFC3] px-5 text-sm text-[#654F42] hover:bg-white">Retake check</button>
                </div>
              </div>
            </div>
          </section>
          <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-5 text-[#8D796B]">Educational reflection only. Capacity Lab does not diagnose conditions, interpret laboratory results or replace individualized medical care.</p>
        </div>
      </main>
    );
  }

  if (!started) {
    return (
      <main className="relative flex min-h-screen items-center overflow-hidden bg-[#F7F2EC] px-5 py-10">
        <div className="absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[#E4D5C8] blur-3xl" />
        <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2.8rem] border border-white/70 bg-white/70 shadow-[0_30px_100px_rgba(73,49,39,0.13)] backdrop-blur-xl lg:grid-cols-2">
          <div className="bg-[#30211B] p-8 text-white sm:p-12 lg:p-16">
            <Link href="/" className="inline-flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10"><Leaf className="h-4 w-4" /></span><span className="font-serif text-xl">Capacity Lab</span></Link>
            <p className="mt-16 text-[11px] uppercase tracking-[0.28em] text-[#D7B99F]">Capacity State Check</p>
            <h1 className="mt-4 max-w-lg font-serif text-5xl leading-[1.02] sm:text-6xl">Understand what your body is signalling today.</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/65">Seven thoughtful questions connect energy, sleep, stress regulation, recovery, training readiness and optional cycle context.</p>
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E2D6CC] bg-white px-3 py-1.5 text-xs text-[#765E4E]"><LockKeyhole className="h-3.5 w-3.5" /> Private by design</div>
            <h2 className="mt-6 font-serif text-4xl text-[#3E2D24]">A clearer place to begin.</h2>
            <div className="mt-7 space-y-4 text-sm leading-6 text-[#6D5B4E]">
              {["Takes about two minutes", "Creates a five-signal Capacity Map", "Looks for patterns without diagnosing", "Adapts as your own check-ins accumulate"].map((item) => <div key={item} className="flex gap-3"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EDE2D8]"><Check className="h-3 w-3" /></span><span>{item}</span></div>)}
            </div>
            <button onClick={() => setStarted(true)} className="mt-9 inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#4B3328] px-6 text-sm font-medium text-white shadow-lg hover:-translate-y-0.5 hover:bg-[#35231C]">Begin my State Check <ArrowRight className="h-4 w-4" /></button>
            <p className="mt-4 text-xs leading-5 text-[#907D70]">No universal cycle rules. No medical diagnosis. Your answers are used to reflect your own patterns.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F1EA] px-4 py-6 sm:px-6 lg:py-10">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 text-[#3E2D24]"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#493127] text-white"><Leaf className="h-4 w-4" /></span><span className="hidden font-serif text-xl sm:block">Capacity Lab</span></Link>
          <div className="min-w-[150px] flex-1 sm:max-w-xs"><div className="mb-2 flex justify-between text-xs text-[#826E60]"><span>State Check</span><span>{step + 1} / {capacityQuestions.length}</span></div><div className="h-2 overflow-hidden rounded-full bg-[#E4D9CF]"><motion.div className="h-full rounded-full bg-[#5A3C2E]" animate={{ width: String(progress) + "%" }} /></div></div>
        </header>

        <AnimatePresence mode="wait">
          <motion.section key={question.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mt-8 rounded-[2.5rem] border border-[#E3D7CC] bg-white/85 p-6 shadow-[0_24px_80px_rgba(73,49,39,0.08)] sm:p-10 lg:p-12">
            <p className="text-[11px] uppercase tracking-[0.26em] text-[#9A7558]">{question.eyebrow}</p>
            <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-tight text-[#3E2D24] sm:text-5xl">{question.title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#786659]">{question.description}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {question.options.map((option) => (
                <button key={option.value} disabled={saving} onClick={() => choose(option.value)} className={"group min-h-[92px] rounded-3xl border p-5 text-left transition hover:-translate-y-0.5 hover:border-[#A47A5C] hover:shadow-md " + (selected === option.value ? "border-[#6B4937] bg-[#F4ECE5]" : "border-[#E5DAD0] bg-[#FCFAF7]") }>
                  <div className="flex items-start justify-between gap-4"><div><p className="font-medium text-[#49362B]">{option.label}</p>{option.description && <p className="mt-2 text-xs leading-5 text-[#8B786A]">{option.description}</p>}</div><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#D9CBBF] text-[#6B4937]">{selected === option.value ? <Check className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100" />}</span></div>
                </button>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between">
              <button disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#735F52] disabled:opacity-30"><ArrowLeft className="h-4 w-4" /> Previous</button>
              <p className="text-xs text-[#9A887B]">Choose the closest answer—there is no perfect response.</p>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
    </main>
  );
}
