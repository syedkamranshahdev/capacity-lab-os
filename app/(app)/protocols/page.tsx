"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BatteryMedium,
  Brain,
  Check,
  CircleGauge,
  ClipboardList,
  Moon,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  createCheckInResult,
  dimensionMeta,
  type CapacityDimension,
} from "@/lib/capacity/model";
import { getAssessment, getCheckIns } from "@/lib/capacity/data";

function localDateKey() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

type Practice = {
  id: string;
  title: string;
  description: string;
  experiment: string;
  minutes: string;
  icon: ComponentType<{ className?: string }>;
};

const practicesBySignal: Record<CapacityDimension, Practice[]> = {
  energy: [
    {
      id: "energy-window",
      title: "Map one energy window",
      description: "Notice when energy felt most available today and what was happening around it.",
      experiment: "Write down one higher-energy window and one lower-energy window. No need to explain either yet.",
      minutes: "3 min",
      icon: BatteryMedium,
    },
    {
      id: "one-demand-less",
      title: "Reduce one non-essential demand",
      description: "Protect a little capacity instead of trying to optimise the entire day.",
      experiment: "Choose one task that can be shortened, moved, delegated or left unfinished without meaningful consequence.",
      minutes: "2 min",
      icon: ClipboardList,
    },
  ],
  sleep: [
    {
      id: "sleep-runway",
      title: "Create a quieter runway",
      description: "Test a clearer transition between the day and the time you intend to sleep.",
      experiment: "For the final 20 minutes before bed, remove one stimulating input and notice whether settling feels different.",
      minutes: "20 min",
      icon: Moon,
    },
    {
      id: "restoration-note",
      title: "Record restoration, not perfection",
      description: "A sleep duration alone does not capture how restored you feel.",
      experiment: "Tomorrow morning, record perceived restoration before checking any wearable or sleep score.",
      minutes: "1 min",
      icon: ClipboardList,
    },
  ],
  regulation: [
    {
      id: "settling-pause",
      title: "Try a settling pause",
      description: "Create a short space after a demanding or stimulating moment.",
      experiment: "Sit comfortably and lengthen the exhale gently for five unforced breaths. Stop if it feels uncomfortable.",
      minutes: "2 min",
      icon: Brain,
    },
    {
      id: "input-boundary",
      title: "Set one input boundary",
      description: "Notice whether fewer simultaneous inputs make it easier to return to baseline.",
      experiment: "Choose one 15-minute window with notifications off and only one task open.",
      minutes: "15 min",
      icon: ClipboardList,
    },
  ],
  recovery: [
    {
      id: "demand-audit",
      title: "Name the recovery demand",
      description: "Training is only one source of load; work, travel, sleep and emotional demand count too.",
      experiment: "List the three largest demands from the last 48 hours and the recovery space available between them.",
      minutes: "4 min",
      icon: CircleGauge,
    },
    {
      id: "comfortable-reset",
      title: "Choose comfortable movement",
      description: "Use comfort and freshness as the boundary, rather than chasing a target.",
      experiment: "If movement feels appropriate, take a gentle walk or mobility break and stop before it becomes another demand.",
      minutes: "10 min",
      icon: BatteryMedium,
    },
  ],
  readiness: [
    {
      id: "readiness-decision",
      title: "Define today’s training lane",
      description: "Turn readiness into a deliberate choice instead of an all-or-nothing verdict.",
      experiment: "Choose one lane: restore, technique, normal or demanding. Write one reason based on today’s signals.",
      minutes: "2 min",
      icon: CircleGauge,
    },
    {
      id: "technique-first",
      title: "Use a technique-first start",
      description: "Let the opening minutes provide more information before deciding how far to progress.",
      experiment: "If training is suitable for you today, begin lighter than usual and reassess after the warm-up.",
      minutes: "10 min",
      icon: BatteryMedium,
    },
  ],
};

const reflectionPractice: Practice = {
  id: "one-line-reflection",
  title: "Close the loop",
  description: "A short reflection helps separate what happened from what you expected to happen.",
  experiment: "At the end of the day, write one sentence: ‘The signal that changed most was…’",
  minutes: "1 min",
  icon: ClipboardList,
};

