import { signInAdmin } from "@/lib/admin-products";
import { getAdminUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  if (await getAdminUser()) redirect("/admin");
  const { error } = await searchParams;
  const message = error === "not-authorized"
    ? "This account is not allowlisted as an administrator."
    : error === "missing-env"
      ? "Supabase environment variables are missing."
      : error ? decodeURIComponent(error) : "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-4 text-stone-950">
      <form action={signInAdmin} className="w-full max-w-sm rounded-[28px] border border-stone-200 bg-white p-7 shadow-[0_24px_80px_rgba(28,25,23,0.08)]">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">T-Dev Studio</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Admin sign in</h1>
        <p className="mt-2 text-sm text-stone-600">Use the single allowlisted Supabase owner account.</p>

        {message && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{message}</div>}

        <label className="mt-6 block text-sm font-semibold text-stone-800">
          Email
          <input name="email" type="email" autoComplete="email" required className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm" />
        </label>
        <label className="mt-4 block text-sm font-semibold text-stone-800">
          Password
          <input name="password" type="password" autoComplete="current-password" required className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm" />
        </label>
        <button type="submit" className="mt-6 w-full rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-amber-800">
          Sign in
        </button>
      </form>
    </main>
  );
}
