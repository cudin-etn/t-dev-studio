import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Download, FileText, Github, type LucideIcon } from "lucide-react";
import ProductGallery from "@/components/ProductGallery";
import { getProductBySlug, PLATFORM_META, type LocalizedProduct, type ReleaseAsset } from "@/lib/products";
import { CONTACT_EMAIL, getSiteUrl, isLocale, OWNER_NAME, SITE_NAME, type Locale } from "@/lib/site";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

const labels = {
  vi: { back: "Tất cả sản phẩm", selected: "Ghi chú sản phẩm", highlights: "Điểm nổi bật", interface: "Giao diện", interfaceLead: "Một workflow phức tạp vẫn có thể trở nên dễ tiếp cận khi từng bước được thiết kế rõ ràng.", release: "Phiên bản & tải xuống", version: "Phiên bản", size: "Dung lượng", license: "Giấy phép", pricing: "Chi phí", downloads: "lượt tải", download: "Tải về", github: "GitHub", docs: "Tài liệu", website: "Website", soon: "Link tải đang được chuẩn bị", contact: "Cần một sản phẩm tương tự?", contactLead: "Trao đổi trực tiếp để biến một workflow khó chịu thành công cụ dễ dùng.", contactCta: "Liên hệ làm việc" },
  en: { back: "All products", selected: "Product note", highlights: "Highlights", interface: "Interface", interfaceLead: "Complex workflows can feel approachable when every step is designed with clarity.", release: "Release & downloads", version: "Version", size: "Size", license: "License", pricing: "Pricing", downloads: "downloads", download: "Download", github: "GitHub", docs: "Docs", website: "Website", soon: "Download link is being prepared", contact: "Need something similar?", contactLead: "Let's turn a frustrating workflow into a tool that feels easy to use.", contactCta: "Start a conversation" },
} as const;

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const product = await getProductBySlug(slug, locale);
  if (!product) notFound();

  const t = labels[locale];
  const heroImage = product.assets.hero || product.assets.logo;
  const screenshots = product.screenshots.length > 0 ? product.screenshots : [{ url: heroImage, alt: { vi: `${product.name} preview`, en: `${product.name} preview` } }];
  const primaryAsset = getPrimaryAsset(product);
  const jsonLd = buildSoftwareJsonLd(product, locale);

  return (
    <main id="main-content" className="min-h-screen bg-[#f7f5f0] px-5 pb-24 pt-32 text-stone-950 md:px-10 md:pt-40 lg:px-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-[1320px]">
        <Link href={`/${locale}#products`} className="group inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/70 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:-translate-x-0.5 hover:border-stone-950 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2">
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" /> {t.back}
        </Link>

        <section className="mt-12 grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">{t.selected} · {product.category}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {product.platforms.map((platform) => <span key={platform} className="rounded-full bg-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700">{PLATFORM_META[platform].label}</span>)}
              {product.chips.slice(0, 3).map((chip) => <span key={chip.key} className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-600">{chip.label}</span>)}
            </div>
            <h1 className="mt-7 text-5xl font-medium tracking-[-0.05em] md:text-7xl">{product.name}</h1>
            <p className="mt-6 max-w-xl text-2xl leading-[1.35] tracking-[-0.025em] text-stone-700">{product.tagline}</p>
            <p className="mt-6 max-w-xl text-base leading-7 text-stone-600">{product.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryAsset ? <DownloadButton asset={primaryAsset} label={t.download} /> : product.links.download ? <a href={product.links.download} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white"><Download className="h-4 w-4" />{t.download}</a> : <span className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-500">{t.soon}</span>}
              {product.links.github && <ExternalAction href={product.links.github} label={t.github} icon={Github} />}
              {product.links.docs && <ExternalAction href={product.links.docs} label={t.docs} icon={FileText} />}
              {product.links.website && <ExternalAction href={product.links.website} label={t.website} icon={ArrowUpRight} />}
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-[40px] border border-stone-200 bg-[#e9e4da] shadow-[0_35px_100px_rgba(56,47,36,0.13)]">
            <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 75% 18%, ${product.accentColor}35, transparent 36%)` }} />
            <div className="absolute inset-[8%] overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-[0_25px_70px_rgba(56,47,36,0.13)]">
              <Image src={heroImage} alt={`${product.name} product preview`} fill priority sizes="(max-width: 1024px) 100vw, 700px" className="object-contain p-[10%]" />
            </div>
          </div>
        </section>

        <section className="mt-24 grid gap-12 border-t border-stone-300 pt-12 lg:grid-cols-[0.42fr_1fr] lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">01</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">{t.highlights}</h2>
          </div>
          <ul className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {product.featureLabels.map((feature) => <li key={feature} className="flex gap-3 border-t border-stone-300 pt-4 text-base leading-7 text-stone-700"><Check className="mt-1 h-5 w-5 shrink-0 text-amber-800" />{feature}</li>)}
          </ul>
        </section>

        <section className="mt-24 border-t border-stone-300 pt-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">02</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">{t.interface}</h2></div>
            <p className="max-w-md text-sm leading-6 text-stone-600">{t.interfaceLead}</p>
          </div>
          <div className="mt-8"><ProductGallery screenshots={screenshots} locale={locale} /></div>
        </section>

        <section className="mt-24 grid gap-8 border-t border-stone-300 pt-12 lg:grid-cols-[0.42fr_1fr] lg:gap-20">
          <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">03</p><h2 className="mt-4 text-3xl font-medium tracking-[-0.04em]">{t.release}</h2></div>
          <div className="rounded-[30px] border border-stone-200 bg-white p-6 md:p-8">
            <div className="grid gap-3 sm:grid-cols-4">
              <Meta label={t.version} value={product.releaseMeta.version || "Latest"} />
              <Meta label={t.size} value={product.releaseMeta.size || "-"} />
              <Meta label={t.license} value={product.releaseMeta.license || "Free"} />
              <Meta label={t.pricing} value={product.releaseMeta.pricing || "Free"} />
            </div>
            <div className="mt-8 divide-y divide-stone-200 border-t border-stone-200">
              {product.releases?.flatMap((release) => release.assets.filter((asset) => asset.isActive).map((asset) => <div key={asset.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">{asset.label}</p><p className="mt-1 text-xs text-stone-500">{PLATFORM_META[asset.platform].label}{asset.fileSize ? ` · ${asset.fileSize}` : ""}</p></div><DownloadButton asset={asset} label={t.download} /></div>))}
              {!primaryAsset && <p className="py-5 text-sm text-stone-500">{t.soon}</p>}
            </div>
          </div>
        </section>

        <section className="mt-24 overflow-hidden rounded-[40px] bg-[#596456] p-8 text-[#f8f6f1] md:p-14">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ead9bb]">04 · Collaboration</p>
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div><h2 className="max-w-2xl text-4xl font-medium tracking-[-0.04em] md:text-6xl">{t.contact}</h2><p className="mt-5 max-w-xl text-base leading-7 text-stone-100/80">{t.contactLead}</p></div>
            <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(product.name)}`} className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#ead9bb] px-5 py-3 text-sm font-semibold text-[#514a3f] transition hover:-translate-y-0.5 hover:bg-white">{t.contactCta}<ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>
          </div>
        </section>
      </div>
    </main>
  );
}

