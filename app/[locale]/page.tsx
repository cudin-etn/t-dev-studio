"use client";

import DashboardGrid from "@/components/DashboardGrid";
import About from "@/components/About";
import Donate from "@/components/Donate";

export default function LocaleHomePage() {
  return (
    // Nền tổng thể được đặt thành màu xám cực nhạt (slate-50) để tạo tương phản với các thẻ trắng
    <main className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-neutral-950">
      
      {/* Background lơ lửng dùng chung cho toàn bộ cuộn trang */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(99,102,241,0.08),transparent_60%)]" />
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] animate-[pulse_10s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-transparent blur-3xl" />
      </div>

      {/* Lắp ráp các Component (Đã chèn ID cho Sidebar Scroll) */}
      <div className="relative z-10 w-full">
        <div id="home">
          <DashboardGrid />
        </div>
        <div id="about">
          <About />
        </div>
        <div id="donate">
          <Donate />
        </div>
      </div>

    </main>
  );
}