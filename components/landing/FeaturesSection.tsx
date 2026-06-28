"use client";

import { Activity, Brain, Compass, Dumbbell, Moon, Zap } from "lucide-react";

const signals = [
  { icon: Zap, title: "Energy", description: "Notice availability, stability and the moments your energy changes." },
  { icon: Moon, title: "Sleep", description: "Reflect on restoration—not only hours or a wearable score." },
  { icon: Brain, title: "Regulation", description: "Observe how quickly you return to baseline after pressure." },
  { icon: Activity, title: "Recovery", description: "Connect soreness, fatigue, motivation and total life demand." },
  { icon: Dumbbell, title: "Readiness", description: "Make training decisions from today’s context, not a rigid rule." },
  { icon: Compass, title: "Cycle context", description: "Record optional context to discover personal patterns over time." },
];

export default function FeaturesSection() {
  return <section id="approach" className="bg-[#FCFAF7] py-20 lg:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="mx-auto max-w-3xl text-center"><p className="text-[11px] uppercase tracking-[0.3em] text-[#9A765B]">The Capacity Lab approach</p><h2 className="mt-5 font-serif text-5xl leading-[1.05] text-[#35251E] lg:text-6xl">Your body is a system.<br /><em className="font-light">Your signals should connect.</em></h2><p className="mt-6 text-base leading-7 text-[#716054]">One isolated score rarely explains a whole day. Capacity Lab brings the signals into one calm, understandable view.</p></div><div id="signals" className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{signals.map((signal, index) => <article key={signal.title} className="group rounded-[2rem] border border-[#E5D9CF] bg-white p-7 shadow-[0_8px_35px_rgba(62,40,27,0.04)] transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-start justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0E6DD] text-[#76513D]"><signal.icon className="h-5 w-5" /></span><span className="font-serif text-2xl text-[#C1AA98]">0{index + 1}</span></div><h3 className="mt-6 font-serif text-3xl text-[#3E2D24]">{signal.title}</h3><p className="mt-3 text-sm leading-6 text-[#7B695C]">{signal.description}</p></article>)}</div></div></section>;
}
