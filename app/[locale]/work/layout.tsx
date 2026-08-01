import type { Metadata } from "next";
import { getSiteUrl, isLocale, SITE_NAME, type Locale } from "@/lib/site";

type Props = { params: Promise<{ locale: string }>; children: React.ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const title = locale === "vi" ? "Dự án tiêu biểu — T-Dev Studio" : "Selected Work — T-Dev Studio";
  const description = locale === "vi"
    ? "Các case study về sản phẩm native, tool hệ thống và ứng dụng đa nền tảng của T-Dev Studio."
    : "Case studies covering native products, system tools, and cross-platform applications by T-Dev Studio.";
  const baseUrl = getSiteUrl();

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/work`,
      languages: { vi: "/vi/work", en: "/en/work" },
    },
    openGraph: {
      type: "website",
      locale: locale === "vi" ? "vi_VN" : "en_US",
      url: `${baseUrl}/${locale}/work`,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: "/og-banner.jpg", width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-banner.jpg"] },
  };
}

export default function WorkLayout({ children }: Props) {
  return children;
}
