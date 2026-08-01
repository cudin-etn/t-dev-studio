import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { getAllAdminProducts, signOutAdmin } from "@/lib/admin-products";
import { PLATFORM_META } from "@/lib/products";
import { getAdminUser, hasSupabaseServerEnv } from "@/lib/supabase/server";

type Props = {
  searchParams: Promise<{ q?: string; status?: string }>;
};

export default async function AdminProductsPage({ searchParams }: Props) {
  if (!hasSupabaseServerEnv()) redirect("/admin/login?error=missing-env");
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const { q = "", status = "all" } = await searchParams;
  const products = await getAllAdminProducts();
  const query = q.toLowerCase();
  const filtered = products.filter((product) => {
    const matchesQuery = !query || product.content.name.toLowerCase().includes(query) || product.slug.includes(query) || product.category.toLowerCase().includes(query);
    const matchesStatus = status === "all" || product.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-8 text-stone-950 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/admin" className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Dashboard</Link>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">Products</h1>
            <p className="mt-1 text-sm text-stone-600">Manage product content, assets, release links, and publish state.</p>
          </div>
          <div className="flex gap-3">
            <form action={signOutAdmin}>
              <button className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700">Sign out</button>
            </form>
            <Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-amber-800">
              <Plus className="h-4 w-4" />
              New product
            </Link>
          </div>
        </div>

        <form className="mt-8 grid gap-3 rounded-[24px] border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <span className="sr-only">Search products</span>
            <input name="q" defaultValue={q} placeholder="Search name, slug, category" className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-9 pr-3 text-sm" />
          </label>
          <select aria-label="Filter by status" name="status" defaultValue={status} className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm">
            <option value="all">All status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <button className="rounded-xl bg-stone-950 px-4 py-2 text-sm font-semibold text-white">Filter</button>
        </form>

        <div className="mt-6 overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_20px_70px_rgba(28,25,23,0.06)]">
          <div className="grid grid-cols-[1fr_90px_100px] gap-4 border-b border-stone-200 px-4 py-3 text-xs font-bold uppercase text-stone-500 md:grid-cols-[1fr_170px_110px_100px_130px]">
            <span>Product</span>
            <span className="hidden md:block">Platforms</span>
            <span>Status</span>
            <span>Downloads</span>
            <span className="hidden md:block">Updated</span>
          </div>
          {filtered.map((product) => (
            <Link key={product.id ?? product.slug} href={`/admin/products/${product.id ?? product.slug}`} className="grid grid-cols-[1fr_90px_100px] gap-4 border-b border-stone-100 px-4 py-4 transition hover:bg-stone-50 md:grid-cols-[1fr_170px_110px_100px_130px]">
              <div>
                <div className="font-semibold">{product.content.name}</div>
                <div className="mt-1 text-xs text-stone-500">/{product.slug} · {product.category}</div>
              </div>
              <div className="hidden flex-wrap gap-1 md:flex">
                {product.platforms.map((platform) => (
                  <span key={platform} className={`rounded-full px-2 py-1 text-[10px] font-bold ${PLATFORM_META[platform].className}`}>{PLATFORM_META[platform].label}</span>
                ))}
              </div>
              <span className={product.status === "published" ? "text-sm font-bold text-emerald-700" : "text-sm font-bold text-amber-700"}>{product.status}</span>
              <span className="text-sm font-semibold">{(product.downloadCount ?? 0).toLocaleString()}</span>
              <span className="hidden text-xs text-stone-500 md:block">{product.updatedAt ? new Date(product.updatedAt).toLocaleDateString("vi-VN") : "Seed"}</span>
            </Link>
          ))}
          {filtered.length === 0 && <div className="px-4 py-10 text-center text-sm text-neutral-500">No products found.</div>}
        </div>
      </div>
    </main>
  );
}
