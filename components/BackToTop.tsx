"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackToTop({ label = "Back to top" }: { label?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 520);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      className="fixed bottom-5 right-5 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-[#665745] text-white shadow-[0_12px_30px_rgba(56,47,36,0.2)] transition hover:-translate-y-1 hover:bg-[#8a6f4d] focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2 md:bottom-8 md:right-8"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
