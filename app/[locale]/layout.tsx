import type { Metadata } from "next";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LocaleDocumentLang from "@/components/LocaleDocumentLang";
import BackToTop from "@/components/BackToTop";
import { getSiteUrl, isLocale, SITE_NAME } from "@/lib/site";

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const isVI = locale === "vi";
  const title = isVI ? "T-Dev Studio — Phần mềm làm đúng, chạy mọi nền tảng" : "T-Dev Studio — Software, Done Right";
  const description = isVI ? "T-Dev Studio phát triển công cụ và ứng dụng đa nền tảng cho Android, macOS, Windows và Linux. UI sạch, kỹ thuật vững." : "T-Dev Studio builds cross-platform tools and apps for Android, macOS, Windows and Linux. Clean UI, solid engineering.";

  return {
    title,
    description,
    applicationName: SITE_NAME,
    metadataBase: new URL(getSiteUrl()),
    openGraph: { type: "website", locale: isVI ? "vi_VN" : "en_US", url: `${getSiteUrl()}/${locale}`, siteName: SITE_NAME, title, description, images: [{ url: "/og-banner.jpg", width: 1200, height: 630, alt: SITE_NAME }] },
    twitter: { card: "summary_large_image", title, description, images: ["/og-banner.jpg"] },
    alternates: { canonical: `/${locale}`, languages: { vi: `${getSiteUrl()}/vi`, en: `${getSiteUrl()}/en` } },
    robots: { index: true, follow: true },
    icons: { icon: "/favicon.png", shortcut: "/favicon.png", apple: "/favicon.png" }
  };
}

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  let messages;
  try { messages = await getMessages({ locale }); } catch { notFound(); }

 return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleDocumentLang locale={locale} />
      <a href="#main-content" className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition focus:translate-y-0">
        {locale === "vi" ? "Bỏ qua điều hướng" : "Skip to content"}
      </a>
      <Header />
      {children}
      <div id="footer">
        <Footer />
      </div>
      <BackToTop label={locale === "vi" ? "Về đầu trang" : "Back to top"} />
    </NextIntlClientProvider>
  );
}
