"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Mail, MessageSquare, Send, Menu, X } from "lucide-react";
import LocaleSwitch from "@/components/LocaleSwitch";
import { CONTACT_EMAIL } from "@/lib/site";

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const home = `/${locale}`;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 px-4 transition-all duration-500 ${scrolled ? "pt-3" : "pt-5 md:pt-7"}`}>
      <div className={`mx-auto flex max-w-[1320px] items-center justify-between rounded-full border px-3 py-2 transition-all duration-500 md:px-4 ${scrolled ? "border-stone-200 bg-[#f7f5f0]/90 shadow-[0_12px_40px_rgba(41,37,36,0.08)] backdrop-blur-xl" : "border-transparent bg-transparent"}`}>
        <Link href={home} aria-label="T-Dev Studio" className="flex items-center gap-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2">
          <span className="relative h-9 w-9 overflow-hidden rounded-full border border-stone-200 bg-white">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="object-cover">
              <circle cx="18" cy="18" r="16" fill="#1c1917"/>
              <path d="M10 18c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" stroke="#d9c6a5" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="18" cy="14" r="3" fill="#d9c6a5"/>
              <path d="M18 20c2.2 0 4-1.8 4-4" stroke="#d9c6a5" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="hidden text-sm font-bold tracking-[-0.02em] text-stone-950 sm:block">T-Dev Studio</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 rounded-full border border-stone-200/80 bg-white/70 p-1 backdrop-blur md:flex">
          <Link href={`${home}#home`} className="rounded-full px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-950">{t("home")}</Link>
          <Link href={`${home}/work`} className="rounded-full px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-950">{t("work")}</Link>
          <Link href={`${home}#services`} className="rounded-full px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-950">{t("services")}</Link>
          <Link href={`${home}#about`} className="rounded-full px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-950">{t("about")}</Link>
          <Link href={`${home}#contact`} className="rounded-full px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-950">{t("contact")}</Link>
        </nav>

        <button
          className="md:hidden rounded-full p-2 text-stone-600 hover:bg-stone-100 transition"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div className="flex items-center gap-2">
          <LocaleSwitch />
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Freelance%20Inquiry%20-%20T-Dev%20Studio`}
            className="hidden items-center gap-1.5 rounded-full bg-[#665745] px-4 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#8a6f4d] sm:inline-flex"
          >
            {t("contact")} <Mail className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden fixed inset-x-0 top-[4.75rem] z-40 max-h-[calc(100svh-5.25rem)] overflow-y-auto bg-[#f7f5f0] border-b border-stone-200 px-4 py-6 shadow-lg animate-slide-down">
          <nav className="mx-auto max-w-[1320px] flex flex-col gap-3">
            <Link href={`${home}#home`} className="rounded-full px-4 py-3 text-base font-semibold text-stone-700 transition hover:bg-stone-200" onClick={() => setMobileOpen(false)}>{t("home")}</Link>
            <Link href={`${home}/work`} className="rounded-full px-4 py-3 text-base font-semibold text-stone-700 transition hover:bg-stone-200" onClick={() => setMobileOpen(false)}>{t("work")}</Link>
            <Link href={`${home}#services`} className="rounded-full px-4 py-3 text-base font-semibold text-stone-700 transition hover:bg-stone-200" onClick={() => setMobileOpen(false)}>{t("services")}</Link>
            <Link href={`${home}#about`} className="rounded-full px-4 py-3 text-base font-semibold text-stone-700 transition hover:bg-stone-200" onClick={() => setMobileOpen(false)}>{t("about")}</Link>
            <Link href={`${home}#contact`} className="rounded-full px-4 py-3 text-base font-semibold text-stone-700 transition hover:bg-stone-200" onClick={() => setMobileOpen(false)}>{t("contact")}</Link>
            <LocaleSwitch />
            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Freelance%20Inquiry%20-%20T-Dev%20Studio`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#665745] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#8a6f4d]"
                onClick={() => setMobileOpen(false)}
              >
                <Mail className="h-4 w-4" /> {t("contact")}
              </a>
              <a
                href="https://t.me/cudin_etn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                onClick={() => setMobileOpen(false)}
              >
                <Send className="h-4 w-4" /> Telegram
              </a>
              <a
                href="https://zalo.me/0977986982"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                onClick={() => setMobileOpen(false)}
              >
                <MessageSquare className="h-4 w-4" /> Zalo
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
