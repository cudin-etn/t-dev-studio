"use client";

import { Save } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { upsertProduct } from "@/lib/admin-products";
import { PLATFORM_META, SEED_PRODUCTS, type Product } from "@/lib/products";

type Props = {
  product?: Product | null;
  error?: string;
  saved?: boolean;
};

const emptyProduct = SEED_PRODUCTS[0];

export default function ProductForm({ product, error, saved }: Props) {
  const item = product ?? {
    ...emptyProduct,
    id: undefined,
    slug: "",
    status: "draft" as const,
    sortOrder: 100,
    featured: false,
    category: "Product",
    accent: "indigo",
    accentColor: "#4f46e5",
    content: {
      name: "",
      tagline: { vi: "", en: "" },
      description: { vi: "", en: "" },
    },
    platforms: [],
    chips: [],
    features: [],
    assets: { logo: "", hero: "", og: "" },
    screenshots: [],
    links: {},
    releaseMeta: {},
    seo: {},
  } satisfies Product;
  const [screenshots, setScreenshots] = useState(item.screenshots);
  const currentRelease = item.releases?.[0];
  const activeReleaseAssets = currentRelease?.assets.filter((asset) => asset.isActive) ?? [];
  const moveScreenshot = (from: number, to: number) => {
    if (to < 0 || to >= screenshots.length) return;
    setScreenshots((items) => {
      const next = [...items];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  };

  return (
    <form action={upsertProduct} className="space-y-8 rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_24px_80px_rgba(28,25,23,0.07)] md:p-8" encType="multipart/form-data">
      <input type="hidden" name="id" value={item.id ?? ""} />
      <input type="hidden" name="expected_updated_at" value={item.updatedAt ?? ""} />
      <input type="hidden" name="published_at" value={item.publishedAt ?? ""} />
      <input type="hidden" name="has_existing_release" value={currentRelease ? "1" : ""} />
      <input type="hidden" name="existing_screenshots" value={JSON.stringify(screenshots)} />

      {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
      {saved && <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">Saved.</div>}

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Name" name="name" defaultValue={item.content.name} required />
        <Field label="Slug" name="slug" defaultValue={item.slug} required />
        <Field label="Sort order" name="sort_order" type="number" defaultValue={String(item.sortOrder)} />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <label className="block text-sm font-semibold text-stone-800">
          Status
          <select name="status" defaultValue={item.status} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <Field label="Category" name="category" defaultValue={item.category} />
        <Field label="Accent" name="accent" defaultValue={item.accent} />
        <Field label="Accent color" name="accent_color" defaultValue={item.accentColor} />
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-stone-800">
        <input type="checkbox" name="featured" defaultChecked={item.featured} className="h-4 w-4 rounded border-neutral-300" />
        Featured on home
      </label>

      <Section title="Localized content">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tagline VI" name="tagline_vi" defaultValue={item.content.tagline.vi} required />
          <Field label="Tagline EN" name="tagline_en" defaultValue={item.content.tagline.en} required />
          <Textarea label="Description VI" name="description_vi" defaultValue={item.content.description.vi} required />
          <Textarea label="Description EN" name="description_en" defaultValue={item.content.description.en} required />
        </div>
      </Section>

      <Section title="Platforms and chips">
        <div className="flex flex-wrap gap-3">
          {Object.entries(PLATFORM_META).map(([platform, meta]) => (
            <label key={platform} className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-3 py-2 text-sm font-semibold">
              <input type="checkbox" name="platforms" value={platform} defaultChecked={item.platforms.includes(platform as keyof typeof PLATFORM_META)} />
              {meta.label}
            </label>
          ))}
        </div>
        <Textarea label="Chips, one per line" name="chips" defaultValue={item.chips.map((chip) => chip.label).join("\n")} />
      </Section>

      <Section title="Features">
        <div className="grid gap-4 md:grid-cols-2">
          <Textarea label="Features VI, one per line" name="features_vi" defaultValue={item.features.map((feature) => feature.label.vi).join("\n")} />
          <Textarea label="Features EN, one per line" name="features_en" defaultValue={item.features.map((feature) => feature.label.en).join("\n")} />
        </div>
      </Section>

      <Section title="Assets">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Logo URL" name="logo_url" defaultValue={item.assets.logo} required />
          <Field label="Hero URL" name="hero_url" defaultValue={item.assets.hero ?? ""} />
          <Field label="OG URL" name="og_url" defaultValue={item.assets.og ?? item.seo.ogImage ?? ""} />
          <FileField label="Upload logo" name="logo_file" />
          <FileField label="Upload hero" name="hero_file" />
          <FileField label="Upload OG" name="og_file" />
        </div>
        {screenshots.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-3">
            {screenshots.map((screenshot, index) => (
              <div key={screenshot.url} className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 p-2">
                <div className="relative aspect-video">
                  <Image src={screenshot.url} alt={screenshot.alt.vi || "Product screenshot"} fill sizes="240px" className="object-contain p-2" />
                </div>
                <button
                  type="button"
                  onClick={() => setScreenshots((items) => items.filter((item) => item.url !== screenshot.url))}
                  className="absolute right-2 top-2 rounded-full bg-stone-950 px-2.5 py-1 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100"
                >
                  Remove
                </button>
                <div className="mt-2 flex gap-2">
                  <button type="button" disabled={index === 0} onClick={() => moveScreenshot(index, index - 1)} className="rounded-full border border-stone-200 bg-white px-2 py-1 text-[10px] font-bold disabled:opacity-35">Earlier</button>
                  <button type="button" disabled={index === screenshots.length - 1} onClick={() => moveScreenshot(index, index + 1)} className="rounded-full border border-stone-200 bg-white px-2 py-1 text-[10px] font-bold disabled:opacity-35">Later</button>
                </div>
                <input
                  aria-label="Vietnamese screenshot alt text"
                  value={screenshot.alt.vi}
                  onChange={(event) => setScreenshots((items) => items.map((item) => item.url === screenshot.url ? { ...item, alt: { ...item.alt, vi: event.target.value } } : item))}
                  className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs"
                />
                <input
                  aria-label="English screenshot alt text"
                  value={screenshot.alt.en}
                  onChange={(event) => setScreenshots((items) => items.map((item) => item.url === screenshot.url ? { ...item, alt: { ...item.alt, en: event.target.value } } : item))}
                  className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs"
                />
              </div>
            ))}
          </div>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <FileField label="Upload screenshots, up to 5 files" name="screenshot_files" multiple />
          <Textarea label="Or screenshot URLs, one per line" name="screenshots" placeholder="https://..." />
        </div>
      </Section>

      <Section title="Links and release">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="GitHub URL" name="github_url" defaultValue={item.links.github ?? ""} />
          <Field label="Docs URL" name="docs_url" defaultValue={item.links.docs ?? ""} />
          <Field label="Website URL" name="website_url" defaultValue={item.links.website ?? ""} />
          <Field label="License" name="license" defaultValue={item.releaseMeta.license ?? "Free"} />
          <Field label="Pricing" name="pricing" defaultValue={item.releaseMeta.pricing ?? "Free"} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Release version" name="release_version" defaultValue={currentRelease?.version ?? item.releaseMeta.version ?? ""} />
          <label className="block text-sm font-semibold text-stone-800">
            Release status
            <select name="release_status" defaultValue={currentRelease?.status ?? item.status} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <Field
            label="Release date"
            name="release_published_at"
            type="datetime-local"
            defaultValue={toDateTimeLocal(currentRelease?.publishedAt ?? item.publishedAt)}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Textarea label="Release notes VI" name="release_notes_vi" defaultValue={currentRelease?.releaseNotes.vi ?? ""} />
          <Textarea label="Release notes EN" name="release_notes_en" defaultValue={currentRelease?.releaseNotes.en ?? ""} />
        </div>
        <Textarea
          label="Download assets, one per line: platform | label | size | HTTPS URL"
          name="release_assets"
          placeholder="windows | Windows installer | 42 MB | https://github.com/..."
          defaultValue={activeReleaseAssets.map((asset) => `${asset.platform} | ${asset.label} | ${asset.fileSize ?? ""} | ${asset.downloadUrl ?? ""}`).join("\n")}
        />
      </Section>

      <Section title="Case Study">
        <div className="grid gap-4 md:grid-cols-2">
          <Textarea label="Challenge VI" name="case_study_challenge_vi" defaultValue={item.caseStudyChallenge?.vi ?? ""} rows={4} />
          <Textarea label="Challenge EN" name="case_study_challenge_en" defaultValue={item.caseStudyChallenge?.en ?? ""} rows={4} />
          <Textarea label="Approach VI" name="case_study_approach_vi" defaultValue={item.caseStudyApproach?.vi ?? ""} rows={4} />
          <Textarea label="Approach EN" name="case_study_approach_en" defaultValue={item.caseStudyApproach?.en ?? ""} rows={4} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Role" name="case_study_role" defaultValue={item.caseStudyRole ?? ""} />
          <Field label="Duration" name="case_study_duration" defaultValue={item.caseStudyDuration ?? ""} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Textarea label="Technical Highlights VI (JSON array: [{title, description}])" name="case_study_highlights_vi" defaultValue={JSON.stringify(item.caseStudyHighlights?.map(h => ({ title: h.title.vi, description: h.description.vi })) ?? [], null, 2)} rows={4} />
          <Textarea label="Technical Highlights EN (JSON array: [{title, description}])" name="case_study_highlights_en" defaultValue={JSON.stringify(item.caseStudyHighlights?.map(h => ({ title: h.title.en, description: h.description.en })) ?? [], null, 2)} rows={4} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Textarea label="Results VI (JSON array: [{metric, value}])" name="case_study_results_vi" defaultValue={JSON.stringify(item.caseStudyResults?.filter((result) => result.locale === "vi").map(r => ({ metric: r.metric, value: r.value })) ?? [], null, 2)} rows={4} />
          <Textarea label="Results EN (JSON array: [{metric, value}])" name="case_study_results_en" defaultValue={JSON.stringify(item.caseStudyResults?.filter((result) => result.locale === "en").map(r => ({ metric: r.metric, value: r.value })) ?? [], null, 2)} rows={4} />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <Field label="GitHub URL" name="case_study_github" defaultValue={item.caseStudyLinks?.github ?? ""} />
          <Field label="Play Store URL" name="case_study_play_store" defaultValue={item.caseStudyLinks?.playStore ?? ""} />
          <Field label="App Store URL" name="case_study_app_store" defaultValue={item.caseStudyLinks?.appStore ?? ""} />
          <Field label="Live Demo URL" name="case_study_live_demo" defaultValue={item.caseStudyLinks?.liveDemo ?? ""} />
          <Field label="Case Study PDF URL" name="case_study_pdf" defaultValue={item.caseStudyLinks?.caseStudyPdf ?? ""} />
        </div>
      </Section>

      <Section title="SEO overrides">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="SEO title VI" name="seo_title_vi" defaultValue={item.seo.title?.vi ?? item.content.name} />
          <Field label="SEO title EN" name="seo_title_en" defaultValue={item.seo.title?.en ?? item.content.name} />
          <Textarea label="SEO description VI" name="seo_description_vi" defaultValue={item.seo.description?.vi ?? item.content.description.vi} />
          <Textarea label="SEO description EN" name="seo_description_en" defaultValue={item.seo.description?.en ?? item.content.description.en} />
        </div>
      </Section>

      <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2">
        <Save className="h-4 w-4" />
        Save product
      </button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 border-t border-stone-200 pt-7">
      <h2 className="text-lg font-bold text-stone-950">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, name, defaultValue, type = "text", required = false }: { label: string; name: string; defaultValue?: string; type?: string; required?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-stone-800">
      {label}
      <input name={name} type={type} defaultValue={defaultValue} required={required} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/10" />
    </label>
  );
}

function FileField({ label, name, multiple = false }: { label: string; name: string; multiple?: boolean }) {
  const [previews, setPreviews] = useState<string[]>([]);
  useEffect(() => () => previews.forEach((preview) => URL.revokeObjectURL(preview)), [previews]);

  return (
    <label className="block text-sm font-semibold text-stone-800">
      {label}
      <input
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple={multiple}
        onChange={(event) => setPreviews(Array.from(event.currentTarget.files ?? []).map((file) => URL.createObjectURL(file)))}
        className="mt-2 w-full rounded-xl border border-dashed border-stone-300 bg-stone-50 px-3 py-4 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-stone-950 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
      />
      {previews.length > 0 && (
        <span className="mt-3 grid grid-cols-3 gap-2">
          {previews.map((preview) => (
            <span key={preview} className="relative aspect-video overflow-hidden rounded-xl border border-stone-200 bg-white">
              <Image src={preview} alt="" fill unoptimized sizes="120px" className="object-contain p-1" />
            </span>
          ))}
        </span>
      )}
    </label>
  );
}

function Textarea({ label, name, defaultValue, placeholder, required = false, rows = 4 }: { label: string; name: string; defaultValue?: string; placeholder?: string; required?: boolean; rows?: number }) {
  return (
    <label className="block text-sm font-semibold text-stone-800">
      {label}
      <textarea name={name} defaultValue={defaultValue} placeholder={placeholder} required={required} rows={rows} className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/10" />
    </label>
  );
}

function toDateTimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}
