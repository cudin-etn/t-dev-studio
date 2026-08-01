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
    eyebrow: "T-Dev Studio · Selected Work",
    title: "Dự án tiêu biểu",
    lead: "Mỗi dự án bắt đầu từ một vấn đề thật và kết thúc bằng một trải nghiệm gọn, nhanh, dễ tiếp cận.",
    open: "Xem chi tiết",
    role: "Vai trò",
    duration: "Thời gian",
    empty: "Chưa có dự án được xuất bản.",
  },
  en: {
    eyebrow: "T-Dev Studio · Selected Work",
    title: "Selected Work",
    lead: "Each project starts with a real problem and ends with an experience that feels focused, quick, and approachable.",
    open: "View details",
    role: "Role",
    duration: "Duration",
    empty: "No published projects yet.",
  },
} as const;

export default async function WorkPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const products = (await getPublishedProducts(locale)).filter((product) => product.caseStudyChallenge && !/coming soon|đang cập nhật/i.test(product.caseStudyChallenge));
  const t = copy[locale];

  return (
    <main id="main-content" className="min-h-screen bg-[#f7f5f0] px-5 pb-24 pt-32 text-stone-950 md:px-10 md:pt-40 lg:px-14">
      <div className="mx-auto max-w-[1320px]">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">{t.eyebrow}</p>
        <h1 className="mt-6 text-5xl font-medium tracking-[-0.05em] md:text-7xl">{t.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">{t.lead}</p>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/${locale}/work/${product.slug}`}
              className="group relative overflow-hidden rounded-[30px] border border-stone-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-stone-400 hover:shadow-[0_24px_65px_rgba(56,47,36,0.1)]"
            >
              <div className="flex gap-5">
                <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-[22px] bg-[#e9e4da]">
                  <Image
                    src={product.assets.hero || product.assets.logo}
                    alt={`${product.name} preview`}
                    fill
                    sizes="144px"
                    className="object-contain p-[15%] transition duration-500 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-800">{product.category}</p>
                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] truncate">{product.name}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">{product.tagline}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {product.platforms.slice(0, 3).map((platform) => (
                        <span key={platform} className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${getPlatformClass(platform)}`}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-stone-100">
                    <div className="text-xs text-stone-500">
                      {product.caseStudyRole && (
                        <>
                          <span className="font-semibold text-stone-700">{t.role}: </span>
                          <span>{product.caseStudyRole}</span>
                        </>
                      )}
                      {product.caseStudyDuration && (
                        <>
                          <span className="ml-3 font-semibold text-stone-700">{t.duration}: </span>
                          <span>{product.caseStudyDuration}</span>
                        </>
                      )}
                    </div>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-stone-500 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
              <span className="sr-only">{t.open}</span>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="mt-16 text-center text-stone-500">
            <p className="text-lg">{t.empty}</p>
          </div>
        )}
      </div>
    </main>
  );
}

function getPlatformClass(platform: string) {
  const classes: Record<string, string> = {
    windows: "bg-sky-100 text-sky-800",
    macos: "bg-stone-200 text-stone-900",
    linux: "bg-amber-100 text-amber-800",
    android: "bg-emerald-100 text-emerald-800",
    web: "bg-violet-100 text-violet-800",
    ios: "bg-rose-100 text-rose-800",
  };
  return classes[platform] || "bg-stone-100 text-stone-800";
}
