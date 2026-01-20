"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import Lottie from "lottie-react";

import flashflowAnim from "@/public/lottie/flashflow.json";
import fboardAnim from "@/public/lottie/fboard.json";
import macosAnim from "@/public/lottie/macos.json";
import ddropAnim from "@/public/lottie/ddrop.json";

import { PRODUCTS as PRODUCT_DATA } from "@/lib/products";

const PRODUCTS = [
  { key: "flashflow", href: "/products/flashflow", accent: "blue" as const },
  { key: "fboard", href: "/products/fboard", accent: "purple" as const },
  { key: "macos-flasher", href: "/products/macos-flasher", accent: "green" as const },
  { key: "ddrop", href: "/products/ddrop", accent: "indigo" as const },
];

const LOTTIES: Record<string, any> = {
  flashflow: flashflowAnim,
  fboard: fboardAnim,
  "macos-flasher": macosAnim,
  ddrop: ddropAnim,
};

export default function ProductGrid() {
  const [active, setActive] = useState<string>("flashflow");

  return (
    <section id="products" className="mx-auto max-w-7xl px-6 py-28">
      <h2 className="text-2xl font-semibold tracking-tight">
        Sản phẩm
      </h2>

      {/* LOTTIE SHOWCASE - TRÊN */}
      <div className="relative mt-12 overflow-hidden rounded-3xl border border-neutral-200 bg-white/60 p-8 backdrop-blur dark:border-neutral-900 dark:bg-neutral-950/60">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(99,102,241,0.18),transparent_60%)]" />

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <Lottie
              animationData={LOTTIES[active]}
              loop
              className="relative mx-auto h-[360px] w-full max-w-4xl"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* PRODUCT GRID - DƯỚI */}
      <div className="mt-16 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr items-stretch">
        {PRODUCTS.map((product) => (
          <div
            key={product.key}
            onMouseEnter={() => setActive(product.key)}
            onFocus={() => setActive(product.key)}
            onClick={() => setActive(product.key)}
            className="h-full cursor-pointer focus-within:z-10"
          >
            <ProductCard
              productKey={product.key}
              href={product.href}
              accent={product.accent}
              platforms={PRODUCT_DATA[product.key as keyof typeof PRODUCT_DATA].platforms}
            />
          </div>
        ))}
      </div>
    </section>
  );
}