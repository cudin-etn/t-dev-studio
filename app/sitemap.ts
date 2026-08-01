import { MetadataRoute } from "next";
import { getPublishedProducts } from "@/lib/products";
import { getSiteUrl, LOCALES } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const products = await getPublishedProducts("vi");

  const staticPages = LOCALES.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    alternates: {
      languages: Object.fromEntries(LOCALES.map((language) => [language, `${baseUrl}/${language}`])),
    },
  }));

  const productPages = products.flatMap((product) =>
    LOCALES.map((locale) => ({
      url: `${baseUrl}/${locale}/products/${product.slug}`,
      lastModified: product.updatedAt || product.publishedAt
        ? new Date(product.updatedAt ?? product.publishedAt ?? "")
        : undefined,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((language) => [language, `${baseUrl}/${language}/products/${product.slug}`]),
        ),
      },
    }))
  );

  return [
    ...staticPages,
    ...productPages,
    { url: `${baseUrl}/privacy` },
    { url: `${baseUrl}/terms` },
  ];
}
