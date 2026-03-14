"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import LocaleSwitch from "@/components/LocaleSwitch";
import { useTranslations } from "next-intl";
import { LayoutDashboard, User, Mail } from "lucide-react";

export default function Header() {
  const t = useTranslations();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const clickLock = useRef(false);

  const navItems = [
    { id: "home", icon: LayoutDashboard, label: t("nav.home") },
    { id: "about", icon: User, label: t("nav.about") },
    { id: "footer", icon: Mail, label: t("nav.contact") },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !clickLock.current) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -69% 0px" } 
    );

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [navItems]);

  const handleNavClick = (id: string) => {
    clickLock.current = true;
    setActiveSection(id);
    setTimeout(() => {
      clickLock.current = false;
    }, 800);
  };

  return (
    <header className={`fixed inset-x-0 z-50 flex justify-center px-4 transition-all duration-500 ${scrolled ? "top-4" : "top-6"}`}>
      <div className="w-full max-w-5xl rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 p-[1px] shadow-xl shadow-indigo-500/10 dark:from-indigo-500/40 dark:via-purple-500/40 dark:to-cyan-500/40 transition-all">
        
        {/* Thu hẹp padding trên mobile (px-2) để tối ưu không gian, Desktop px-4 */}
        <div className="flex h-14 w-full items-center justify-between rounded-full bg-white/95 px-2 backdrop-blur-xl dark:bg-neutral-900/95 md:px-4">
          
          {/* TRÁI: Logo */}
          <div className="flex items-center gap-2 px-1 md:gap-3">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full shadow-sm">
              <Image src="/ic_cat_coder.png" alt="T-Dev Studio logo" fill className="object-cover" />
            </div>
            <span className="hidden bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-sm font-bold tracking-tight text-transparent sm:block">
              T-Dev Studio
            </span>
          </div>

          {/* GIỮA: Navigation (Điện thoại = Icon, Máy tính = Text) */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  title={item.label} // Hiện tên khi hover chuột (rất tiện)
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center justify-center gap-2 rounded-full p-2.5 text-sm font-semibold transition-all md:px-4 md:py-2 ${
                    isActive ? "text-indigo-700 dark:text-indigo-300" : "text-neutral-500 hover:text-indigo-500 dark:text-neutral-400 dark:hover:text-indigo-300"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-bg"
                      className="absolute inset-0 -z-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {/* ICON: Chỉ hiện trên Mobile (dưới màn md) */}
                  <item.icon className="h-5 w-5 md:hidden" />
                  
                  {/* TEXT: Chỉ hiện trên Desktop (từ màn md trở lên) */}
                  <span className="hidden md:block">{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* PHẢI: Utilities */}
          <div className="flex items-center gap-1 px-1 md:gap-2">
            <LocaleSwitch />
            <ThemeToggle />
          </div>
          
        </div>
      </div>
    </header>
  );
}