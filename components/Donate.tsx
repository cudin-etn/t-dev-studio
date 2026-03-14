"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Donate() {
  const t = useTranslations("donate");

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative rounded-3xl bg-gradient-to-br from-rose-400 via-fuchsia-400 to-indigo-400 p-[1px] shadow-lg dark:from-rose-500/40 dark:via-fuchsia-500/40 dark:to-indigo-500/40"
      >
        {/* Nền Thẻ: Đậm đà ở Light (rose-100), Nhẹ nhàng ở Dark (neutral-900/80) */}
        <div className="relative flex h-full w-full overflow-hidden rounded-[calc(1.5rem-1px)] bg-rose-100 p-8 dark:bg-neutral-900/80 md:p-12">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-rose-500/20 blur-3xl transition-all duration-500 group-hover:bg-rose-500/30" />

          <div className="relative z-10 grid w-full gap-10 md:grid-cols-2 md:items-center">
            {/* CỘT TRÁI: Nội dung */}
            <div>
              <h3 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                {t("title")}
              </h3>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-800 dark:text-neutral-300">
                {t("description")}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={t("links.coffee")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-rose-500/30 transition hover:scale-[1.05]"
                >
                  ☕ {t("cta.coffee")}
                </a>

                <a
                  href={t("links.paypal")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center gap-2 rounded-full border border-rose-300 bg-white/60 px-6 py-3 text-sm font-medium text-neutral-800 transition hover:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  ❤️ {t("cta.paypal")}
                </a>
              </div>
            </div>

            {/* CỘT PHẢI: QR Code nhỏ nhắn */}
            <div className="flex justify-center md:justify-end">
              <div className="w-full max-w-[220px] rounded-2xl border border-rose-200/50 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-50 dark:bg-neutral-900">
                  <Image
                    src="/donate/qr-pay.png"
                    alt="Donate QR"
                    fill
                    className="object-contain p-2"
                    priority
                  />
                </div>

                <div className="mt-4 space-y-1 text-center text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                  <p>{t("bank.name")}</p>
                  <p>{t("bank.account")}</p>
                  <p>{t("bank.note")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}