export default function PracticesPage() {
  const { user } = useAuth();
  const [focus, setFocus] = useState<CapacityDimension | null>(null);
  const [basis, setBasis] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const today = useMemo(localDateKey, []);

  useEffect(() => {
    if (!user) return;
    let active = true;

    async function load() {
      const [checkIns, assessment] = await Promise.all([
        getCheckIns(user!.id),
        getAssessment(user!.id),
      ]);
      if (!active) return;

      const latest = checkIns.at(-1);
      if (latest) {
        setFocus(createCheckInResult(latest).primaryFocus);
        setBasis("Based on your latest check-in");
      } else if (assessment) {
        setFocus(assessment.primaryFocus);
        setBasis("Based on your Capacity State Check");
      }

      const stored = window.localStorage.getItem(
        `capacity-lab:practices:${user!.id}:${today}`,
      );
      if (stored) {
        try {
          setCompleted(JSON.parse(stored));
        } catch {
          setCompleted([]);
        }
      }
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [today, user]);

  const practices = focus ? [...practicesBySignal[focus], reflectionPractice] : [];

  function toggle(id: string) {
    if (!user) return;
    setCompleted((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      window.localStorage.setItem(
        `capacity-lab:practices:${user.id}:${today}`,
        JSON.stringify(next),
      );
      return next;
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-[#806D60]">
        Connecting today’s signals…
      </div>
    );
  }

  if (!focus) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <section className="rounded-[2.5rem] border border-[#E2D6CC] bg-white p-8 text-center shadow-sm sm:p-12">
          <Sparkles className="mx-auto h-8 w-8 text-[#9A7558]" />
          <h1 className="mt-5 font-serif text-4xl text-[#3E2D24]">Begin with your signals.</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#79675A]">
            Complete the short State Check first. Capacity Lab will then suggest a few small experiments connected to what you recorded.
          </p>
          <Link href="/state-check" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#4B3328] px-6 text-sm font-medium text-white">
            Take the State Check <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    );
  }

  const completeCount = practices.filter((practice) => completed.includes(practice.id)).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <header className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E0D4C9] bg-white px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-[#846B59]">
            <Sparkles className="h-3.5 w-3.5" /> Guided experiments
          </div>
          <h1 className="mt-4 font-serif text-5xl text-[#3E2D24]">Support the signal, gently.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#77675B]">
            One small experiment is more useful than an overwhelming protocol. These suggestions are educational prompts, not treatment or training clearance.
          </p>
        </div>
        <div className="rounded-3xl border border-[#DFD2C7] bg-white px-6 py-5 shadow-sm">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#9A806D]">{basis}</p>
          <p className="mt-2 font-serif text-2xl text-[#3E2D24]">{dimensionMeta[focus].label}</p>
          <p className="mt-2 text-xs text-[#857164]">{completeCount} of {practices.length} explored today</p>
        </div>
      </header>

      <section className="mt-8 grid gap-5 lg:grid-cols-3">
        {practices.map((practice, index) => {
          const Icon = practice.icon;
          const isDone = completed.includes(practice.id);
          return (
            <article key={practice.id} className={`flex min-h-[360px] flex-col rounded-[2.2rem] border p-6 transition ${isDone ? "border-[#CDBBAB] bg-[#F4ECE4]" : "border-[#E2D6CC] bg-white shadow-[0_16px_50px_rgba(70,45,32,0.06)]"}`}>
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F0E6DD] text-[#6B4937]"><Icon className="h-5 w-5" /></span>
                <span className="text-xs text-[#9A8677]">0{index + 1} · {practice.minutes}</span>
              </div>
              <h2 className="mt-7 font-serif text-3xl text-[#3E2D24]">{practice.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#77675B]">{practice.description}</p>
              <div className="mt-5 rounded-2xl bg-[#FBF8F4] p-4 text-sm leading-6 text-[#655247]">
                <span className="font-medium">Try:</span> {practice.experiment}
              </div>
              <button type="button" onClick={() => toggle(practice.id)} className={`mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-medium transition ${isDone ? "bg-[#D9C8B9] text-[#4F392E]" : "bg-[#4B3328] text-white hover:-translate-y-0.5"}`}>
                {isDone && <Check className="h-4 w-4" />}
                {isDone ? "Recorded as explored" : "Mark as explored"}
              </button>
            </article>
          );
        })}
      </section>

      <section className="mt-6 flex flex-col gap-4 rounded-[2rem] border border-[#DFD2C7] bg-[#34231C] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-[10px] uppercase tracking-[0.22em] text-[#D9B99D]">Keep the evidence honest</p><p className="mt-2 text-sm text-white/70">Record tomorrow’s signals before deciding whether an experiment helped.</p></div>
        <Link href="/check-in" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-[#3E2D24]">Open check-in <ArrowRight className="h-4 w-4" /></Link>
      </section>
    </div>
  );
}
