"use client";

import { Braces, Gauge, Layers3, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";

export default function About() {
  const t = useTranslations("about");

  return (
    <section className="scroll-mt-24 border-y border-stone-300 bg-[#ebe6dc] px-5 py-24 md:px-10 md:py-32 lg:px-14">
      <div className="mx-auto max-w-[1320px]">
        <Reveal className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">03 · Approach</p>
            <h2 className="mt-5 text-4xl font-medium tracking-[-0.04em] text-stone-950 md:text-6xl">{t("title")}</h2>
          </div>
          <p className="max-w-3xl text-2xl font-medium leading-[1.45] tracking-[-0.025em] text-stone-800 md:text-3xl">{t("philosophy.desc")}</p>
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-[1.18fr_0.82fr]">
          <Reveal className="relative overflow-hidden rounded-[36px] border border-stone-300 bg-[#f8f6f1] p-7 md:p-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#b5c1b1]/55 blur-3xl" />
            <Layers3 className="relative h-8 w-8 text-amber-800" />
            <h3 className="relative mt-16 text-3xl font-semibold tracking-[-0.035em] text-stone-950">{t("edge.title")}</h3>
            <p className="relative mt-4 max-w-2xl text-base leading-7 text-stone-600">{t("edge.desc")}</p>
            <div className="relative mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[{ icon: Braces, name: "Native" }, { icon: Gauge, name: "Performance" }, { icon: Sparkles, name: "Product UX" }, { icon: Layers3, name: "Systems" }].map(({ icon: Icon, name }) => (
                <div key={name} className="rounded-[18px] border border-stone-200 bg-white/80 p-4">
                  <Icon className="h-4 w-4 text-amber-800" />
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-stone-700">{name}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={90} className="flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[36px] bg-[#5d675a] p-7 text-[#f8f6f1] md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ead9bb]">{t("stack.title")}</p>
            <div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-xl font-semibold tracking-[-0.03em]">
                <span>Swift</span><span>Kotlin</span><span>Next.js</span><span>React</span><span>Supabase</span><span>System UX</span>
              </div>
              <p className="mt-8 border-t border-white/20 pt-6 text-sm leading-7 text-stone-100/80">{t("stack.desc")}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
