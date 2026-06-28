"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";

export default function HeroSection() {
  return <section className="relative min-h-screen overflow-hidden bg-[#F7F1EA] pt-[72px]">
    <div className="absolute -right-32 top-24 h-96 w-96 rounded-full bg-[#E5D5C7] blur-3xl" />
    <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-10 px-5 py-12 lg:grid-cols-[1.04fr_0.96fr] lg:px-8 lg:py-16">
      <div>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-[#DED0C4] bg-white/70 px-3.5 py-2 text-[11px] uppercase tracking-[0.2em] text-[#806653]"><Sparkles className="h-3.5 w-3.5" /> Personal capacity, in context</motion.div>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-7 max-w-3xl font-serif text-[3.25rem] leading-[0.98] text-[#35251E] sm:text-6xl lg:text-7xl">Connect the signals.<br /><em className="font-light text-[#8A6047]">Build capacity</em> that lasts.</motion.h1>
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mt-7 max-w-2xl text-base leading-7 text-[#6F5C4F] lg:text-lg">Capacity Lab helps women notice how energy, sleep, stress regulation, recovery, training readiness and cycle context move together—without turning health into another full-time job.</motion.p>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="mt-8 flex flex-wrap gap-3"><Link href="/state-check" className="inline-flex min-h-13 items-center gap-2 rounded-2xl bg-[#4B3328] px-6 py-3.5 text-sm font-medium text-white shadow-lg hover:-translate-y-0.5">Take the 2-minute State Check <ArrowRight className="h-4 w-4" /></Link><Link href="#approach" className="inline-flex min-h-13 items-center rounded-2xl border border-[#DCCFC3] bg-white/60 px-6 py-3.5 text-sm text-[#604D40]">See how it works</Link></motion.div>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#806F63]">{["No universal cycle rules", "No diagnosis", "Built from your entries"].map((item) => <span key={item} className="inline-flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E7DBD1]"><Check className="h-3 w-3" /></span>{item}</span>)}</div>
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.12, duration: 0.7 }} className="relative">
        <div className="overflow-hidden rounded-[2.5rem] shadow-[0_32px_90px_rgba(57,36,25,0.18)]"><Image src="https://images.pexels.com/photos/3757376/pexels-photo-3757376.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Woman pausing after movement" width={1000} height={1200} priority className="h-[520px] w-full object-cover lg:h-[650px]" /><div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-t from-[#2D1D17]/45 via-transparent to-transparent" /></div>
        <div className="absolute bottom-5 left-5 right-5 rounded-[1.8rem] border border-white/20 bg-[#2D1D17]/78 p-5 text-white backdrop-blur-xl sm:left-auto sm:w-[360px]"><p className="text-[10px] uppercase tracking-[0.22em] text-[#D8BDA7]">Today’s connection</p><p className="mt-3 font-serif text-2xl">Sleep restoration ↓<br />Energy availability ↓</p><p className="mt-3 text-xs leading-5 text-white/60">Observe the pattern before changing the plan.</p></div>
      </motion.div>
    </div>
  </section>;
}
