"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Github, Mail, Send, ArrowUpRight, MessageSquare } from "lucide-react";
import { CONTACT_EMAIL, GITHUB_URL } from "@/lib/site";

export default function Footer() {
  const t = useTranslations();
  const ft = useTranslations("footer");
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#74806f] bg-[#596456] px-5 py-12 text-[#f8f6f1] md:px-10 md:py-16 lg:px-14">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ead9bb]">T-Dev Studio</p>
            <h2 className="mt-6 max-w-3xl text-4xl font-medium tracking-[-0.04em] md:text-6xl">{ft("ctaTitle")}</h2>
            <a href={`mailto:${CONTACT_EMAIL}`} className="group mt-9 inline-flex items-center gap-2 border-b border-white/40 pb-2 text-lg font-medium transition hover:border-white">
              {CONTACT_EMAIL}<ArrowUpRight className="h-5 w-5 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="font-semibold text-stone-100/70">{ft("navigate")}</p>
              <div className="mt-5 flex flex-col items-start gap-3">
                <Link href={`/${locale}#home`} className="transition hover:text-[#ead9bb]">{t("nav.home")}</Link>
                <Link href={`/${locale}/work`} className="transition hover:text-[#ead9bb]">{t("nav.work")}</Link>
                <Link href={`/${locale}#services`} className="transition hover:text-[#ead9bb]">{t("nav.services")}</Link>
                <Link href={`/${locale}#about`} className="transition hover:text-[#ead9bb]">{t("nav.about")}</Link>
                <Link href={`/${locale}#contact`} className="transition hover:text-[#ead9bb]">{t("nav.contact")}</Link>
                <Link href="/privacy" className="transition hover:text-[#ead9bb]">{ft("privacy")}</Link>
                <Link href="/terms" className="transition hover:text-[#ead9bb]">{ft("terms")}</Link>
              </div>
            </div>
            <div>
              <p className="font-semibold text-stone-100/70">{ft("connect")}</p>
              <div className="mt-5 flex flex-col items-start gap-3">
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-[#ead9bb]"><Github className="h-4 w-4" />GitHub</a>
                <a href="https://t.me/cudin_etn" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-[#ead9bb]"><Send className="h-4 w-4" />Telegram</a>
                <a href="https://zalo.me/0977986982" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-[#ead9bb]"><MessageSquare className="h-4 w-4" />Zalo · 0977986982</a>
                <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 transition hover:text-[#ead9bb]"><Mail className="h-4 w-4" />Email</a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-white/20 pt-6 text-xs text-stone-100/65 sm:flex-row sm:items-center sm:justify-between">
          <p>{ft("copyright", { year })}</p>
          <p>{t("header.slogan")}</p>
        </div>
      </div>
    </footer>
  );
}
