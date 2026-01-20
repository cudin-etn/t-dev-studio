"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

type ProductCardProps = {
  productKey: string;
  href: string;
  accent: "blue" | "purple" | "green" | "indigo";
  platforms: readonly string[];
};

const ACCENT_STYLES = {
  blue: {
    idleBg: "from-sky-500/35 via-cyan-400/25",
    idleGlow: "from-sky-500/45",
    hoverGlow: "from-sky-500/80",
  },
  purple: {
    idleBg: "from-fuchsia-500/35 via-violet-400/25",
    idleGlow: "from-fuchsia-500/45",
    hoverGlow: "from-fuchsia-500/80",
  },
  green: {
    idleBg: "from-emerald-500/35 via-teal-400/25",
    idleGlow: "from-emerald-500/45",
    hoverGlow: "from-emerald-500/80",
  },
  indigo: {
    idleBg: "from-indigo-500/35 via-sky-400/25",
    idleGlow: "from-indigo-500/45",
    hoverGlow: "from-indigo-500/80",
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

export default function ProductCard({
  productKey,
  href,
  accent,
  platforms,
}: ProductCardProps) {  const t = useTranslations("products");
  const locale = useLocale();
  const s = ACCENT_STYLES[accent];

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-50px" }}
      className="h-full"
    >
      <Link
        href={`/${locale}${href}`}
        className="group relative block h-full flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/10 dark:border-neutral-900 dark:bg-neutral-950 dark:hover:shadow-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-950"
      >
        {/* IDLE tint background */}
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${s.idleBg} to-transparent opacity-75 transition-opacity duration-300 group-hover:opacity-100`}
        />

        {/* GLOW */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className={`absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br ${s.idleGlow} to-transparent blur-2xl opacity-60 transition-all duration-500 group-hover:opacity-100`}
          />
          <div
            className={`absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br ${s.hoverGlow} to-transparent blur-2xl opacity-0 transition-all duration-500 group-hover:opacity-100`}
          />
        </div>

        {/* CONTENT */}
        <div className="relative flex flex-col flex-1 transition-transform duration-300 group-hover:translate-y-[-2px]">
          <h3 className="text-lg font-semibold tracking-tight">{t(`${productKey}.name`)}</h3>
          {platforms.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {platforms.map((platform) => {
                const OS_STYLES: Record<string, string> = {
                  windows:
                    "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
                  macos:
                    "bg-neutral-200 text-neutral-700 dark:bg-neutral-400/20 dark:text-neutral-200",
                  linux:
                    "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
                  android:
                    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300",
                };

                return (
                  <span
                    key={platform}
                    className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${OS_STYLES[platform]}`}
                  >
                    {platform === "macos"
                      ? "macOS"
                      : platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </span>
                );
              })}
            </div>
          )}
          <p className="mt-2 min-h-[5.5rem] line-clamp-4 text-sm text-neutral-600 dark:text-neutral-300">
            {t(`${productKey}.description`)}
          </p>

          {/* CTA */}
          <div className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 group-hover:translate-x-0.5 dark:bg-white dark:text-neutral-900 dark:hover:shadow-white/20">
            <span>{t("actions.viewDetails")}</span>
            <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}