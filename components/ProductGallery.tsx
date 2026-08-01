"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { ProductScreenshot } from "@/lib/products/types";
import type { Locale } from "@/lib/site";

export default function ProductGallery({ screenshots, locale }: { screenshots: ProductScreenshot[]; locale: Locale }) {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const current = screenshots[active];

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[32px] border border-stone-200 bg-[#e9e4da]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.url}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 1.01 }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
            className="absolute inset-[5%] overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-[0_22px_70px_rgba(56,47,36,0.12)]"
          >
            <Image src={current.url} alt={current.alt[locale]} fill sizes="(max-width: 1024px) 100vw, 1120px" className="object-contain p-[4%]" />
          </motion.div>
        </AnimatePresence>
      </div>

      {screenshots.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2" aria-label={locale === "vi" ? "Chọn ảnh giao diện" : "Select interface image"}>
          {screenshots.map((screenshot, index) => (
            <button
              key={screenshot.url}
              type="button"
              onClick={() => setActive(index)}
              aria-pressed={active === index}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-[16px] border bg-white transition ${active === index ? "border-stone-950 ring-2 ring-stone-950/10" : "border-stone-200 opacity-65 hover:opacity-100"}`}
            >
              <Image src={screenshot.url} alt="" fill sizes="112px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
