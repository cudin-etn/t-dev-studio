import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Download, Github, ExternalLink, type LucideIcon } from "lucide-react";
import ProductGallery from "@/components/ProductGallery";
import { getProductBySlug, PLATFORM_META, type LocalizedProduct, type ReleaseAsset } from "@/lib/products";
import { CONTACT_EMAIL, getSiteUrl, isLocale, OWNER_NAME, SITE_NAME, type Locale } from "@/lib/site";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

const labels = {
  vi: {
    back: "Tất cả dự án",
    challenge: "Bài toán",
    approach: "Cách tiếp cận",
    solution: "Giải pháp",
    highlights: "Điểm kỹ thuật nổi bật",
    results: "Kết quả",
    role: "Vai trò",
    duration: "Thời gian",
    release: "Phiên bản & tải xuống",
    version: "Phiên bản",
    size: "Dung lượng",
    license: "Giấy phép",
    pricing: "Chi phí",
    downloads: "lượt tải",
    download: "Tải về",
    github: "GitHub",
    docs: "Tài liệu",
    website: "Website",
    playStore: "Google Play",
    appStore: "App Store",
    liveDemo: "Demo trực tuyến",
    solutionLead: "Giao diện và trải nghiệm người dùng được thiết kế để phức tạp trở nên dễ tiếp cận.",
    soon: "Link tải đang được chuẩn bị",
    contact: "Có bài toán tương tự?",
    contactLead: "Hãy trao đổi để biến một workflow khó chịu thành công cụ dễ dùng.",
    contactCta: "Liên hệ làm việc",
  },
  en: {
    back: "All projects",
    challenge: "The Challenge",
    approach: "The Approach",
    solution: "The Solution",
    highlights: "Technical Highlights",
    results: "Results",
    role: "Role",
    duration: "Duration",
    release: "Release & downloads",
    version: "Version",
    size: "Size",
    license: "License",
    pricing: "Pricing",
    downloads: "downloads",
    download: "Download",
    github: "GitHub",
    docs: "Docs",
    website: "Website",
    playStore: "Google Play",
    appStore: "App Store",
    liveDemo: "Live Demo",
    solutionLead: "The interface and experience are designed to make complex workflows feel approachable.",
    soon: "Download link is being prepared",
    contact: "Have a similar challenge?",
    contactLead: "Let's turn a frustrating workflow into a tool that feels easy to use.",
    contactCta: "Start a conversation",
  },
} as const;

const contactChannels = {
  email: { label: "Email", href: `mailto:${CONTACT_EMAIL}`, icon: "📧" },
  telegram: { label: "Telegram", href: "https://t.me/cudin_etn", icon: "💬" },
  zalo: { label: "Zalo", href: "https://zalo.me/0977986982", icon: "💚" },
} as const;

