import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download, Mail } from "lucide-react";
import Reveal from "@/components/Reveal";
import { CONTACT_EMAIL, type Locale } from "@/lib/site";
import { PLATFORM_META, type LocalizedProduct, type ReleaseAsset } from "@/lib/products/types";

type Props = {
  products: LocalizedProduct[];
  locale: Locale;
};

const copy = {
  vi: {
    eyebrow: "T-Dev Studio · Freelance product engineer",
    title: "Biến những bài toán kỹ thuật khó thành sản phẩm dễ dùng.",
    lead: "Tôi thiết kế và phát triển app native, tool hệ thống và sản phẩm đa nền tảng — từ kiến trúc, hiệu năng đến trải nghiệm cuối cùng.",
    contact: "Bắt đầu một dự án",
    github: "Xem case study",
    work: "Selected case studies",
    workLead: "Hai sản phẩm tâm huyết, nơi kỹ thuật nền tảng và trải nghiệm người dùng phải cùng đạt tiêu chuẩn cao.",
    detail: "Xem case study",
    catalogDetail: "Khám phá sản phẩm",
    download: "Tải về",
    downloads: "lượt tải",
    more: "Thêm sản phẩm",
    moreLead: "Những công cụ nhỏ hơn, cùng một tiêu chuẩn hoàn thiện.",
    catalog: "Xem toàn bộ sản phẩm",
    soon: "Đang hoàn thiện",
  },
  en: {
    eyebrow: "T-Dev Studio · Freelance product engineer",
    title: "Turning difficult technical problems into products people can use.",
    lead: "I design and build native apps, system tools, and cross-platform products — from architecture and performance to the final user experience.",
    contact: "Start a project",
    github: "View case studies",
    work: "Selected case studies",
    workLead: "Two products I care deeply about, where systems engineering and product UX had to meet the same high standard.",
    detail: "View case study",
    catalogDetail: "Explore product",
    download: "Download",
    downloads: "downloads",
    more: "More products",
    moreLead: "Smaller tools, held to the same standard of finish.",
    catalog: "View all products",
    soon: "In progress",
  },
} as const;

