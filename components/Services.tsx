"use client";

import { Code2, Cpu, Layers3, Monitor, Search, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";

const icons = { mobile: Smartphone, desktop: Monitor, layers: Layers3, cpu: Cpu, code: Code2, search: Search } as const;

export default function Services() {
  const t = useTranslations("services");
  const items = t.raw("items") as Array<{ icon: keyof typeof icons; title: string; desc: string; outcome: string }>;

  return (
    <section id="services" className="scroll-mt-24 border-y border-stone-300 bg-[#f7f5f0] px-5 py-24 md:px-10 md:py-32 lg:px-14">
      <div className="mx-auto max-w-[1320px]">
        <Reveal className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">02 · Services</p>
          <h2 className="mt-5 text-4xl font-medium tracking-[-0.04em] text-stone-950 md:text-6xl">{t("title")}</h2>
          <p className="mt-5 text-lg leading-8 text-stone-600">{t("lead")}</p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const Icon = icons[item.icon] ?? Code2;
            return (
              <Reveal key={item.title} delay={index * 55} className="rounded-[28px] border border-stone-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-stone-400 hover:shadow-[0_20px_55px_rgba(56,47,36,0.08)] md:p-7">
                <Icon className="h-6 w-6 text-amber-800" />
                <h3 className="mt-8 text-xl font-semibold tracking-[-0.03em] text-stone-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{item.desc}</p>
                <p className="mt-5 border-t border-stone-100 pt-4 text-sm font-semibold leading-6 text-stone-800">{item.outcome}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
