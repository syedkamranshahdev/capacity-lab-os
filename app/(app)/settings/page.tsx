"use client";

import { useEffect, useState } from "react";
import { Bell, Check, LockKeyhole, SlidersHorizontal } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const KEY = "capacity-lab:preferences";

type Preferences = { dailyReminder: boolean; weeklyReflection: boolean; cycleContext: boolean; gentleLanguage: boolean };
const defaults: Preferences = { dailyReminder: true, weeklyReflection: true, cycleContext: true, gentleLanguage: true };

export default function SettingsPage() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState(defaults);
  const [saved, setSaved] = useState(false);
  useEffect(() => { const stored = window.localStorage.getItem(KEY); if (stored) { try { setPreferences(JSON.parse(stored)); } catch {} } }, []);
  function toggle(key: keyof Preferences) { setSaved(false); setPreferences((current) => ({ ...current, [key]: !current[key] })); }
  function save() { window.localStorage.setItem(KEY, JSON.stringify(preferences)); setSaved(true); }

  return <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8"><header><div className="inline-flex items-center gap-2 rounded-full border border-[#E0D4C9] bg-white px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-[#846B59]"><SlidersHorizontal className="h-3.5 w-3.5" /> Preferences</div><h1 className="mt-4 font-serif text-5xl text-[#3E2D24]">Make the experience yours.</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-[#77675B]">Choose what context is useful. Nothing here changes medical care or makes automatic decisions for you.</p></header>
    <div className="mt-8 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]"><aside className="rounded-[2.2rem] bg-[#34231C] p-7 text-white"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 font-serif text-lg">{user?.initials || "CM"}</span><h2 className="mt-6 font-serif text-3xl">{user?.fullName || "Capacity Member"}</h2><p className="mt-1 text-sm text-white/50">{user?.email}</p><div className="mt-8 rounded-2xl border border-white/10 bg-white/7 p-4"><div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#D9B99D]"><LockKeyhole className="h-3.5 w-3.5" /> Private beta</div><p className="mt-3 text-sm leading-6 text-white/60">Account, privacy and deletion controls should be finalized with legal review before public launch.</p></div></aside>
      <section className="rounded-[2.2rem] border border-[#E4D8CE] bg-white p-6 shadow-sm sm:p-8"><h2 className="font-serif text-3xl text-[#3E2D24]">Experience preferences</h2><div className="mt-7 divide-y divide-[#EAE0D8]">{[
        ["dailyReminder", "Daily check-in reminder", "A gentle prompt to notice today’s state.", Bell],
        ["weeklyReflection", "Weekly pattern reflection", "A reminder to review what moved together.", SlidersHorizontal],
        ["cycleContext", "Show optional cycle context", "Keep cycle context available without prescribing from it.", SlidersHorizontal],
        ["gentleLanguage", "Use neutral, non-judgmental language", "Avoid streak pressure and performance shame.", Check],
      ].map(([key, title, description, Icon]) => { const typedKey = key as keyof Preferences; const ToggleIcon = Icon as typeof Bell; return <button type="button" key={String(key)} onClick={() => toggle(typedKey)} className="flex w-full items-center gap-4 py-5 text-left"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F0E6DD] text-[#76513D]"><ToggleIcon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-medium text-[#4E3A30]">{String(title)}</span><span className="mt-1 block text-xs leading-5 text-[#907D70]">{String(description)}</span></span><span className={"relative h-7 w-12 shrink-0 rounded-full transition " + (preferences[typedKey] ? "bg-[#5A3C2E]" : "bg-[#DED4CC]")}><span className={"absolute top-1 h-5 w-5 rounded-full bg-white shadow transition " + (preferences[typedKey] ? "left-6" : "left-1")} /></span></button>; })}</div><button onClick={save} className="mt-7 min-h-12 w-full rounded-2xl bg-[#4B3328] px-5 text-sm font-medium text-white">{saved ? "Preferences saved" : "Save preferences"}</button></section></div>
  </div>;
}
