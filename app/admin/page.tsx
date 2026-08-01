import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, Boxes, Download, Plus } from "lucide-react";
import { getAdminStats, getAllAdminProducts } from "@/lib/admin-products";
import { getAdminUser, hasSupabaseServerEnv } from "@/lib/supabase/server";

export default async function AdminPage() {
  if (!hasSupabaseServerEnv()) redirect("/admin/login?error=missing-env");
  if (!(await getAdminUser())) redirect("/admin/login");

  const products = await getAllAdminProducts();
  const stats = await getAdminStats(products);

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-8 text-stone-950 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">T-Dev Studio / Admin</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">Overview</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">A quiet control room for products, releases and download performance.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/products" className="rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-stone-950">Products</Link>
            <Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-amber-800">
              <Plus className="h-4 w-4" /> New product
            </Link>
          </div>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total downloads" value={stats.totalDownloads.toLocaleString()} icon={Download} />
          <StatCard label="All products" value={String(stats.totalProducts)} icon={Boxes} />
          <StatCard label="Published" value={String(stats.publishedProducts)} icon={BarChart3} />
          <StatCard label="Drafts" value={String(stats.draftProducts)} icon={Boxes} />
        </section>

        <section className="mt-8 overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_24px_80px_rgba(28,25,23,0.06)]">
          <div className="flex items-center justify-between border-b border-stone-200 px-5 py-5 md:px-7">
            <div>
              <h2 className="text-xl font-semibold">Product performance</h2>
              <p className="mt-1 text-sm text-stone-500">All-time download counts from tracked release assets.</p>
            </div>
            <Link href="/admin/products" className="text-sm font-semibold text-amber-800 hover:underline">Manage</Link>
          </div>
          <div className="divide-y divide-stone-100">
            {products
              .slice()
              .sort((a, b) => (b.downloadCount ?? 0) - (a.downloadCount ?? 0))
              .map((product) => (
                <Link key={product.id ?? product.slug} href={`/admin/products/${product.id ?? product.slug}`} className="flex items-center justify-between gap-4 px-5 py-5 transition hover:bg-stone-50 md:px-7">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{product.content.name}</p>
                    <p className="mt-1 truncate text-xs text-stone-500">/{product.slug} · {product.status}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold">{(product.downloadCount ?? 0).toLocaleString()} downloads</p>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Download }) {
  return (
    <div className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-[0_16px_50px_rgba(28,25,23,0.05)]">
      <Icon className="h-5 w-5 text-amber-800" />
      <p className="mt-8 text-3xl font-semibold tracking-[-0.04em]">{value}</p>
      <p className="mt-1 text-sm text-stone-500">{label}</p>
    </div>
  );
}
