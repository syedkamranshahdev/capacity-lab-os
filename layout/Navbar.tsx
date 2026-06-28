"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Leaf, Menu, X } from "lucide-react";

const links = [
  { label: "How it works", href: "#approach" },
  { label: "Signals", href: "#signals" },
  { label: "Inside the product", href: "#experience" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);

  return <>
    <header className={"fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 " + (scrolled ? "border-white/10 bg-[#30211B]/95 text-white shadow-lg backdrop-blur-xl" : "border-[#E8DDD4]/70 bg-[#FBF7F2]/95 text-[#3E2D24] shadow-sm backdrop-blur-xl")}>
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#654536] text-white"><Leaf className="h-4 w-4" /></span><span><span className="block font-serif text-xl">Capacity Lab</span><span className={"block text-[8px] uppercase tracking-[0.2em] " + (scrolled ? "text-white/55" : "text-[#9A8475]")}>Understand · Align · Thrive</span></span></Link>
        <nav className="hidden items-center gap-7 lg:flex">{links.map((link) => <Link key={link.href} href={link.href} className="text-sm opacity-75 hover:opacity-100">{link.label}</Link>)}</nav>
        <div className="hidden items-center gap-2 lg:flex"><Link href="/login" className="rounded-full px-4 py-2.5 text-sm">Member login</Link><Link href="/state-check" className={"rounded-full px-5 py-2.5 text-sm font-medium shadow-sm " + (scrolled ? "bg-white text-[#3E2D24]" : "bg-[#5D4032] text-white")}>Take the State Check</Link></div>
        <button aria-label="Open navigation" onClick={() => setOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#5D4032] text-white lg:hidden"><Menu className="h-5 w-5" /></button>
      </div>
    </header>
    <AnimatePresence>{open && <><motion.button aria-label="Close navigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm lg:hidden" /><motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-x-3 top-3 z-50 rounded-[2rem] border border-[#E3D6CB] bg-[#FBF8F4] p-5 shadow-2xl lg:hidden"><div className="flex items-center justify-between"><span className="font-serif text-xl text-[#3E2D24]">Capacity Lab</span><button aria-label="Close navigation" onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5D4032] text-white"><X className="h-4 w-4" /></button></div><nav className="mt-5 divide-y divide-[#E9DED5]">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block py-4 text-sm text-[#5E4B3F]">{link.label}</Link>)}</nav><div className="mt-5 grid gap-3"><Link href="/state-check" onClick={() => setOpen(false)} className="rounded-2xl bg-[#5D4032] px-5 py-3.5 text-center text-sm font-medium text-white">Take the State Check</Link><Link href="/login" onClick={() => setOpen(false)} className="rounded-2xl border border-[#DED1C6] px-5 py-3.5 text-center text-sm text-[#5E4B3F]">Member login</Link></div></motion.div></>}</AnimatePresence>
  </>;
}