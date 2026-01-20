"use client";

import type { Metadata } from "next";

import Lottie from "lottie-react";
import heroLottie from "@/public/lottie/hero2.json";
import Donate from "@/components/Donate";
import FloatingBack from "@/components/FloatingBack";

import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { use } from "react";
import { PRODUCTS } from "@/lib/products";

const PLATFORM_META = {
  windows: { label: "Windows", className: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
  macos: { label: "macOS", className: "bg-neutral-500/15 text-neutral-700 dark:text-neutral-300" },
  linux: { label: "Linux", className: "bg-orange-500/15 text-orange-600 dark:text-orange-400" },
  android: { label: "Android", className: "bg-green-500/15 text-green-600 dark:text-green-400" },
} as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.12,
    },
  },
};

const item: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
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

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default function ProductDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const t = useTranslations("products");

  const product = PRODUCTS[slug as keyof typeof PRODUCTS];

  if (!product) {
    notFound();
  }

  return (
    <main className="relative overflow-hidden">
      <FloatingBack />
      {/* HERO */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, margin: "-50px" }}
        className="relative mx-auto max-w-6xl px-6 pt-32 pb-20"
      >
        {/* LOTTIE BACKGROUND */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {/* Accent glow */}
          <div
            className="absolute inset-0 opacity-40 blur-3xl"
            style={{
              background: `radial-gradient(circle at 50% 40%, ${product.accentColor} 0%, transparent 60%)`,
            }}
          />

          {/* Lottie */}
          <Lottie
            animationData={heroLottie}
            loop
            autoplay
            className="absolute left-1/2 top-1/2 w-[1200px] -translate-x-1/2 -translate-y-1/2 opacity-60"
          />
        </div>

        <motion.h1 variants={item} className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t(`${product.key}.name`)}
        </motion.h1>

        <motion.p variants={item} className="mt-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
          <span className="block text-neutral-500 dark:text-neutral-400">
            {t(`${product.key}.description`)}
          </span>
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={product.download}
            className="
              relative inline-flex items-center justify-center
              rounded-full px-7 py-2.5
              text-sm font-semibold text-white
              transition-all duration-300
              hover:brightness-110
            "
            style={{
              backgroundImage: `
                radial-gradient(circle at 30% 30%, ${product.accentColor} 0%, transparent 60%),
                linear-gradient(180deg, ${product.accentColor}cc, ${product.accentColor}aa)
              `,
            }}
          >
            {t("cta.download")}
          </a>

          <div className="flex flex-wrap gap-2">
            {product.platforms.map((platform) => {
              const meta = PLATFORM_META[platform as keyof typeof PLATFORM_META];
              if (!meta) return null;
              return (
                <span
                  key={platform}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${meta.className}`}
                >
                  {meta.label}
                </span>
              );
            })}
          </div>
        </motion.div>
      </motion.section>

      {/* IMAGE / SHOWCASE */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, margin: "-50px" }}
        className="mx-auto max-w-6xl px-6 pb-32"
      >
        <motion.div
          variants={item}
          className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800"
        >
          {/* Field gradient background */}
          <motion.div
            aria-hidden
            className="absolute inset-0 -z-10"
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage: `
                linear-gradient(120deg, ${product.accentColor}cc 0%, transparent 55%),
                linear-gradient(260deg, ${product.accentColor}99 0%, transparent 60%),
                linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0))
              `,
              backgroundSize: "200% 200%",
            }}
          />

          {/* Aspect ratio wrapper */}
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={product.image}
              alt={t(`${product.key}.name`)}
              fill
              priority
              className="object-contain scale-90"
            />
          </div>
        </motion.div>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, margin: "-50px" }}
          className="mt-16 grid gap-6 sm:grid-cols-3"
        >
          {product.features.map((feature) => (
            <motion.li
              key={feature}
              variants={item}
              className="relative h-full rounded-2xl border border-neutral-200 bg-white/70 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/60 hover:border-neutral-400 dark:hover:border-neutral-600"
            >
              <p className="text-sm font-medium">
                {t(`features.${feature}`)}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </motion.section>

      {/* FINAL CTA */}
      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, margin: "-50px" }}
        className="relative mx-auto max-w-6xl px-6 pb-32"
      >
        <motion.div
          variants={item}
          className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-transparent p-12 text-white dark:border-neutral-800"
        >
          {/* Gradient field (static intensity, animated flow only) */}
          <motion.div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-100"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage: `
                radial-gradient(circle at 30% 30%, ${product.accentColor}cc 0%, transparent 65%),
                linear-gradient(140deg, ${product.accentColor}99 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.85) 100%)
              `,
              backgroundSize: "200% 200%",
            }}
          />

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("cta.ready")}
            </h2>

            <p className="mt-4 text-white/90">
              {t("cta.description")}
            </p>
            <p className="mt-2 text-sm text-white/70">
              {t("cta.supportHint")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={product.download}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r px-8 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.05]"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${product.accentColor}, #ffffff22)`
                }}
              >
                {t("cta.download")}
              </a>

              <span className="text-sm text-neutral-300">
                {t("cta.platforms")}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </main>
  );
}