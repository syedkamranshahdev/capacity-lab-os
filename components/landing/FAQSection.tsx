"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { question: "What is Capacity Lab?", answer: "Capacity Lab is a contextual wellness reflection platform. It helps you record energy, sleep, stress regulation, recovery, readiness and optional cycle context in one connected view." },
  { question: "Does the State Check diagnose anything?", answer: "No. The State Check reflects your answers and highlights a useful place to begin. It does not diagnose conditions, interpret laboratory results or replace medical care." },
  { question: "Does Capacity Lab prescribe training by cycle phase?", answer: "No. Cycle context is optional and is used to help you notice your own patterns. The platform does not assume every woman performs or recovers the same way in a given phase." },
  { question: "Where do the connection notes come from?", answer: "Connection notes use only the entries you record. They describe signals that appear together and are presented as questions to explore—not proof that one signal caused another." },
  { question: "What happens to my entries?", answer: "During the founding beta, your entries are saved to your account when the product database is enabled and also remain available on your device for continuity. Full privacy and retention terms must be completed before public launch." },
  { question: "Who is the founding beta for?", answer: "The first beta is for women who want a calmer way to notice patterns across everyday wellbeing, recovery and training decisions without collecting more disconnected advice." },
];

export default function FAQSection() {
  return <section id="faq" className="bg-[#FCFAF7] py-20 lg:py-28"><div className="mx-auto max-w-3xl px-5 lg:px-8"><div className="text-center"><p className="text-[11px] uppercase tracking-[0.3em] text-[#9A765B]">Frequently asked</p><h2 className="mt-5 font-serif text-5xl text-[#35251E] lg:text-6xl">Clear questions.<br /><em className="font-light">Honest answers.</em></h2></div><Accordion type="single" collapsible className="mt-12 space-y-3">{faqs.map((faq, index) => <AccordionItem key={faq.question} value={"item-" + index} className="overflow-hidden rounded-[1.5rem] border border-[#E4D8CE] bg-white px-6"><AccordionTrigger className="py-6 text-left text-base font-medium text-[#4C3A30] hover:no-underline">{faq.question}</AccordionTrigger><AccordionContent className="pb-6 text-sm leading-7 text-[#7B695C]">{faq.answer}</AccordionContent></AccordionItem>)}</Accordion></div></section>;
}
