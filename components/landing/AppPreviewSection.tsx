"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Compass, Sparkles } from "lucide-react";

const map = [
  { label: "Energy", value: 54 },
  { label: "Sleep", value: 46 },
  { label: "Regulation", value: 62 },
  { label: "Recovery", value: 58 },
  { label: "Readiness", value: 52 },
];

export default function AppPreviewSection() {
  return <section id="experience" className="relative overflow-hidden bg-[#30211B] py-20 text-white lg:py-28"><div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#B48663]/12 blur-3xl" /><div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:px-8"><div><p className="text-[11px] uppercase tracking-[0.3em] text-[#D5B79E]">One useful feedback loop</p><h2 className="mt-5 font-serif text-5xl leading-[1.04] lg:text-6xl">Notice.<br />Connect.<br /><em className="font-light text-[#DDBFA5]">Choose deliberately.</em></h2><p className="mt-6 max-w-lg text-base leading-7 text-white/62">Begin with a State Check, add short daily context, and let your own pattern—not generic advice—shape the next useful question.</p><div className="mt-8 space-y-4">{["A five-signal Capacity Map", "60-second contextual check-ins", "Connections built only from recorded days", "Supportive practices, not medical prescriptions"].map((item) => <div key={item} className="flex items-center gap-3 text-sm text-white/75"><CheckCircle2 className="h-4 w-4 text-[#D5B79E]" />{item}</div>)}</div><Link href="/state-check" className="mt-9 inline-flex min-h-13 items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-medium text-[#3D2A21]">See my Capacity Map <ArrowRight className="h-4 w-4" /></Link></div>
    <div className="rounded-[2.5rem] border border-white/10 bg-[#F9F5F0] p-5 text-[#3E2D24] shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-5"><div><p className="text-[10px] uppercase tracking-[0.22em] text-[#91735E]">Capacity Map</p><h3 className="mt-2 font-serif text-4xl">Five signals, one context.</h3></div><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EDE1D7]"><Compass className="h-5 w-5 text-[#6D4A38]" /></span></div><div className="mt-8 space-y-5">{map.map((item) => <div key={item.label}><div className="mb-2 flex justify-between text-sm"><span>{item.label}</span><span className="text-[#856F60]">{item.value}</span></div><div className="h-2.5 overflow-hidden rounded-full bg-[#E7DDD4]"><div className="h-full rounded-full bg-gradient-to-r from-[#B68360] to-[#54382B]" style={{ width: String(item.value) + "%" }} /></div></div>)}</div><div className="mt-8 rounded-3xl bg-[#30211B] p-5 text-white"><div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#D5B79E]"><Sparkles className="h-3.5 w-3.5" /> Connection worth watching</div><p className="mt-3 text-sm leading-6 text-white/68">Lower sleep restoration and lower energy are appearing together. Track both before changing training intensity.</p></div></div>
  </div></section>;
}
