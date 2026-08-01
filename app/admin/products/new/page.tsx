import Link from "next/link";
import { redirect } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getAdminUser, hasSupabaseServerEnv } from "@/lib/supabase/server";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewProductPage({ searchParams }: Props) {
  if (!hasSupabaseServerEnv()) redirect("/admin/login?error=missing-env");
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-4 py-8 text-stone-950 md:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin/products" className="text-sm font-semibold text-amber-800">Back to products</Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em]">New product</h1>
        <div className="mt-6">
          <ProductForm error={error ? decodeURIComponent(error) : undefined} />
        </div>
      </div>
    </main>
  );
}
