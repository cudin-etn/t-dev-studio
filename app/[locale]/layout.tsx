import type { Metadata } from "next";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const isVI = locale === "vi";
  const title = isVI ? "T-Dev Studio — Phần mềm làm đúng, chạy mọi nền tảng" : "T-Dev Studio — Software, Done Right";
  const description = isVI ? "T-Dev Studio phát triển công cụ và ứng dụng đa nền tảng cho Android, macOS, Windows và Linux. UI sạch, kỹ thuật vững." : "T-Dev Studio builds cross-platform tools and apps for Android, macOS, Windows and Linux. Clean UI, solid engineering.";

  return {
    title: { default: title, template: "%s — T-Dev Studio" },
    description,
    applicationName: "T-Dev Studio",
    metadataBase: new URL("https://tdevstudio.com"),
    openGraph: { type: "website", siteName: "T-Dev Studio", title, description, images: [{ url: "/og.png", width: 1200, height: 630, alt: "T-Dev Studio" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
    alternates: { canonical: `/${locale}`, languages: { vi: "/vi", en: "/en" } },
    robots: { index: true, follow: true },
    icons: { icon: "/favicon.ico", shortcut: "/favicon.ico", apple: "/apple-touch-icon.png" }
  };
}

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  let messages;
  try { messages = await getMessages({ locale }); } catch { notFound(); }

 return (
    // Thêm scroll-smooth và scroll-pt-32 để cuộn mượt và không bị Header đè nội dung
    <html lang={locale} suppressHydrationWarning className="scroll-smooth scroll-pt-32">
      <body className="antialiased" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          
          <main className="flex min-h-screen flex-col">
            {children}
          </main>
         <div id="footer">
            <Footer />
          </div>
          
        </NextIntlClientProvider>
      </body>
    </html>
  );
}