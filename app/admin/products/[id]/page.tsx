import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getAdminProduct } from "@/lib/admin-products";
import { getAdminUser, hasSupabaseServerEnv } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function EditProductPage({ params, searchParams }: Props) {
  if (!hasSupabaseServerEnv()) redirect("/admin/login?error=missing-env");
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const { error, saved } = await searchParams;
  const product = await getAdminProduct(id);

  if (!product) notFound();

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-8 text-stone-950 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/admin/products" className="text-sm font-semibold text-amber-800">Back to products</Link>
            <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em]">Edit {product.content.name}</h1>
          </div>
          {product.status === "published" && <Link href={`/vi/products/${product.slug}`} className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700">View public page</Link>}
        </div>
        <div className="mt-6">
          <ProductForm key={`${product.id}:${product.updatedAt ?? "seed"}`} product={product} error={error ? decodeURIComponent(error) : undefined} saved={saved === "1"} />
        </div>
      </div>
    </main>
  );
}
