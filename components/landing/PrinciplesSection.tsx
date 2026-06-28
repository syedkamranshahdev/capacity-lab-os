import { BookOpenCheck, Fingerprint, ShieldCheck } from "lucide-react";

const principles = [
  { icon: Fingerprint, title: "Patterns over prescriptions", text: "Your experience is compared with your own entries—not a universal rule for how every woman should feel." },
  { icon: BookOpenCheck, title: "Context over isolated facts", text: "Energy, sleep, stress, recovery and readiness become more useful when they are viewed together." },
  { icon: ShieldCheck, title: "Education, not diagnosis", text: "Capacity Lab supports reflection and informed conversations. It does not diagnose, treat or interpret laboratory results." },
];

export default function PrinciplesSection() {
  return <section className="bg-[#F7F1EA] py-20 lg:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="mx-auto max-w-3xl text-center"><p className="text-[11px] uppercase tracking-[0.3em] text-[#9A765B]">Designed for trust</p><h2 className="mt-5 font-serif text-5xl text-[#35251E] lg:text-6xl">Clarity without overclaiming.</h2></div><div className="mt-14 grid gap-5 lg:grid-cols-3">{principles.map((item) => <article key={item.title} className="rounded-[2.2rem] border border-[#E3D7CC] bg-white p-8"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFE4DB] text-[#73503D]"><item.icon className="h-5 w-5" /></span><h3 className="mt-6 font-serif text-3xl text-[#3E2D24]">{item.title}</h3><p className="mt-4 text-sm leading-7 text-[#756357]">{item.text}</p></article>)}</div></div></section>;
}
