"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ShieldCheck, Globe } from "lucide-react";

export default function About() {
  const t = useTranslations("about");

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6">
      <div className="mb-10 flex items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {t("title")}
        </h2>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-purple-400 to-transparent dark:from-purple-800" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Khối Triết lý */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="col-span-1 rounded-3xl bg-gradient-to-br from-purple-400 via-fuchsia-400 to-pink-400 p-[1px] shadow-sm dark:from-purple-500/40 dark:via-fuchsia-500/40 dark:to-pink-500/40"
        >
          <div className="h-full w-full rounded-[calc(1.5rem-1px)] bg-purple-100/90 p-8 dark:bg-neutral-900/60">
            <ShieldCheck className="mb-5 h-8 w-8 text-purple-600 dark:text-purple-400" />
            <h3 className="mb-3 text-xl font-bold text-neutral-900 dark:text-white">{t("philosophy.title")}</h3>
            <p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-300">
              {t("philosophy.desc")}
            </p>
          </div>
        </motion.div>

        {/* Khối Lợi thế cạnh tranh */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="col-span-1 rounded-3xl bg-gradient-to-br from-indigo-400 via-blue-400 to-cyan-400 p-[1px] shadow-sm dark:from-indigo-500/40 dark:via-blue-500/40 dark:to-cyan-500/40"
        >
          <div className="h-full w-full rounded-[calc(1.5rem-1px)] bg-blue-100/90 p-8 dark:bg-neutral-900/60">
            <Globe className="mb-5 h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h3 className="mb-3 text-xl font-bold text-neutral-900 dark:text-white">{t("edge.title")}</h3>
            <p className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-300">
              {t("edge.desc")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}