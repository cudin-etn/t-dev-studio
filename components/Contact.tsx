"use client";

import { ArrowUpRight, Mail, MessageSquare, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";
import { CONTACT_EMAIL } from "@/lib/site";

export default function Contact() {
  const t = useTranslations("contactSection");

  return (
    <section id="contact" className="scroll-mt-24 bg-[#ebe6dc] px-5 py-24 md:px-10 md:py-32 lg:px-14">
      <Reveal className="mx-auto grid max-w-[1180px] gap-10 rounded-[36px] border border-stone-300 bg-[#f8f6f1] p-7 md:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:p-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">04 · Contact</p>
          <h2 className="mt-5 max-w-2xl text-4xl font-medium tracking-[-0.04em] text-stone-950 md:text-6xl">{t("title")}</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">{t("lead")}</p>
          <a href={`mailto:${CONTACT_EMAIL}?subject=Freelance%20Inquiry%20-%20T-Dev%20Studio`} className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#665745] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#8a6f4d]">
            <Mail className="h-4 w-4" /> {t("cta")} <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
        <div className="flex flex-col justify-end gap-3 text-sm">
          <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-4 font-semibold text-stone-800 transition hover:border-stone-400"><Mail className="h-4 w-4 text-amber-800" />{CONTACT_EMAIL}</a>
          <a href="https://t.me/cudin_etn" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-4 font-semibold text-stone-800 transition hover:border-stone-400"><Send className="h-4 w-4 text-amber-800" />Telegram</a>
          <a href="https://zalo.me/0977986982" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-4 font-semibold text-stone-800 transition hover:border-stone-400"><MessageSquare className="h-4 w-4 text-amber-800" />Zalo · 0977986982</a>
        </div>
      </Reveal>
    </section>
  );
}
