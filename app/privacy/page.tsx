import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-24 text-stone-700">
      <Link href="/vi" className="text-sm font-semibold text-amber-800">Back to T-Dev Studio</Link>
      <h1 className="mt-8 text-5xl font-semibold tracking-[-0.045em] text-stone-950">Privacy Policy</h1>
      <p className="mt-6 leading-7">
        T-Dev Studio keeps this website minimal. The public site does not require an account and does not intentionally collect personal data beyond standard hosting logs and information you send directly through contact links.
      </p>
      <p className="mt-4 leading-7">
        Product downloads may link to third-party platforms such as GitHub, PayPal, or Buy Me a Coffee. Those services are governed by their own privacy policies.
      </p>
    </main>
  );
}