export default async function CaseStudyPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const product = await getProductBySlug(slug, locale);
  if (!product) notFound();

  const t = labels[locale];
  const heroImage = product.assets.hero || product.assets.logo;
  const screenshots = product.screenshots.length > 0 ? product.screenshots : [{ url: heroImage, alt: { vi: `${product.name} preview`, en: `${product.name} preview` } }];
  const primaryAsset = getPrimaryAsset(product);
  const jsonLd = buildCaseStudyJsonLd(product, locale);

  return (
    <main id="main-content" className="min-h-screen bg-[#f7f5f0] px-5 pb-24 pt-32 text-stone-950 md:px-10 md:pt-40 lg:px-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-[1320px]">
        <Link href={`/${locale}/work`} className="group inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/70 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:-translate-x-0.5 hover:border-stone-950 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2">
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" /> {t.back}
        </Link>

        {/* Masthead */}
        <section className="mt-12 grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">{product.category} · Case Study</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {product.platforms.map((platform) => <span key={platform} className="rounded-full bg-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700">{PLATFORM_META[platform].label}</span>)}
              {product.chips.slice(0, 3).map((chip) => <span key={chip.key} className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-600">{chip.label}</span>)}
            </div>
            <h1 className="mt-7 text-5xl font-medium tracking-[-0.05em] md:text-7xl">{product.name}</h1>
            <p className="mt-6 max-w-xl text-2xl leading-[1.35] tracking-[-0.025em] text-stone-700">{product.tagline}</p>
            <p className="mt-6 max-w-xl text-base leading-7 text-stone-600">{product.description}</p>

            {product.caseStudyRole && (
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-stone-600">
                <span className="flex items-center gap-1.5">
                  <span className="font-semibold text-stone-950">{t.role}:</span>
                  <span>{product.caseStudyRole}</span>
                </span>
                {product.caseStudyDuration && (
                  <span className="flex items-center gap-1.5">
                    <span className="font-semibold text-stone-950">{t.duration}:</span>
                    <span>{product.caseStudyDuration}</span>
                  </span>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {primaryAsset ? <DownloadButton asset={primaryAsset} label={t.download} /> : product.links.download ? <a href={product.links.download} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white"><Download className="h-4 w-4" />{t.download}</a> : <span className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-500">{t.soon}</span>}
              {product.links.github && <ExternalAction href={product.links.github} label={t.github} icon={Github} />}
              {product.caseStudyLinks?.playStore && <ExternalAction href={product.caseStudyLinks.playStore} label={t.playStore} icon={ExternalLink} />}
              {product.caseStudyLinks?.appStore && <ExternalAction href={product.caseStudyLinks.appStore} label={t.appStore} icon={ExternalLink} />}
              {product.caseStudyLinks?.liveDemo && <ExternalAction href={product.caseStudyLinks.liveDemo} label={t.liveDemo} icon={ExternalLink} />}
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-[40px] border border-stone-200 bg-[#e9e4da] shadow-[0_35px_100px_rgba(56,47,36,0.13)]">
            <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 75% 18%, ${product.accentColor}35, transparent 36%)` }} />
            <div className="absolute inset-[8%] overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-[0_25px_70px_rgba(56,47,36,0.13)]">
              <Image src={heroImage} alt={`${product.name} product preview`} fill priority sizes="(max-width: 1024px) 100vw, 700px" className="object-contain p-[10%]" />
            </div>
          </div>
        </section>

        {/* Challenge */}
        {product.caseStudyChallenge && (
          <section className="mt-24 grid gap-12 border-t border-stone-300 pt-12 lg:grid-cols-[0.42fr_1fr] lg:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">01</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">{t.challenge}</h2>
            </div>
            <div className="prose prose-stone max-w-none">
              <p className="text-base leading-8 text-stone-700">{product.caseStudyChallenge}</p>
            </div>
          </section>
        )}

        {/* Approach */}
        {product.caseStudyApproach && (
          <section className="mt-24 grid gap-12 border-t border-stone-300 pt-12 lg:grid-cols-[0.42fr_1fr] lg:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">02</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">{t.approach}</h2>
            </div>
            <div className="prose prose-stone max-w-none">
              <p className="text-base leading-8 text-stone-700">{product.caseStudyApproach}</p>
            </div>
          </section>
        )}

        {/* Solution / Interface */}
        <section className="mt-24 border-t border-stone-300 pt-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">03</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">{t.solution}</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-stone-600">{t.solutionLead}</p>
          </div>
          <div className="mt-8"><ProductGallery screenshots={screenshots} locale={locale} /></div>
        </section>

        {/* Technical Highlights */}
        {product.caseStudyHighlights.length > 0 && (
          <section className="mt-24 grid gap-12 border-t border-stone-300 pt-12 lg:grid-cols-[0.42fr_1fr] lg:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">04</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">{t.highlights}</h2>
            </div>
            <div className="space-y-8">
              {product.caseStudyHighlights.map((highlight, index) => (
                <article key={index} className="rounded-[24px] border border-stone-200 bg-white p-6 md:p-8">
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-stone-950">{highlight.title}</h3>
                  <p className="mt-4 text-base leading-8 text-stone-700">{highlight.description}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Results */}
        {product.caseStudyResults.length > 0 && (
          <section className="mt-24 grid gap-12 border-t border-stone-300 pt-12 lg:grid-cols-[0.42fr_1fr] lg:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">05</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">{t.results}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.caseStudyResults
                .filter((r) => r.locale === locale)
                .map((result, index) => (
                  <div key={index} className="rounded-[24px] border border-stone-200 bg-white p-6 text-center">
                    <p className="text-4xl font-bold tracking-[-0.04em] text-stone-950">{result.value}</p>
                    <p className="mt-2 text-sm text-stone-600">{result.metric}</p>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Release & Downloads */}
        <section className="mt-24 grid gap-8 border-t border-stone-300 pt-12 lg:grid-cols-[0.42fr_1fr] lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">06</p>
            <h2 className="mt-4 text-3xl font-medium tracking-[-0.04em]">{t.release}</h2>
          </div>
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

        {/* CTA Section */}
        <section className="mt-24 overflow-hidden rounded-[40px] bg-[#596456] p-8 text-[#f8f6f1] md:p-14">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ead9bb]">07 · Collaboration</p>
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="max-w-2xl text-4xl font-medium tracking-[-0.04em] md:text-6xl">{t.contact}</h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-stone-100/80">{t.contactLead}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`${product.name} - Freelance Inquiry`)}`} className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#ead9bb] px-5 py-3 text-sm font-semibold text-[#514a3f] transition hover:-translate-y-0.5 hover:bg-white">
                {t.contactCta} <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a href={contactChannels.telegram.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                <span className="text-lg">💬</span> Telegram
              </a>
              <a href={contactChannels.zalo.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                <span className="text-lg">💚</span> Zalo
              </a>
            </div>
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

function buildCaseStudyJsonLd(product: LocalizedProduct, locale: Locale) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "CaseStudy",
    name: product.name,
    description: product.description,
    image: product.assets.og || product.assets.hero || product.assets.logo,
    url: `${siteUrl}/${locale}/work/${product.slug}`,
    about: product.caseStudyChallenge,
    workPerformed: product.caseStudyApproach,
    author: {
      "@type": "Person",
      name: OWNER_NAME,
      worksFor: { "@type": "Organization", name: SITE_NAME }
    },
    publisher: { "@type": "Organization", name: SITE_NAME },
    datePublished: product.publishedAt,
    dateModified: product.updatedAt,
  };
}
