"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Coffee, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/Reveal";

export default function Donate() {
  const t = useTranslations("donate");
  const reduceMotion = useReducedMotion();

  return (
    <section className="px-5 py-24 md:px-10 md:py-32 lg:px-14">
      <Reveal className="relative mx-auto grid max-w-[1180px] overflow-hidden rounded-[40px] bg-[#b88a62] shadow-[0_35px_100px_rgba(56,47,36,0.16)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative z-10 p-7 text-stone-950 md:p-12 lg:p-16">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-800">03 · Support</p>
          <h2 className="mt-5 max-w-xl text-4xl font-medium tracking-[-0.04em] md:text-6xl">{t("title")}</h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-stone-800">{t("description")}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href={t("links.coffee")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#665745] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#8a6f4d]">
              <Coffee className="h-4 w-4" /> {t("cta.coffee")}
            </a>
            <a href={t("links.paypal")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-stone-800/30 bg-white/35 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:-translate-y-0.5 hover:bg-white/55">
              <Heart className="h-4 w-4" /> {t("cta.paypal")}
            </a>
          </div>
        </div>

        <div className="relative flex min-h-[430px] items-center justify-center overflow-hidden bg-[#d9c6a5] p-8">
          <div className="absolute h-72 w-72 rounded-full border border-stone-950/10" />
          <div className="absolute h-96 w-96 rounded-full border border-stone-950/10" />
          <motion.div animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [-2, -1, -2] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative w-full max-w-[250px] -rotate-2 rounded-[28px] border border-white/80 bg-white p-5 shadow-[0_28px_70px_rgba(56,47,36,0.2)]">
            <div className="relative aspect-square overflow-hidden rounded-[20px] bg-stone-50">
              <Image src="/donate/qr-pay.png" alt={t("title")} fill sizes="250px" className="object-contain p-3" />
            </div>
            <div className="mt-4 space-y-1 text-center text-[11px] font-semibold leading-5 text-stone-600">
              <p>{t("bank.name")}</p><p>{t("bank.account")}</p><p>{t("bank.note")}</p>
            </div>
          </motion.div>
        </div>
      </Reveal>
    </section>
  );
}
