"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function LocaleSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const locale = useLocale();

  function switchLocale(locale: "vi" | "en") {
    const nextPath = pathname.replace(/^\/(vi|en)(?=\/|$)/, `/${locale}`);
    startTransition(() => {
      router.push(nextPath === pathname ? `/${locale}` : nextPath);
    });
  }

  return (
    <div className="flex items-center rounded-full border border-stone-300 bg-white/80 p-1 text-sm backdrop-blur">
      {(["vi", "en"] as const).map((lang) => {
        const active = locale === lang;

        return (
          <button
            type="button"
            key={lang}
            onClick={() => switchLocale(lang)}
            aria-pressed={active}
            aria-label={lang === "vi" ? "Chuyển sang tiếng Việt" : "Switch to English"}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${active ? "bg-[#665745] text-white" : "text-stone-500 hover:text-[#665745]"}`}
          >
            {lang.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
