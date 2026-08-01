import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPublishedProducts } from "@/lib/products";
import { isLocale, type Locale } from "@/lib/site";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

const copy = {
  vi: {
    eyebrow: "T-Dev Studio · Product library",
    title: "Tất cả sản phẩm",
    lead: "Một thư viện nhỏ của những công cụ, ứng dụng và workflow được xây dựng để dùng thật.",
    open: "Xem sản phẩm",
  },
  en: {
    eyebrow: "T-Dev Studio · Product library",
    title: "All products",
    lead: "A small library of tools, apps, and workflows built to be genuinely useful.",
    open: "View product",
  },
} as const;

export default async function ProductsPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const products = await getPublishedProducts(locale);
  const t = copy[locale];

  return (
    <main id="main-content" className="min-h-screen bg-[#f7f5f0] px-5 pb-24 pt-32 text-stone-950 md:px-10 md:pt-40 lg:px-14">
      <div className="mx-auto max-w-[1320px]">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">{t.eyebrow}</p>
        <h1 className="mt-6 text-5xl font-medium tracking-[-0.05em] md:text-7xl">{t.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">{t.lead}</p>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/${locale}/products/${product.slug}`}
              className="group overflow-hidden rounded-[30px] border border-stone-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-stone-400 hover:shadow-[0_24px_65px_rgba(56,47,36,0.1)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-[#e9e4da]">
                <Image
                  src={product.assets.hero || product.assets.logo}
                  alt={`${product.name} product preview`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                  className="object-contain p-[12%] transition duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex items-start justify-between gap-4 px-2 pb-2 pt-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-800">{product.category}</p>
                  <h2 className="mt-2 text-2xl font-medium tracking-[-0.035em]">{product.name}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">{product.tagline}</p>
                </div>
                <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-stone-500 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
              <span className="sr-only">{t.open}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
