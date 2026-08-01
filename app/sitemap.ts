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

  const workProducts = products.filter((product) => product.caseStudyChallenge && !/coming soon|đang cập nhật/i.test(product.caseStudyChallenge));
  const workPages = workProducts.flatMap((product) =>
    LOCALES.map((locale) => ({
      url: `${baseUrl}/${locale}/work/${product.slug}`,
      lastModified: product.updatedAt || product.publishedAt
        ? new Date(product.updatedAt ?? product.publishedAt ?? "")
        : undefined,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((language) => [language, `${baseUrl}/${language}/work/${product.slug}`]),
        ),
      },
    }))
  );

  return [
    ...staticPages,
    ...productPages,
    { url: `${baseUrl}/vi/work`, alternates: { languages: { vi: `${baseUrl}/vi/work`, en: `${baseUrl}/en/work` } } },
    { url: `${baseUrl}/en/work`, alternates: { languages: { vi: `${baseUrl}/vi/work`, en: `${baseUrl}/en/work` } } },
    ...workPages,
    { url: `${baseUrl}/privacy` },
    { url: `${baseUrl}/terms` },
  ];
}
