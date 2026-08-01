import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-24 text-stone-700">
      <Link href="/vi" className="text-sm font-semibold text-amber-800">Back to T-Dev Studio</Link>
      <h1 className="mt-8 text-5xl font-semibold tracking-[-0.045em] text-stone-950">Terms of Service</h1>
      <p className="mt-6 leading-7">
        Products and content from T-Dev Studio are provided as-is unless a separate agreement states otherwise. Use system tools carefully and keep backups before flashing, modifying, or transferring device data.
      </p>
      <p className="mt-4 leading-7">
        For freelance or commercial work, project scope, ownership, delivery, and support terms should be confirmed in writing before work starts.
      </p>
    </main>
  );
}
