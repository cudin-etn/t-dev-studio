import type { Locale } from "@/lib/site";

export type ProductStatus = "draft" | "published";
export type ProductPlatform = "windows" | "macos" | "linux" | "android" | "web" | "ios";

export type LocaleString = Record<Locale, string>;

export type ProductFeature = {
  key: string;
  label: LocaleString;
};

export type ProductChip = {
  key: string;
  label: string;
};

export type ProductAsset = {
  logo: string;
  hero?: string;
  og?: string;
};

export type ProductScreenshot = {
  url: string;
  alt: LocaleString;
};

export type ProductLinks = {
  download?: string;
  github?: string;
  docs?: string;
  website?: string;
};

export type CaseStudyHighlight = {
  title: LocaleString;
  description: LocaleString;
};

export type CaseStudyResult = {
  metric: string;
  value: string;
  locale: Locale;
};

export type CaseStudyLinks = {
  github?: string;
  playStore?: string;
  appStore?: string;
  liveDemo?: string;
  caseStudyPdf?: string;
};

export type ProductReleaseMeta = {
  version?: string;
  size?: string;
  license?: string;
  pricing?: string;
};

export type ReleaseAsset = {
  id: string;
  releaseId: string;
  platform: ProductPlatform;
  label: string;
  downloadUrl?: string;
  fileName?: string | null;
  fileSize?: string | null;
  sortOrder: number;
  isActive: boolean;
  downloadCount: number;
};

export type ProductRelease = {
  id: string;
  productId: string;
  version: string;
  status: ProductStatus;
  releaseNotes: LocaleString;
  publishedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  assets: ReleaseAsset[];
};

export type ProductSeo = {
  title?: LocaleString;
  description?: LocaleString;
  ogImage?: string;
};

export type ProductContent = {
  name: string;
  tagline: LocaleString;
  description: LocaleString;
};

export type Product = {
  id?: string;
  slug: string;
  status: ProductStatus;
  sortOrder: number;
  featured: boolean;
  category: string;
  accent: string;
  accentColor: string;
  content: ProductContent;
  platforms: ProductPlatform[];
  chips: ProductChip[];
  features: ProductFeature[];
  assets: ProductAsset;
  screenshots: ProductScreenshot[];
  links: ProductLinks;
  releaseMeta: ProductReleaseMeta;
  releases?: ProductRelease[];
  downloadCount?: number;
  seo: ProductSeo;
  publishedAt?: string | null;
  updatedAt?: string | null;
  caseStudyChallenge?: LocaleString;
  caseStudyApproach?: LocaleString;
  caseStudyHighlights?: CaseStudyHighlight[];
  caseStudyResults?: CaseStudyResult[];
  caseStudyRole?: string;
  caseStudyDuration?: string;
  caseStudyLinks?: CaseStudyLinks;
};

export type LocalizedCaseStudyHighlight = {
  title: string;
  description: string;
};

export type LocalizedProduct = Omit<Product, "content" | "features" | "seo" | "caseStudyChallenge" | "caseStudyApproach" | "caseStudyHighlights"> & {
  name: string;
  tagline: string;
  description: string;
  featureLabels: string[];
  seoTitle: string;
  seoDescription: string;
  seo: ProductSeo;
  caseStudyChallenge: string;
  caseStudyApproach: string;
  caseStudyHighlights: LocalizedCaseStudyHighlight[];
  caseStudyResults: CaseStudyResult[];
  caseStudyRole: string;
  caseStudyDuration: string;
  caseStudyLinks: CaseStudyLinks;
};

export const PLATFORM_META: Record<ProductPlatform, { label: string; className: string }> = {
  windows: { label: "Windows", className: "bg-sky-100 text-sky-800" },
  macos: { label: "macOS", className: "bg-stone-200 text-stone-900" },
  linux: { label: "Linux", className: "bg-amber-100 text-amber-800" },
  android: { label: "Android", className: "bg-emerald-100 text-emerald-800" },
  web: { label: "Web", className: "bg-violet-100 text-violet-800" },
  ios: { label: "iOS", className: "bg-rose-100 text-rose-800" },
};