export default function DashboardGrid({ products, locale }: Props) {
  const t = copy[locale];
  const featured = products.filter((product) => product.featured).slice(0, 2);
  const remaining = products.filter((product) => !featured.some((item) => item.slug === product.slug));

  return (
    <div id="home" className="overflow-hidden">
      <section className="relative mx-auto grid min-h-[92svh] max-w-[1440px] items-center gap-14 px-5 pb-20 pt-32 md:px-10 lg:grid-cols-[0.86fr_1.14fr] lg:px-14 lg:pt-36">
        <div className="relative z-10 hero-enter">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">{t.eyebrow}</p>
          <h1 className="mt-7 max-w-3xl text-balance text-[2.1rem] font-medium leading-[1.12] tracking-[-0.03em] text-stone-950 sm:text-5xl lg:text-[2.9rem] xl:text-[3.25rem]">
            {t.title}
          </h1>
          <p className="mt-7 max-w-xl text-pretty text-base leading-7 text-stone-600 md:text-lg md:leading-8">{t.lead}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href={`mailto:${CONTACT_EMAIL}`} className="group inline-flex items-center gap-2 rounded-full bg-[#665745] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#8a6f4d] focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2">
              <Mail className="h-4 w-4" /> {t.contact}
              <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <Link href={`/${locale}/work`} className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/80 px-5 py-3 text-sm font-semibold text-stone-800 transition duration-300 hover:-translate-y-0.5 hover:border-stone-950 hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2">
              <ArrowRight className="h-4 w-4" /> {t.github}
            </Link>
          </div>
        </div>

        <div className="relative min-h-[430px] hero-enter hero-enter-delay sm:min-h-[560px]">
          <div className="absolute inset-3 rounded-[48px] bg-[#ded7c9]" />
          <div className="absolute inset-x-[11%] inset-y-0 rotate-3 rounded-[44px] bg-[#b5c1b1]" />
          <div className="absolute inset-x-[5%] inset-y-[6%] -rotate-2 overflow-hidden rounded-[40px] border border-white/70 bg-[#f0ece3] shadow-[0_40px_120px_rgba(56,47,36,0.18)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(255,255,255,0.95),transparent_38%)]" />
            <div className="absolute -right-20 top-16 h-72 w-72 rounded-full bg-[#d7b98e]/60 blur-3xl" />
            <div className="absolute left-7 top-7 rounded-full border border-stone-300/70 bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-600 backdrop-blur">Software collection</div>
            {products.slice(0, 3).map((product, index) => (
              <div
                key={product.slug}
                className={`absolute flex items-center gap-3 rounded-[22px] border border-white/80 bg-white/85 p-3 shadow-[0_18px_55px_rgba(41,37,36,0.14)] backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:scale-[1.04] ${index === 0 ? "left-[8%] top-[22%]" : index === 1 ? "right-[7%] top-[46%]" : "bottom-[10%] left-[18%]"}`}
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-[19px] bg-stone-100">
                  <Image src={product.assets.logo} alt="" fill sizes="80px" className="object-contain p-2.5" />
                </div>
                <div className="min-w-0 pr-3">
                  <p className="max-w-36 truncate text-sm font-bold text-stone-950">{product.name}</p>
                  <p className="mt-1 text-xs text-stone-500">{product.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="scroll-mt-24 px-5 py-24 md:px-10 lg:px-14">
        <div className="mx-auto max-w-[1320px]">
          <Reveal className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">01 · Selected work</p>
            <h2 className="mt-5 text-4xl font-medium tracking-[-0.04em] text-stone-950 md:text-6xl">{t.work}</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600 md:text-lg">{t.workLead}</p>
          </Reveal>

          <div className="mt-16 space-y-24 md:space-y-32">
            {featured.map((product, index) => (
              <ProductStory key={product.slug} product={product} locale={locale} labels={t} reverse={index % 2 === 1} delay={index * 90} />
            ))}
          </div>

          {remaining.length > 0 && (
            <div className="mt-28 border-t border-stone-300 pt-12">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-stone-950">{t.more}</h2>
                  <p className="mt-2 text-sm text-stone-600">{t.moreLead}</p>
                </div>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {remaining.slice(0, 4).map((product) => (
                  <CompactProduct key={product.slug} product={product} locale={locale} labels={t} />
                ))}
              </div>
              {remaining.length > 0 && (
                <Link href={`/${locale}/products`} className="group mt-7 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/70 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:-translate-y-0.5 hover:border-[#665745]">
                  {t.catalog}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ProductStory({ product, locale, labels, reverse, delay }: { product: LocalizedProduct; locale: Locale; labels: (typeof copy)[Locale]; reverse: boolean; delay: number }) {
  const asset = getPrimaryAsset(product);
  return (
    <Reveal delay={delay}>
      <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <Link href={`/${locale}/work/${product.slug}`} className={`group relative aspect-[4/3] overflow-hidden rounded-[36px] border border-stone-200 bg-[#e9e4da] shadow-[0_30px_90px_rgba(56,47,36,0.12)] focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-4 ${reverse ? "lg:order-2" : ""}`}>
        <div className="absolute inset-0 opacity-70" style={{ background: `radial-gradient(circle at 74% 20%, ${product.accentColor}26, transparent 38%)` }} />
        <div className="absolute inset-[9%] overflow-hidden rounded-[28px] border border-white/80 bg-white/72 shadow-[0_24px_70px_rgba(41,37,36,0.12)] transition duration-700 ease-out group-hover:scale-[1.025] group-hover:-rotate-1">
          <Image src={product.assets.hero || product.assets.logo} alt={`${product.name} product preview`} fill sizes="(max-width: 1024px) 100vw, 620px" className="object-contain p-[10%] transition duration-700 group-hover:scale-[1.035]" />
        </div>
        <span className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#665745] text-white transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </Link>

      <div className={reverse ? "lg:pr-10" : "lg:pl-2"}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">{product.category}</span>
          {product.platforms.map((platform) => <span key={platform} className="rounded-full bg-stone-200/70 px-2.5 py-1 text-[11px] font-semibold text-stone-700">{PLATFORM_META[platform].label}</span>)}
        </div>
        <h3 className="mt-5 text-4xl font-medium tracking-[-0.04em] text-stone-950 md:text-5xl">{product.name}</h3>
        <p className="mt-4 text-xl leading-8 text-stone-700">{product.tagline}</p>
        <p className="mt-5 line-clamp-4 max-w-xl text-sm leading-7 text-stone-600 md:text-base">{product.description}</p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link href={`/${locale}/work/${product.slug}`} className="group inline-flex items-center gap-2 rounded-full bg-[#665745] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#8a6f4d]">
            {labels.detail} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
          {asset ? <DownloadLink asset={asset} label={labels.download} /> : product.links.download ? <a href={product.links.download} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold"><Download className="h-4 w-4" />{labels.download}</a> : <span className="rounded-full border border-stone-300 px-4 py-2.5 text-xs font-semibold text-stone-500">{labels.soon}</span>}
        </div>
      </div>
      </article>
    </Reveal>
  );
}

function CompactProduct({ product, locale, labels }: { product: LocalizedProduct; locale: Locale; labels: (typeof copy)[Locale] }) {
  return (
    <Link href={`/${locale}/products/${product.slug}`} className="group flex items-center gap-4 rounded-[24px] border border-stone-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-stone-400 hover:shadow-[0_20px_55px_rgba(56,47,36,0.08)]">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[18px] bg-stone-100">
        <Image src={product.assets.logo} alt="" fill sizes="80px" className="object-contain p-3" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-semibold text-stone-950">{product.name}</p>
        <p className="mt-1 line-clamp-1 text-sm text-stone-600">{product.tagline}</p>
      </div>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-stone-500 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
      <span className="sr-only">{labels.catalogDetail}</span>
    </Link>
  );
}

function DownloadLink({ asset, label }: { asset: ReleaseAsset; label: string }) {
  return (
    <a href={`/api/download/${asset.id}`} className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 transition hover:-translate-y-0.5 hover:border-[#665745]">
      <Download className="h-4 w-4" /> {label}
    </a>
  );
}

function getPrimaryAsset(product: LocalizedProduct) {
  return product.releases?.find((release) => release.status === "published")?.assets.find((asset) => asset.isActive);
}
