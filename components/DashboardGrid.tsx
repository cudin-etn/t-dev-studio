"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { PRODUCTS } from "@/lib/products";
import { Mail, Code2, Cpu, Globe, Zap, Coffee, Github } from "lucide-react";

export default function DashboardGrid() {
  const tHero = useTranslations("hero");
  const tAbout = useTranslations("about");
  const tProducts = useTranslations("products");
  const locale = useLocale() as "vi" | "en";
  const productList = Object.values(PRODUCTS);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pt-24 pb-12 md:px-6">
      
      {/* ================= HÀNG 1: BANNER & TECH STACK ================= */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        
        {/* HERO BANNER (Spans 2 Cột) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-to-br from-sky-400 via-indigo-400 to-purple-400 p-[1px] shadow-lg md:col-span-2 dark:from-sky-500/40 dark:via-indigo-500/40 dark:to-purple-500/40">
          <div className="relative flex h-full w-full flex-col justify-center overflow-hidden rounded-[calc(1.5rem-1px)] bg-indigo-200 p-8 dark:bg-neutral-900/80 lg:p-12">
            <div className="relative z-10 mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-indigo-500/30 bg-white/60 px-3 py-1.5 text-xs font-medium text-indigo-800 dark:bg-black/40 dark:text-indigo-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
              </span>
              {tHero("badge")}
            </div>
            
            <h1 className="relative z-10 text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl dark:text-white">
              {tHero("title1")} <span className="animate-[gradient_8s_linear_infinite] bg-gradient-to-r from-indigo-600 via-cyan-500 to-purple-500 bg-[length:200%_200%] bg-clip-text text-transparent">{tHero("title2")}</span>
            </h1>
            
            <p className="relative z-10 mt-6 max-w-lg text-sm leading-relaxed text-indigo-950/80 dark:text-neutral-300">
              {tHero("description")}
            </p>
            
            <div className="relative z-10 mt-10">
              <a href="mailto:tungninh88@gmail.com" className="group/btn relative inline-block overflow-hidden rounded-full p-[2px]">
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-80 blur-sm group-hover/btn:opacity-100" />
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />
                <div className="relative flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-neutral-900 transition-colors group-hover/btn:bg-transparent group-hover/btn:text-white dark:bg-neutral-950 dark:text-white">
                  <Mail className="h-4 w-4 transition-transform group-hover/btn:-translate-y-1" />
                  <span>{tHero("hireMe")}</span>
                </div>
              </a>
            </div>
          </div>
        </motion.div>

        {/* TECH STACK (Spans 1 Cột) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-400 p-[1px] shadow-lg dark:from-cyan-500/40 dark:via-blue-500/40 dark:to-purple-500/40"
        >
          <div className="flex h-full w-full flex-col justify-between overflow-hidden rounded-[calc(1.5rem-1px)] bg-blue-200 p-8 dark:bg-neutral-900/80">
            <div>
              <Cpu className="mb-4 h-8 w-8 text-blue-700 dark:text-cyan-400" />
              <h3 className="mb-3 text-xl font-bold tracking-tight text-neutral-950 dark:text-white">{tAbout("stack.title")}</h3>
              <p className="text-xs leading-relaxed text-blue-950/80 dark:text-neutral-400">{tAbout("stack.desc")}</p>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[ {icon: <Code2 />, name: "Swift", color: "text-blue-600"}, {icon: <Zap />, name: "Kotlin", color: "text-orange-600"}, {icon: <Globe />, name: "Next.js", color: "text-cyan-600"}, {icon: <Code2 />, name: "React", color: "text-indigo-600"} ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 rounded-xl bg-white/60 p-3 text-xs font-bold text-neutral-800 shadow-sm dark:bg-black/40 dark:text-neutral-200">
                  <span className={item.color}>{item.icon}</span> {item.name}
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex items-center justify-between border-t border-blue-300/50 pt-5 dark:border-neutral-800">
              <a href="https://github.com/cudin-etn" target="_blank" className="flex items-center gap-2 text-xs font-bold text-blue-900/70 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                 <Github className="h-4 w-4" /> GitHub
              </a>
              <a href="https://buymeacoffee.com/tdevstudio" target="_blank" className="flex items-center gap-2 text-xs font-bold text-blue-900/70 transition-colors hover:text-indigo-700 dark:text-neutral-400 dark:hover:text-indigo-400">
                 <Coffee className="h-4 w-4" /> Donate
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ================= HÀNG 2: LƯỚI SẢN PHẨM ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl bg-gradient-to-br from-violet-400 via-fuchsia-400 to-rose-400 p-[1px] shadow-xl dark:from-violet-500/40 dark:via-fuchsia-500/40 dark:to-rose-500/40"
      >
        <div className="h-full w-full rounded-[calc(1.5rem-1px)] bg-fuchsia-200 p-8 dark:bg-neutral-900/60 md:p-10">
          <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-fuchsia-950 dark:text-fuchsia-200">{tProducts("title")}</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {productList.map((product) => (
              <Link
                key={product.key}
                href={`/${locale}/products/${product.slug}`}
                className="group/card relative flex min-h-[240px] flex-col justify-between rounded-3xl bg-gradient-to-br from-fuchsia-300 to-rose-300 p-[1px] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative flex h-full w-full flex-col rounded-[calc(1.5rem-1px)] bg-fuchsia-50/90 p-6 dark:bg-fuchsia-950/40">
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold text-fuchsia-950 dark:text-fuchsia-50">{product.name}</h4>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-fuchsia-900/70 dark:text-fuchsia-200/70">{product.tagline[locale]}</p>
                  </div>
                  
                  <div className="mt-auto flex justify-end">
                    <div className="relative h-20 w-20 drop-shadow-2xl transition-transform duration-500 group-hover/card:-rotate-6 group-hover/card:scale-125">
                      <Image src={product.image} alt={product.name} fill className="object-contain" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

    </div>
  );
}