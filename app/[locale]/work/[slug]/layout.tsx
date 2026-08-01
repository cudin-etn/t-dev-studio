import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { getSiteUrl, isLocale, SITE_NAME } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }>; children: React.ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const product = await getProductBySlug(slug, locale);
  if (!product) return {};

  const title = `${product.name} — ${locale === "vi" ? "Case Study" : "Case Study"} | ${SITE_NAME}`;
  const description = product.caseStudyChallenge || product.description;
  const image = product.assets.og || "/og-banner.jpg";
  const baseUrl = getSiteUrl();

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/work/${slug}`,
      languages: { vi: `/vi/work/${slug}`, en: `/en/work/${slug}` },
    },
    openGraph: {
      type: "article",
      locale: locale === "vi" ? "vi_VN" : "en_US",
      url: `${baseUrl}/${locale}/work/${slug}`,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: product.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function CaseStudyLayout({ children }: Props) {
  return children;
}
