import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { getSiteUrl, isLocale, SITE_NAME } from "@/lib/site";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug, locale } = await params;
  if (!isLocale(locale)) return {};

  const product = await getProductBySlug(slug, locale);

  if (!product) {
    return {};
  }

  const title = product.seoTitle && product.seoTitle !== product.name ? product.seoTitle : `${product.name} — T-Dev Studio`;
  const description = product.seoDescription || product.description;
  const ogImage = product.seo.ogImage || (product.assets.og && product.assets.og !== "/og.png" ? product.assets.og : "/og-banner.jpg");

  return {
    title,
    description,
    metadataBase: new URL(getSiteUrl()),
    alternates: {
      canonical: `/${locale}/products/${slug}`,
      languages: {
        vi: `/vi/products/${slug}`,
        en: `/en/products/${slug}`
      }
    },
    openGraph: {
      type: "website",
      locale: locale === "vi" ? "vi_VN" : "en_US",
      url: `${getSiteUrl()}/${locale}/products/${slug}`,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: product.name
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage]
    }
  };
}

export default function ProductLayout({ children }: Props) {
  return <>{children}</>;
}
