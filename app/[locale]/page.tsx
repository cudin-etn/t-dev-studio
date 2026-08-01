import DashboardGrid from "@/components/DashboardGrid";
import About from "@/components/About";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import { getPublishedProducts } from "@/lib/products";
import { isLocale } from "@/lib/site";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleHomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const products = await getPublishedProducts(locale);

  return (
    <main id="main-content" className="relative flex min-h-screen w-full flex-col bg-[#f7f5f0]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[900px] bg-[radial-gradient(circle_at_82%_12%,rgba(181,193,177,0.45),transparent_34%),radial-gradient(circle_at_8%_0%,rgba(217,198,165,0.35),transparent_30%)]" />
      <div className="relative z-10 w-full">
        <DashboardGrid products={products} locale={locale} />
        <Services />
        <div id="about">
          <About />
        </div>
        <Contact />
      </div>
    </main>
  );
}