function DownloadButton({ asset, label }: { asset: ReleaseAsset; label: string }) {
  return <a href={`/api/download/${asset.id}`} className="inline-flex items-center gap-2 rounded-full bg-[#665745] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#8a6f4d]"><Download className="h-4 w-4" />{label}</a>;
}

function ExternalAction({ href, label, icon: Icon }: { href: string; label: string; icon: LucideIcon }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 transition hover:-translate-y-0.5 hover:border-stone-950"><Icon className="h-4 w-4" />{label}</a>;
}

function Meta({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[18px] bg-stone-100 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-stone-500">{label}</p><p className="mt-2 text-sm font-semibold text-stone-900">{value}</p></div>;
}

function getPrimaryAsset(product: LocalizedProduct) {
  return product.releases?.find((release) => release.status === "published")?.assets.find((asset) => asset.isActive);
}

function buildSoftwareJsonLd(product: LocalizedProduct, locale: Locale) {
  const siteUrl = getSiteUrl();
  return { "@context": "https://schema.org", "@type": "SoftwareApplication", name: product.name, description: product.description, image: product.assets.og || product.assets.hero || product.assets.logo, url: `${siteUrl}/${locale}/products/${product.slug}`, applicationCategory: product.category, operatingSystem: product.platforms.map((platform) => PLATFORM_META[platform].label).join(", "), offers: { "@type": "Offer", price: product.releaseMeta.pricing?.toLowerCase() === "free" ? "0" : product.releaseMeta.pricing || "0", priceCurrency: "USD" }, creator: { "@type": "Person", name: OWNER_NAME, worksFor: { "@type": "Organization", name: SITE_NAME } } };
}
