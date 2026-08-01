"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, getAdminUser } from "@/lib/supabase/server";
import {
  type LocaleString,
  type Product,
  type ProductChip,
  type ProductFeature,
  type ProductPlatform,
  type ProductScreenshot,
  type CaseStudyResult,
  type CaseStudyHighlight,
  type ProductRowType,
  normalizeProductRow,
  SEED_PRODUCTS,
  productToRow,
} from "@/lib/products";

const PLATFORM_VALUES: ProductPlatform[] = ["windows", "macos", "linux", "android", "web", "ios"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(formData: FormData, key: string, fallback = 0) {
  const value = Number(readString(formData, key));
  return Number.isFinite(value) ? value : fallback;
}

function readLocaleString(formData: FormData, key: string): LocaleString {
  return {
    vi: readString(formData, `${key}_vi`),
    en: readString(formData, `${key}_en`),
  };
}

function parseJsonArray<T>(raw: string, fallback: T[] = []) {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function validateJsonArrayField(formData: FormData, key: string, label: string) {
  const raw = readString(formData, key);
  if (!raw) return "";
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? "" : `${label} must be a JSON array.`;
  } catch {
    return `${label} contains invalid JSON.`;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validateStructuredJsonArray(
  formData: FormData,
  key: string,
  label: string,
  validateItem: (item: unknown) => boolean,
) {
  const syntaxError = validateJsonArrayField(formData, key, label);
  if (syntaxError) return syntaxError;

  const raw = readString(formData, key);
  if (!raw) return "";
  const items: unknown[] = JSON.parse(raw);
  return items.every(validateItem) ? "" : `${label} contains an invalid item.`;
}

function validateCaseStudyHighlights(formData: FormData, key: string, label: string) {
  return validateStructuredJsonArray(formData, key, label, (item) => (
    isRecord(item) && typeof item.title === "string" && typeof item.description === "string"
  ));
}

function validateCaseStudyResults(formData: FormData, key: string, label: string) {
  return validateStructuredJsonArray(formData, key, label, (item) => (
    isRecord(item) && typeof item.metric === "string" && typeof item.value === "string"
  ));
}

function validateExistingScreenshots(formData: FormData) {
  return validateStructuredJsonArray(formData, "existing_screenshots", "Existing screenshots", (item) => {
    if (!isRecord(item) || typeof item.url !== "string" || !isSafeAssetUrl(item.url)) return false;
    return isRecord(item.alt) && typeof item.alt.vi === "string" && typeof item.alt.en === "string";
  });
}

function readCaseStudyHighlights(formData: FormData): CaseStudyHighlight[] {
  type HighlightInput = { title: string; description: string };
  const vi = parseJsonArray<HighlightInput>(readString(formData, "case_study_highlights_vi"), []);
  const en = parseJsonArray<HighlightInput>(readString(formData, "case_study_highlights_en"), []);
  const max = Math.max(vi.length, en.length);

  return Array.from({ length: max }, (_, index) => ({
    title: {
      vi: vi[index]?.title ?? en[index]?.title ?? "",
      en: en[index]?.title ?? vi[index]?.title ?? "",
    },
    description: {
      vi: vi[index]?.description ?? en[index]?.description ?? "",
      en: en[index]?.description ?? vi[index]?.description ?? "",
    },
  })).filter((highlight) => highlight.title.vi || highlight.title.en || highlight.description.vi || highlight.description.en);
}

function readCaseStudyResults(formData: FormData): CaseStudyResult[] {
  type ResultInput = { metric: string; value: string };
  const vi = parseJsonArray<ResultInput>(readString(formData, "case_study_results_vi"), []);
  const en = parseJsonArray<ResultInput>(readString(formData, "case_study_results_en"), []);

  const results: CaseStudyResult[] = [];
  vi.forEach((item) => results.push({ metric: item.metric, value: item.value, locale: "vi" }));
  en.forEach((item) => results.push({ metric: item.metric, value: item.value, locale: "en" }));
  return results;
}

function readCaseStudyLinks(formData: FormData) {
  return {
    github: readString(formData, "case_study_github") || undefined,
    playStore: readString(formData, "case_study_play_store") || undefined,
    appStore: readString(formData, "case_study_app_store") || undefined,
    liveDemo: readString(formData, "case_study_live_demo") || undefined,
    caseStudyPdf: readString(formData, "case_study_pdf") || undefined,
  };
}

function buildCaseStudyHighlights(formData: FormData): Array<{ title: LocaleString; description: LocaleString }> {
  return readCaseStudyHighlights(formData);
}

function buildCaseStudyResults(formData: FormData): CaseStudyResult[] {
  return readCaseStudyResults(formData);
}

function buildCaseStudyLinks(formData: FormData) {
  return readCaseStudyLinks(formData);
}

function parseLines(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function buildFeatures(formData: FormData): ProductFeature[] {
  const vi = parseLines(readString(formData, "features_vi"));
  const en = parseLines(readString(formData, "features_en"));
  const max = Math.max(vi.length, en.length);

  return Array.from({ length: max }, (_, index) => ({
    key: `feature-${index + 1}`,
    label: {
      vi: vi[index] ?? en[index] ?? "",
      en: en[index] ?? vi[index] ?? "",
    },
  })).filter((feature) => feature.label.vi || feature.label.en);
}

function buildChips(formData: FormData): ProductChip[] {
  return parseLines(readString(formData, "chips")).map((label, index) => ({
    key: label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `chip-${index + 1}`,
    label,
  }));
}

function buildScreenshots(formData: FormData): ProductScreenshot[] {
  return parseLines(readString(formData, "screenshots")).map((url, index) => ({
    url,
    alt: {
      vi: `${readString(formData, "name") || "Product"} screenshot ${index + 1}`,
      en: `${readString(formData, "name") || "Product"} screenshot ${index + 1}`,
    },
  }));
}

function buildReleaseAssets(formData: FormData) {
  return parseLines(readString(formData, "release_assets")).map((line, index) => {
    const [platform, label, fileSize, downloadUrl] = line.split("|").map((value) => value.trim());
    return {
      platform: platform as ProductPlatform,
      label,
      file_size: fileSize || null,
      download_url: downloadUrl,
      sort_order: (index + 1) * 10,
    };
  });
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isSafeAssetUrl(value: string) {
  if (value.startsWith("/")) return true;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl || !isHttpsUrl(value)) return false;
  try {
    return new URL(value).hostname === new URL(supabaseUrl).hostname;
  } catch {
    return false;
  }
}

function validateProduct(product: Product, hasReleaseAsset: boolean) {
  const errors: string[] = [];
  if (!product.slug) errors.push("Slug is required.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug)) errors.push("Slug must use lowercase letters, numbers, and hyphens.");
  if (!product.content.name) errors.push("Product name is required.");
  if (!product.content.tagline.vi || !product.content.tagline.en) errors.push("Both VI and EN taglines are required.");
  if (!product.content.description.vi || !product.content.description.en) errors.push("Both VI and EN descriptions are required.");
  if (product.platforms.length === 0) errors.push("Select at least one platform.");
  if (!product.assets.logo) errors.push("Logo/image URL is required.");
  if (product.status === "published" && !hasReleaseAsset && !product.links.github && !product.links.docs && !product.links.website) {
    errors.push("Published products need at least one action link.");
  }
  for (const url of [product.links.download, product.links.github, product.links.docs, product.links.website]) {
    if (url && !isHttpsUrl(url)) errors.push("External links must use HTTPS.");
  }

  return errors;
}

async function uploadAsset(formData: FormData, field: string, slug: string) {
  const file = formData.get(field);
  if (!(file instanceof File) || file.size === 0) return "";
  if (!IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_BYTES) {
    throw new Error("Images must be JPG, PNG, WebP, or AVIF files up to 5 MB.");
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const extension = file.type.split("/")[1].replace("jpeg", "jpg");
  const path = `${slug}/${field}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("product-assets").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("product-assets").getPublicUrl(path);
  return data.publicUrl;
}

async function uploadScreenshots(formData: FormData, slug: string, name: string) {
  const files = formData.getAll("screenshot_files").filter((value): value is File => value instanceof File && value.size > 0);
  if (files.length > 5) throw new Error("Upload at most 5 screenshots per save.");
  if (files.length === 0) return [];
  const screenshots: ProductScreenshot[] = [];
  const uploadedPaths: string[] = [];
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  try {
    for (const [index, file] of files.entries()) {
      if (!IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_BYTES) {
        throw new Error("Screenshots must be JPG, PNG, WebP, or AVIF files up to 5 MB.");
      }

      const extension = file.type.split("/")[1].replace("jpeg", "jpg");
      const path = `${slug}/screenshots/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage.from("product-assets").upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) throw new Error(error.message);
      uploadedPaths.push(path);

      const { data } = supabase.storage.from("product-assets").getPublicUrl(path);
      screenshots.push({
        url: data.publicUrl,
        alt: {
          vi: `${name || "Product"} screenshot ${index + 1}`,
          en: `${name || "Product"} screenshot ${index + 1}`,
        },
      });
    }
  } catch (error) {
    if (uploadedPaths.length > 0) await supabase.storage.from("product-assets").remove(uploadedPaths);
    throw error;
  }

  return screenshots;
}

async function removeManagedAssets(urls: string[]) {
  if (urls.length === 0) return;
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;
  const paths = urls.map(getManagedAssetPath).filter((path): path is string => Boolean(path));
  if (paths.length > 0) await supabase.storage.from("product-assets").remove(paths);
}

function getManagedAssetPath(value: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return "";

  try {
    const url = new URL(value);
    const storageOrigin = new URL(supabaseUrl).origin;
    const marker = "/storage/v1/object/public/product-assets/";
    if (url.origin !== storageOrigin || !url.pathname.startsWith(marker)) return "";

    const path = decodeURIComponent(url.pathname.slice(marker.length));
    if (!path || path.includes("..") || path.includes("\\")) return "";
    return path;
  } catch {
    return "";
  }
}

export async function signInAdmin(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?error=missing-env");

  const email = readString(formData, "email");
  const password = readString(formData, "password");
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=not-authorized");
  }
  redirect("/admin/products");
}

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function upsertProduct(formData: FormData) {
  const user = await getAdminUser();
  const supabase = await createSupabaseServerClient();

  if (!user || !supabase) redirect("/admin/login");

  const id = readString(formData, "id") || undefined;
  const expectedUpdatedAt = readString(formData, "expected_updated_at") || undefined;
  const slug = readString(formData, "slug");
  if (!SLUG_PATTERN.test(slug)) {
    redirect(`/admin/products/${id ?? "new"}?error=${encodeURIComponent("Slug must use lowercase letters, numbers, and hyphens.")}`);
  }
  if (id && !UUID_PATTERN.test(id)) {
    redirect(`/admin/products?error=${encodeURIComponent("Invalid product identifier.")}`);
  }

  const previousProduct = id ? await getAdminProduct(id) : null;
  if (id && !previousProduct) {
    redirect(`/admin/products?error=${encodeURIComponent("Product no longer exists.")}`);
  }
  if (id && (!expectedUpdatedAt || previousProduct?.updatedAt !== expectedUpdatedAt)) {
    redirect(`/admin/products/${id}?error=${encodeURIComponent("This product changed after the form was opened. Reload the page and apply your changes again.")}`);
  }

  const releaseAssets = buildReleaseAssets(formData);
  const releaseUrls = new Set<string>();
  const releaseErrors = releaseAssets.flatMap((asset, index) => {
    const errors: string[] = [];
    if (!PLATFORM_VALUES.includes(asset.platform)) errors.push(`Release asset ${index + 1} has an invalid platform.`);
    if (!asset.label) errors.push(`Release asset ${index + 1} needs a label.`);
    if (!isHttpsUrl(asset.download_url)) errors.push(`Release asset ${index + 1} needs a valid HTTPS URL.`);
    if (releaseUrls.has(asset.download_url)) errors.push(`Release asset ${index + 1} duplicates another URL.`);
    releaseUrls.add(asset.download_url);
    return errors;
  });
  if (releaseErrors.length > 0) {
    redirect(`/admin/products/${id ?? "new"}?error=${encodeURIComponent(releaseErrors.join(" "))}`);
  }

  const platforms = PLATFORM_VALUES.filter((platform) => formData.getAll("platforms").includes(platform));
  const contentErrors = [
    !readString(formData, "name") && "Product name is required.",
    !readString(formData, "tagline_vi") && "Vietnamese tagline is required.",
    !readString(formData, "tagline_en") && "English tagline is required.",
    !readString(formData, "description_vi") && "Vietnamese description is required.",
    !readString(formData, "description_en") && "English description is required.",
    platforms.length === 0 && "Select at least one platform.",
    ...["github_url", "docs_url", "website_url"].map((key) => {
      const url = readString(formData, key);
      return url && !isHttpsUrl(url) ? `${key.replace("_", " ")} must use HTTPS.` : "";
    }),
    ...["logo_url", "hero_url", "og_url"].map((key) => {
      const url = readString(formData, key);
      return url && !isSafeAssetUrl(url) ? `${key.replace("_", " ")} must be a local path or managed Supabase URL.` : "";
    }),
    ...parseLines(readString(formData, "screenshots")).map((url) => (
      !isSafeAssetUrl(url) ? "Screenshot URLs must be local paths or managed Supabase URLs." : ""
    )),
    validateCaseStudyHighlights(formData, "case_study_highlights_vi", "Technical Highlights VI"),
    validateCaseStudyHighlights(formData, "case_study_highlights_en", "Technical Highlights EN"),
    validateCaseStudyResults(formData, "case_study_results_vi", "Results VI"),
    validateCaseStudyResults(formData, "case_study_results_en", "Results EN"),
    validateExistingScreenshots(formData),
  ].filter((error): error is string => Boolean(error));
  if (contentErrors.length > 0) {
    redirect(`/admin/products/${id ?? "new"}?error=${encodeURIComponent(contentErrors.join(" "))}`);
  }

  let logoUpload = "";
  let heroUpload = "";
  let ogUpload = "";
  let screenshotUploads: ProductScreenshot[] = [];
  try {
    logoUpload = await uploadAsset(formData, "logo_file", slug);
    heroUpload = await uploadAsset(formData, "hero_file", slug);
    ogUpload = await uploadAsset(formData, "og_file", slug);
    screenshotUploads = await uploadScreenshots(formData, slug, readString(formData, "name"));
  } catch (error) {
    await removeManagedAssets([logoUpload, heroUpload, ogUpload].filter(Boolean));
    redirect(`/admin/products/${id ?? "new"}?error=${encodeURIComponent(error instanceof Error ? error.message : "Upload failed.")}`);
  }
  const newUploadedUrls = [
    logoUpload,
    heroUpload,
    ogUpload,
    ...screenshotUploads.map((screenshot) => screenshot.url),
  ].filter(Boolean);

  const existingScreenshots = parseJsonArray<ProductScreenshot>(readString(formData, "existing_screenshots"));

  const product: Product = {
    id,
    slug,
    status: readString(formData, "status") === "published" ? "published" : "draft",
    sortOrder: readNumber(formData, "sort_order", 100),
    featured: readString(formData, "featured") === "on",
    category: readString(formData, "category") || "Product",
    accent: readString(formData, "accent") || "indigo",
    accentColor: readString(formData, "accent_color") || "#4f46e5",
    content: {
      name: readString(formData, "name"),
      tagline: readLocaleString(formData, "tagline"),
      description: readLocaleString(formData, "description"),
    },
    platforms,
    chips: buildChips(formData),
    features: buildFeatures(formData),
    assets: {
      logo: logoUpload || readString(formData, "logo_url"),
      hero: heroUpload || readString(formData, "hero_url") || logoUpload || readString(formData, "logo_url"),
      og: ogUpload || readString(formData, "og_url") || "/og.png",
    },
    screenshots: [...existingScreenshots, ...buildScreenshots(formData), ...screenshotUploads],
    links: {
      download: readString(formData, "download_url") || undefined,
      github: readString(formData, "github_url") || undefined,
      docs: readString(formData, "docs_url") || undefined,
      website: readString(formData, "website_url") || undefined,
    },
    releaseMeta: {
      version: readString(formData, "release_version") || undefined,
      size: releaseAssets[0]?.file_size || undefined,
      license: readString(formData, "license") || undefined,
      pricing: readString(formData, "pricing") || undefined,
    },
    seo: {
      title: readLocaleString(formData, "seo_title"),
      description: readLocaleString(formData, "seo_description"),
      ogImage: ogUpload || readString(formData, "og_url") || undefined,
    },
    publishedAt: readString(formData, "published_at") || null,
    caseStudyChallenge: readLocaleString(formData, "case_study_challenge"),
    caseStudyApproach: readLocaleString(formData, "case_study_approach"),
    caseStudyHighlights: buildCaseStudyHighlights(formData),
    caseStudyResults: buildCaseStudyResults(formData),
    caseStudyRole: readString(formData, "case_study_role") || undefined,
    caseStudyDuration: readString(formData, "case_study_duration") || undefined,
    caseStudyLinks: buildCaseStudyLinks(formData),
  };

  const hasReleaseAsset = releaseAssets.length > 0;
  const errors = validateProduct(product, hasReleaseAsset);
  if (errors.length > 0) {
    await removeManagedAssets(newUploadedUrls);
    redirect(`/admin/products/${id ?? "new"}?error=${encodeURIComponent(errors.join(" "))}`);
  }

  const payload = productToRow(product);
  const releaseVersion = readString(formData, "release_version");
  const releaseStatus = readString(formData, "release_status") === "published" ? "published" : "draft";
  const hasExistingRelease = readString(formData, "has_existing_release") === "1";
  const { data, error } = await supabase.rpc("save_admin_product", {
    input_product_id: id ?? null,
    input_expected_updated_at: expectedUpdatedAt ?? null,
    input_product: payload,
    input_release: releaseVersion
      ? {
          operation: "upsert",
          version: releaseVersion,
          status: releaseStatus,
          notes: readLocaleString(formData, "release_notes"),
          published_at: releaseStatus === "published"
            ? readString(formData, "release_published_at") || new Date().toISOString()
            : null,
          assets: releaseAssets,
        }
      : hasExistingRelease
        ? { operation: "deactivate" }
        : null,
  });

  if (error) {
    await removeManagedAssets(newUploadedUrls);
    const message = error.message.includes("STALE_WRITE")
      ? "This product was saved in another tab. Reload the page and apply your changes again."
      : error.message;
    redirect(`/admin/products/${id ?? "new"}?error=${encodeURIComponent(message)}`);
  }

  let savedId = data && typeof data === "object" && "id" in data && typeof data.id === "string"
    ? data.id
    : id;
  if (!savedId) {
    const recoveredProduct = await getAdminProduct(slug);
    savedId = recoveredProduct?.id;
  }
  if (!savedId) {
    // The RPC committed successfully, so uploaded URLs may now be referenced.
    // Keep them and avoid turning a response-shape problem into data loss.
    redirect("/admin/products");
  }

  // Replaced assets are intentionally retained. Immediate deletion has a race
  // with other admin tabs and shared object URLs; a delayed GC can remove true
  // orphans safely after a grace period.

  revalidatePath("/vi");
  revalidatePath("/en");
  revalidatePath("/vi/work");
  revalidatePath("/en/work");
  revalidatePath(`/vi/products/${product.slug}`);
  revalidatePath(`/en/products/${product.slug}`);
  revalidatePath(`/vi/work/${product.slug}`);
  revalidatePath(`/en/work/${product.slug}`);
  revalidatePath("/sitemap.xml");
  revalidateTag("products", "max");
  revalidateTag("work", "max");
  revalidateTag(`product:${product.slug}`, "max");
  if (previousProduct?.slug && previousProduct.slug !== product.slug) {
    revalidateTag(`product:${previousProduct.slug}`, "max");
  }

  redirect(`/admin/products/${savedId}?saved=1`);
}

const ADMIN_PRODUCT_SELECT = "*, product_releases(*, release_assets(*))";

export async function getAllAdminProducts() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return SEED_PRODUCTS;

  const { data, error } = await supabase
    .from("products")
    .select(ADMIN_PRODUCT_SELECT)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => normalizeProductRow(row as ProductRowType));
}

export async function getAdminProduct(identifier: string) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return SEED_PRODUCTS.find((product) => product.slug === identifier || product.id === identifier) ?? null;
  }

  const query = supabase.from("products").select(ADMIN_PRODUCT_SELECT);
  const { data, error } = UUID_PATTERN.test(identifier)
    ? await query.eq("id", identifier).maybeSingle()
    : SLUG_PATTERN.test(identifier)
      ? await query.eq("slug", identifier).maybeSingle()
      : { data: null, error: null };

  return !error && data ? normalizeProductRow(data as ProductRowType) : null;
}

export async function getAdminStats(products?: Product[]) {
  const items = products ?? await getAllAdminProducts();
  return {
    totalProducts: items.length,
    publishedProducts: items.filter((product) => product.status === "published").length,
    draftProducts: items.filter((product) => product.status === "draft").length,
    totalDownloads: items.reduce((sum, product) => sum + (product.downloadCount ?? 0), 0),
    latestUpdate: items
      .map((product) => product.updatedAt ?? product.publishedAt)
      .filter(Boolean)
      .sort()
      .at(-1) ?? null,
  };
}
