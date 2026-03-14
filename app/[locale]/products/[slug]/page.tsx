"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { PRODUCTS } from "@/lib/products";
import { ChevronLeft, Download, ShieldCheck, Zap, LayoutPanelLeft } from "lucide-react";
import FloatingBack from "@/components/FloatingBack";

const PLATFORM_META = {
  windows: { label: "Windows", className: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" },
  macos: { label: "macOS", className: "bg-neutral-200 text-neutral-800 dark:bg-neutral-500/20 dark:text-neutral-300" },
  linux: { label: "Linux", className: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400" },
  android: { label: "Android", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" },
} as const;

// Animation
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = use(params);
  const t = useTranslations("products");
  
  const product = Object.values(PRODUCTS).find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Chuyển đổi màu accent sang chuỗi gradient (Tạo cảm giác đa sắc)
  const glowStyle = { backgroundColor: product.accentColor };

  return (
    <main className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-neutral-950 overflow-hidden pb-32">
      <FloatingBack />

      {/* Background lơ lửng bám theo màu App */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40 dark:opacity-20">
        <motion.div
          className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full blur-[120px]"
          style={glowStyle}
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-32 md:px-6 md:pt-40">
        
        {/* ================= NÚT QUAY LẠI ================= */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link
            href={`/${locale}#home`}
            className="group inline-flex items-center gap-2 rounded-full border border-neutral-200/60 bg-white/70 px-4 py-2 text-sm font-semibold text-neutral-600 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:text-indigo-600 dark:border-neutral-800/60 dark:bg-neutral-900/70 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-indigo-400"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Quay lại
          </Link>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-6">
          
          {/* ================= 1. HERO CARD ================= */}
          <motion.div
            variants={item}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-400 via-indigo-400 to-purple-400 p-[1px] shadow-2xl shadow-indigo-500/10 dark:from-sky-500/40 dark:via-indigo-500/40 dark:to-purple-500/40"
          >
            {/* Nền Hero: Light thì hơi ánh nhạt, Dark thì neutral-900/80 */}
            <div className="relative flex flex-col items-center gap-8 rounded-[calc(2rem-1px)] bg-indigo-50/90 px-6 py-12 backdrop-blur-2xl dark:bg-neutral-900/80 md:flex-row md:px-12 md:py-16">
              <div className="absolute left-10 top-10 h-64 w-64 rounded-full opacity-10 blur-3xl" style={glowStyle} />

              <div className="relative h-32 w-32 shrink-0 drop-shadow-2xl transition-transform duration-500 hover:-rotate-3 hover:scale-105 md:h-48 md:w-48">
                <Image src={product.image} alt={product.name} fill className="object-contain" priority />
              </div>

              <div className="relative z-10 flex flex-1 flex-col items-center text-center md:items-start md:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white md:text-6xl">
                  {product.name}
                </h1>
                <h2 className="mt-2 text-lg font-bold text-indigo-600 dark:text-indigo-400 md:text-xl">
                  {product.tagline[locale as "vi" | "en"]}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 md:text-base">
                  {product.description[locale as "vi" | "en"]}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
                  {/* Nút Download Glow bám theo màu App */}
                  <a
                    href={product.download}
                    className="group relative overflow-hidden rounded-full p-[2px] transition-transform hover:scale-105 active:scale-95"
                  >
                    <span className="absolute inset-0 opacity-80 blur-sm group-hover:opacity-100" style={glowStyle} />
                    <span className="absolute inset-0" style={glowStyle} />
                    <div className="relative flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-neutral-900 transition-colors group-hover:bg-transparent group-hover:text-white dark:bg-neutral-950 dark:text-white">
                      <Download className="h-5 w-5" />
                      <span>{t("actions.download")}</span>
                    </div>
                  </a>

                  <div className="flex flex-wrap gap-2">
                    {product.platforms.map((platform) => {
                      const meta = PLATFORM_META[platform as keyof typeof PLATFORM_META];
                      if (!meta) return null;
                      return (
                        <span key={platform} className={`rounded-full px-3 py-1.5 text-xs font-bold ${meta.className}`}>
                          {meta.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ================= 2. BENTO BOX: TÍNH NĂNG & ẢNH MẪU ================= */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            
            {/* Box Trái (Tính năng) - Viền Gradient */}
            <motion.div
              variants={item}
              className="col-span-1 rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-400 p-[1px] shadow-lg dark:from-cyan-500/40 dark:via-blue-500/40 dark:to-purple-500/40"
            >
              <div className="flex h-full w-full flex-col rounded-[calc(1.5rem-1px)] bg-blue-50/90 p-8 dark:bg-neutral-900/80">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-blue-200 p-2 text-blue-700 dark:bg-blue-500/20 dark:text-cyan-400">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Tính năng Cốt lõi</h3>
                </div>
                
                <ul className="flex flex-col gap-4">
                  {product.features.map((feature, idx) => (
                    <li key={feature.key || idx} className="flex items-start gap-3 rounded-2xl bg-white/60 p-4 shadow-sm dark:bg-black/40">
                      <Zap className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-cyan-400" />
                      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                        {feature.label[locale as "vi" | "en"]}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Box Phải (Ảnh Showcase) - Chiếm 2 cột */}
            <motion.div
              variants={item}
              className="col-span-1 md:col-span-2 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-400 via-fuchsia-400 to-rose-400 p-[1px] shadow-lg dark:from-violet-500/40 dark:via-fuchsia-500/40 dark:to-rose-500/40"
            >
              <div className="flex h-full w-full flex-col rounded-[calc(1.5rem-1px)] bg-fuchsia-50/90 p-8 dark:bg-neutral-900/80">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-fuchsia-200 p-2 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-400">
                    <LayoutPanelLeft className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Giao diện Trực quan</h3>
                </div>
                
                <div className="relative mt-auto flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl border border-fuchsia-200/50 bg-white shadow-inner dark:border-neutral-800/50 dark:bg-black/50">
                   {/* Dùng lại cấu trúc ảnh to của anh */}
                   <Image
                      src={product.image} // Tạm dùng logo app phóng to. Sau này anh truyền ảnh screenshot vào đây
                      alt={product.name}
                      fill
                      className="object-contain scale-75 drop-shadow-2xl transition-transform duration-700 hover:scale-[0.85]"
                   />
                </div>
              </div>
            </motion.div>
          </div>

          {/* ================= 3. FINAL CTA CARD ================= */}
          <motion.div
            variants={item}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-300 to-neutral-200 p-[1px] shadow-lg dark:from-neutral-700/60 dark:to-neutral-800/60"
          >
            <div className="relative flex flex-col items-center overflow-hidden rounded-[calc(1.5rem-1px)] bg-white p-12 text-center dark:bg-neutral-900/80">
              {/* Nền CTA chạy Glow nhẹ theo accentColor */}
              <div className="absolute inset-0 -z-10 opacity-20 dark:opacity-10" style={glowStyle} />
              
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
                {t("cta.ready")}
              </h2>
              <p className="mt-4 max-w-xl text-neutral-600 dark:text-neutral-400">
                {t("cta.description")}
              </p>
              
              <div className="mt-8 flex flex-col items-center gap-3">
                <a
                  href={product.download}
                  className="inline-flex items-center justify-center rounded-full px-10 py-4 text-base font-bold text-white transition-transform hover:scale-105 active:scale-95 shadow-lg"
                  style={glowStyle}
                >
                  {t("cta.download")}
                </a>
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-500">
                  {t("cta.supportHint")}
                </span>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </main>
  );
}