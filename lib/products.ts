import { unstable_cache } from "next/cache";
import { createSupabaseReadClient } from "@/lib/supabase/public";
import { DEFAULT_LOCALE, type Locale, localized } from "@/lib/site";
import type {
  CaseStudyHighlight,
  CaseStudyLinks,
  CaseStudyResult,
  LocaleString,
  LocalizedProduct,
  Product,
  ProductAsset,
  ProductChip,
  ProductContent,
  ProductFeature,
  ProductLinks,
  ProductPlatform,
  ProductReleaseMeta,
  ProductScreenshot,
  ProductSeo,
  ProductStatus,
} from "@/lib/products/types";

export { PLATFORM_META } from "@/lib/products/types";
export type {
  CaseStudyHighlight,
  CaseStudyLinks,
  CaseStudyResult,
  LocaleString,
  LocalizedCaseStudyHighlight,
  LocalizedProduct,
  Product,
  ProductAsset,
  ProductChip,
  ProductContent,
  ProductFeature,
  ProductLinks,
  ProductPlatform,
  ProductRelease,
  ProductReleaseMeta,
  ProductScreenshot,
  ProductSeo,
  ProductStatus,
  ReleaseAsset,
} from "@/lib/products/types";

export const SEED_PRODUCTS: Product[] = [
  {
    slug: "flashflow",
    status: "published",
    sortOrder: 10,
    featured: true,
    category: "Android Tooling",
    accent: "cyan",
    accentColor: "#06b6d4",
    content: {
      name: "FlashFlow",
      tagline: {
        vi: "Công cụ Android đa năng cho người dùng nâng cao.",
        en: "An advanced all-in-one Android tool.",
      },
      description: {
        vi: "FlashFlow là công cụ đa nền tảng dành cho Android power users. Hỗ trợ Pixel, OnePlus, Xiaomi với các tác vụ unlock / lock bootloader, flash ROM stock, OTA, factory ROM, AOSP, Super.img và cài recovery tùy biến như TWRP, OrangeFox.",
        en: "FlashFlow is a cross-platform tool for Android power users. It supports Pixel, OnePlus and Xiaomi devices with bootloader unlock/lock, flashing stock ROMs, OTA, factory images, AOSP, Super.img, and custom recoveries like TWRP and OrangeFox.",
      },
    },
    platforms: ["windows", "macos", "linux"],
    chips: [
      { key: "desktop", label: "Desktop" },
      { key: "rom", label: "ROM Flashing" },
      { key: "power-user", label: "Power user" },
    ],
    features: [
      { key: "fast", label: { vi: "Nhanh và ổn định", en: "Fast and stable workflows" } },
      { key: "powerful", label: { vi: "Xử lý tác vụ Android phức tạp", en: "Advanced Android operations" } },
      { key: "safe", label: { vi: "Thiết kế theo hướng an toàn cho thiết bị", en: "Device-safe workflow design" } },
      { key: "cross-platform", label: { vi: "Hoạt động trên Windows, macOS và Linux", en: "Runs on Windows, macOS, and Linux" } },
    ],
    assets: { logo: "/products/flashflow.webp", hero: "/products/flashflow.webp", og: "/og-banner.jpg" },
    screenshots: [{ url: "/products/flashflow.webp", alt: { vi: "FlashFlow interface preview", en: "FlashFlow interface preview" } }],
    links: { download: "https://github.com/cudin-etn/t-dev-studio/releases/download/flashflow/FlashFlow_Setup.exe" },
    releaseMeta: { version: "Latest", size: "Desktop installer", license: "Free", pricing: "Free" },
    seo: {},
    publishedAt: "2026-01-01T00:00:00.000Z",
    caseStudyChallenge: {
      vi: "FlashFlow giải quyết bài toán flash ROM phức tạp cho Android power users trên Windows, macOS, Linux. Thách thức: hỗ trợ đa dạng thiết bị (Pixel, OnePlus, Xiaomi), nhiều loại partition (super.img, dynamic partitions), nhiều protocol (fastboot, EDL, OTA), đảm bảo an toàn thiết bị.",
      en: "FlashFlow solves complex ROM flashing for Android power users across Windows, macOS, Linux. Challenge: support diverse devices (Pixel, OnePlus, Xiaomi), partition types (super.img, dynamic partitions), protocols (fastboot, EDL, OTA), while ensuring device safety."
    },
    caseStudyApproach: {
      vi: "Kiến trúc cross-platform: Kotlin Multiplatform cho business logic, Rust cho low-level USB/bootloader protocol, FFmpeg cho payload processing. Chia tách core logic (shared) và platform-specific adapters. Ưu tiên type-safe communication giữa Kotlin và Rust qua JNI/FFI.",
      en: "Cross-platform architecture: Kotlin Multiplatform for business logic, Rust for low-level USB/bootloader protocols, FFmpeg for payload processing. Separate core logic (shared) from platform-specific adapters. Prioritize type-safe Kotlin↔Rust communication via JNI/FFI."
    },
    caseStudyHighlights: [
      { title: { vi: "Bootloader Protocol Implementation", en: "Bootloader Protocol Implementation" }, description: { vi: "Reverse-engineer và implement fastboot/EDL protocol cho Pixel, OnePlus, Xiaomi. Xử lý handshake, authentication, partition flashing, slot management.", en: "Reverse-engineered and implemented fastboot/EDL protocols for Pixel, OnePlus, Xiaomi. Handles handshake, authentication, partition flashing, slot management." } },
      { title: { vi: "Super.img & Dynamic Partitions", en: "Super.img & Dynamic Partitions" }, description: { vi: "Parse super.img, dynamic partition metadata, logical-to-physical mapping. Flash logical partitions đúng thứ tự, resize dynamic partitions on-the-fly.", en: "Parse super.img, dynamic partition metadata, logical-to-physical mapping. Flash logical partitions in correct order, resize dynamic partitions on-the-fly." } },
      { title: { vi: "Cross-Platform Binary Distribution", en: "Cross-Platform Binary Distribution" }, description: { vi: "Build pipeline: Rust core → cdylib → Kotlin/JNI bindings → Gradle → native libraries per platform (Windows .dll, macOS .dylib, Linux .so). Notarization cho macOS, code signing cho Windows.", en: "Build pipeline: Rust core → cdylib → Kotlin/JNI bindings → Gradle → native libraries per platform (Windows .dll, macOS .dylib, Linux .so). macOS notarization, Windows code signing." } },
      { title: { vi: "Device-Safe Workflow Design", en: "Device-Safe Workflow Design" }, description: { vi: "Validation pre-flash: kiểm tra device info, partition layout, battery level. Dry-run mode. Rollback strategy qua backup partitions. User confirmation từng bước critical.", en: "Pre-flash validation: device info, partition layout, battery level. Dry-run mode. Rollback via backup partitions. User confirmation at each critical step." } }
    ],
    caseStudyResults: [
      { metric: "Downloads", value: "15,000+", locale: "en" },
      { metric: "Devices Supported", value: "45+ (Pixel, OnePlus, Xiaomi)", locale: "en" },
      { metric: "Flash Success Rate", value: "99.2%", locale: "en" },
      { metric: "GitHub Stars", value: "320+", locale: "en" },
      { metric: "Platforms", value: "Windows, macOS, Linux", locale: "en" },
      { metric: "Lượt tải", value: "15,000+", locale: "vi" },
      { metric: "Thiết bị hỗ trợ", value: "45+ (Pixel, OnePlus, Xiaomi)", locale: "vi" },
      { metric: "Tỷ lệ flash thành công", value: "99.2%", locale: "vi" },
      { metric: "GitHub Stars", value: "320+", locale: "vi" },
      { metric: "Nền tảng", value: "Windows, macOS, Linux", locale: "vi" }
    ],
    caseStudyRole: "Solo Founder & Lead Engineer",
    caseStudyDuration: "6 months",
    caseStudyLinks: { github: "https://github.com/cudin-etn/flashflow", playStore: "", appStore: "", liveDemo: "", caseStudyPdf: "" },
  },
  {
    slug: "fboard",
    status: "published",
    sortOrder: 20,
    featured: true,
    category: "Android App",
    accent: "purple",
    accentColor: "#a855f7",
    content: {
      name: "FBoard",
      tagline: {
        vi: "Bàn phím Android tối giản, siêu nhanh.",
        en: "A minimal, ultra-fast Android keyboard.",
      },
      description: {
        vi: "FBoard là bàn phím Android với giao diện hiện đại, sạch sẽ, tập trung tuyệt đối vào tốc độ gõ. Không tích hợp các tính năng rườm rà, chỉ giữ lại những gì cần thiết cho trải nghiệm gõ mượt mà.",
        en: "FBoard is a modern Android keyboard focused on typing speed. It avoids bloated features and keeps only what matters for a smooth typing experience.",
      },
    },
    platforms: ["android"],
    chips: [
      { key: "keyboard", label: "Keyboard" },
      { key: "privacy", label: "Privacy-first" },
      { key: "native", label: "Native Android" },
    ],
    features: [
      { key: "ultra-fast", label: { vi: "Phản hồi rất nhanh", en: "Ultra-fast response" } },
      { key: "minimal", label: { vi: "Thiết kế tối giản, tập trung vào cốt lõi", en: "Minimal core-focused design" } },
      { key: "privacy", label: { vi: "Không thu thập dữ liệu", en: "No tracking or data collection" } },
    ],
    assets: { logo: "/products/fboard.webp", hero: "/products/fboard.webp", og: "/og-banner.jpg" },
    screenshots: [{ url: "/products/fboard.webp", alt: { vi: "FBoard interface preview", en: "FBoard interface preview" } }],
    links: { download: "https://github.com/cudin-etn/t-dev-studio/releases/download/Fboard/Fboard_v2.1.1.apk" },
    releaseMeta: { version: "2.1.1", size: "APK", license: "Free", pricing: "Free" },
    seo: {},
    publishedAt: "2026-01-01T00:00:00.000Z",
    caseStudyChallenge: {
      vi: "Bàn phím Android phải phản hồi ngay ở từng lần chạm, đồng thời vẫn đưa ra gợi ý và sửa chính tả đủ hữu ích để người dùng không phải dừng lại giữa câu.",
      en: "An Android keyboard has to respond instantly to every tap while still offering useful suggestions and autocorrection without interrupting the user's flow.",
    },
    caseStudyApproach: {
      vi: "Tập trung vào một input pipeline gọn, giảm công việc không cần thiết trên mỗi lần gõ và thiết kế suggestion bar để thông tin xuất hiện đúng lúc. Các lựa chọn UX ưu tiên tốc độ, khả năng đọc và cảm giác kiểm soát của người dùng.",
      en: "The approach focused on a lean input pipeline, minimizing work on every keystroke and presenting suggestions at the right moment. UX decisions prioritize speed, readability, and a sense of control.",
    },
    caseStudyHighlights: [
      { title: { vi: "Tốc độ phản hồi", en: "Fast input feedback" }, description: { vi: "Tối ưu đường đi từ thao tác chạm đến ký tự hiển thị để trải nghiệm gõ luôn liền mạch.", en: "Keep the path from touch input to rendered text short so typing feels continuous and immediate." } },
      { title: { vi: "Gợi ý và sửa chính tả", en: "Suggestions and autocorrection" }, description: { vi: "Cung cấp gợi ý hữu ích và sửa lỗi chính tả mà không biến bàn phím thành một giao diện nhiều thông tin.", en: "Provide useful suggestions and autocorrection without turning the keyboard into a noisy interface." } },
      { title: { vi: "UX tối giản", en: "Focused keyboard UX" }, description: { vi: "Giữ lại những điều cần thiết cho việc gõ nhanh, dễ đọc và dễ kiểm soát trên màn hình nhỏ.", en: "Keep only what helps people type quickly, read clearly, and stay in control on a small screen." } },
    ],
    caseStudyResults: [],
    caseStudyRole: "Solo Founder & Lead Engineer",
    caseStudyDuration: "",
    caseStudyLinks: { github: "", playStore: "", appStore: "", liveDemo: "", caseStudyPdf: "" },
  },
  {
    slug: "macos-flasher",
    status: "published",
    sortOrder: 30,
    featured: true,
    category: "macOS Tooling",
    accent: "emerald",
    accentColor: "#10b981",
    content: {
      name: "macOS Flasher",
      tagline: {
        vi: "Công cụ flash ROM tối ưu cho macOS.",
        en: "A macOS-optimized flasher for OnePlus devices.",
      },
      description: {
        vi: "macOS Flasher được thiết kế riêng cho hệ sinh thái Apple, chuyên flash các loại ROM cho OnePlus trên macOS. Hỗ trợ Full OTA, Super.img, AOSP, debloat hệ thống và unlock / lock bootloader.",
        en: "macOS Flasher is built for the Apple ecosystem, focusing on flashing ROMs for OnePlus devices on macOS. It supports Full OTA, Super.img, AOSP, debloating, and bootloader operations.",
      },
    },
    platforms: ["macos"],
    chips: [
      { key: "oneplus", label: "OnePlus" },
      { key: "native", label: "macOS" },
      { key: "flashing", label: "Flashing" },
    ],
    features: [
      { key: "oneplus", label: { vi: "Hỗ trợ chuyên sâu thiết bị OnePlus", en: "Deep OnePlus device support" } },
      { key: "mac-optimized", label: { vi: "Tối ưu cho workflow macOS", en: "Optimized for macOS workflows" } },
      { key: "safe", label: { vi: "Quy trình rõ ràng, an toàn", en: "Clear and safe operations" } },
    ],
    assets: { logo: "/products/macos-flasher.webp", hero: "/products/macos-flasher.webp", og: "/og-banner.jpg" },
    screenshots: [{ url: "/products/macos-flasher.webp", alt: { vi: "macOS Flasher interface preview", en: "macOS Flasher interface preview" } }],
    links: { download: "https://github.com/cudin-etn/t-dev-studio/releases/download/macos-flasher-v1/MacOSFlasher.dmg" },
    releaseMeta: { version: "v1", size: "DMG", license: "Free", pricing: "Free" },
    seo: {},
    publishedAt: "2026-01-01T00:00:00.000Z",
    caseStudyChallenge: { vi: "Đang cập nhật...", en: "Coming soon..." },
    caseStudyApproach: { vi: "Đang cập nhật...", en: "Coming soon..." },
    caseStudyHighlights: [],
    caseStudyResults: [],
    caseStudyRole: "Solo Founder & Lead Engineer",
    caseStudyDuration: "",
    caseStudyLinks: { github: "", playStore: "", appStore: "", liveDemo: "", caseStudyPdf: "" },
  },
  {
    slug: "ddrop",
    status: "published",
    sortOrder: 40,
    featured: false,
    category: "File Transfer",
    accent: "indigo",
    accentColor: "#6366f1",
    content: {
      name: "Ddrop",
      tagline: {
        vi: "Truyền file tốc độ cao giữa Android và macOS.",
        en: "High-speed file transfer between Android and macOS.",
      },
      description: {
        vi: "Ddrop là giải pháp truyền file giữa Android và macOS với trải nghiệm tương tự AirDrop. Giao diện trực quan, kết nối nhanh và tốc độ gửi nhận file cao.",
        en: "Ddrop is an AirDrop-like file transfer solution for Android and macOS with clean discovery, fast pairing, and high transfer speeds.",
      },
    },
    platforms: ["android", "macos"],
    chips: [
      { key: "transfer", label: "File transfer" },
      { key: "wireless", label: "Wireless" },
      { key: "coming-soon", label: "Coming soon" },
    ],
    features: [
      { key: "fast", label: { vi: "Gửi nhận nhanh và ổn định", en: "Fast and stable transfer" } },
      { key: "wireless", label: { vi: "Kết nối không dây nhanh", en: "Fast wireless discovery" } },
      { key: "simple", label: { vi: "Đơn giản, dễ dùng", en: "Simple and focused UX" } },
    ],
    assets: { logo: "/og.webp", hero: "/og.webp", og: "/og-banner.jpg" },
    screenshots: [{ url: "/og.webp", alt: { vi: "Ddrop interface preview", en: "Ddrop interface preview" } }],
    links: {},
    releaseMeta: { version: "Preview", size: "Coming soon", license: "Free", pricing: "Free" },
    seo: {},
    publishedAt: "2026-01-01T00:00:00.000Z",
    caseStudyChallenge: { vi: "Đang cập nhật...", en: "Coming soon..." },
    caseStudyApproach: { vi: "Đang cập nhật...", en: "Coming soon..." },
    caseStudyHighlights: [],
    caseStudyResults: [],
    caseStudyRole: "Solo Founder & Lead Engineer",
    caseStudyDuration: "",
    caseStudyLinks: { github: "", playStore: "", appStore: "", liveDemo: "", caseStudyPdf: "" },
  },
];

type ProductRow = {
  id: string;
  slug: string;
  status: ProductStatus;
  sort_order: number;
  featured: boolean;
  category: string;
  accent: string;
  accent_color: string;
  localized_content: ProductContent;
  platforms: ProductPlatform[];
  chips: ProductChip[];
  features: ProductFeature[];
  assets: ProductAsset;
  screenshots: ProductScreenshot[];
  links: ProductLinks;
  release_meta: ProductReleaseMeta;
  seo: ProductSeo;
  published_at: string | null;
  updated_at: string | null;
  case_study_challenge?: LocaleString;
  case_study_approach?: LocaleString;
  case_study_highlights?: CaseStudyHighlight[];
  case_study_results?: CaseStudyResult[];
  case_study_role?: string;
  case_study_duration?: string;
  case_study_links?: CaseStudyLinks;
  product_releases?: ProductReleaseRow[];
};

export type ProductRowType = ProductRow;

type ReleaseAssetRow = {
  id: string;
  release_id: string;
  platform: ProductPlatform;
  label: string;
  download_url?: string;
  file_name: string | null;
  file_size: string | null;
  sort_order: number;
  is_active: boolean;
  download_count: number;
};

type ProductReleaseRow = {
  id: string;
  product_id: string;
  version: string;
  status: ProductStatus;
  release_notes: LocaleString;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  release_assets?: ReleaseAssetRow[];
};

export function toLocalizedProduct(product: Product, locale: Locale = DEFAULT_LOCALE): LocalizedProduct {
  const seoTitle = localized(product.seo.title ?? { vi: product.content.name, en: product.content.name }, locale);
  const seoDescription = localized(product.seo.description ?? product.content.description, locale);

  return {
    ...product,
    name: product.content.name,
    tagline: localized(product.content.tagline, locale),
    description: localized(product.content.description, locale),
    featureLabels: product.features.map((feature) => localized(feature.label, locale)),
    seoTitle,
    seoDescription,
    seo: product.seo,
    caseStudyChallenge: localized(product.caseStudyChallenge ?? { vi: "", en: "" }, locale),
    caseStudyApproach: localized(product.caseStudyApproach ?? { vi: "", en: "" }, locale),
    caseStudyHighlights: (product.caseStudyHighlights ?? []).map((highlight) => ({
      title: localized(highlight.title, locale),
      description: localized(highlight.description, locale),
    })),
    caseStudyResults: (product.caseStudyResults ?? []).filter((r) => r.locale === locale),
    caseStudyRole: product.caseStudyRole ?? "",
    caseStudyDuration: product.caseStudyDuration ?? "",
    caseStudyLinks: product.caseStudyLinks ?? { github: "", playStore: "", appStore: "", liveDemo: "", caseStudyPdf: "" },
  };
}

export function normalizeProductRow(row: ProductRow): Product {
  const releases = (row.product_releases ?? [])
    .map((release) => ({
      id: release.id,
      productId: release.product_id,
      version: release.version,
      status: release.status,
      releaseNotes: release.release_notes ?? { vi: "", en: "" },
      publishedAt: release.published_at,
      createdAt: release.created_at,
      updatedAt: release.updated_at,
      assets: (release.release_assets ?? [])
        .map((asset) => ({
          id: asset.id,
          releaseId: asset.release_id,
          platform: asset.platform,
          label: asset.label,
          downloadUrl: asset.download_url,
          fileName: asset.file_name,
          fileSize: asset.file_size,
          sortOrder: asset.sort_order,
          isActive: asset.is_active ?? true,
          downloadCount: Number(asset.download_count ?? 0),
        }))
        .sort((a, b) => a.sortOrder - b.sortOrder),
    }))
    .sort((a, b) => {
      const left = Date.parse(a.publishedAt ?? a.updatedAt ?? a.createdAt ?? "") || 0;
      const right = Date.parse(b.publishedAt ?? b.updatedAt ?? b.createdAt ?? "") || 0;
      return right - left;
    });

  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    sortOrder: row.sort_order,
    featured: row.featured,
    category: row.category,
    accent: row.accent,
    accentColor: row.accent_color,
    content: row.localized_content,
    platforms: row.platforms ?? [],
    chips: row.chips ?? [],
    features: row.features ?? [],
    assets: row.assets,
    screenshots: row.screenshots ?? [],
    links: row.links ?? {},
    releaseMeta: {
      ...(row.release_meta ?? {}),
      version: releases[0]?.version ?? row.release_meta?.version,
      size: releases[0]?.assets.find((asset) => asset.isActive)?.fileSize ?? row.release_meta?.size,
    },
    releases,
    downloadCount: releases.reduce(
      (total, release) => total + release.assets.reduce((sum, asset) => sum + asset.downloadCount, 0),
      0,
    ),
    seo: row.seo ?? {},
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    caseStudyChallenge: row.case_study_challenge ?? { vi: "", en: "" },
    caseStudyApproach: row.case_study_approach ?? { vi: "", en: "" },
    caseStudyHighlights: row.case_study_highlights ?? [],
    caseStudyResults: row.case_study_results ?? [],
    caseStudyRole: row.case_study_role ?? "",
    caseStudyDuration: row.case_study_duration ?? "",
    caseStudyLinks: row.case_study_links ?? { github: "", playStore: "", appStore: "", liveDemo: "", caseStudyPdf: "" },
  };
}

export function productToRow(product: Product) {
  return {
    id: product.id,
    slug: product.slug,
    status: product.status,
    sort_order: product.sortOrder,
    featured: product.featured,
    category: product.category,
    accent: product.accent,
    accent_color: product.accentColor,
    localized_content: product.content,
    platforms: product.platforms,
    chips: product.chips,
    features: product.features,
    assets: product.assets,
    screenshots: product.screenshots,
    links: product.links,
    release_meta: product.releaseMeta,
    seo: product.seo,
    published_at: product.status === "published" ? product.publishedAt ?? new Date().toISOString() : null,
    case_study_challenge: product.caseStudyChallenge ?? { vi: "", en: "" },
    case_study_approach: product.caseStudyApproach ?? { vi: "", en: "" },
    case_study_highlights: product.caseStudyHighlights ?? [],
    case_study_results: product.caseStudyResults ?? [],
    case_study_role: product.caseStudyRole ?? "",
    case_study_duration: product.caseStudyDuration ?? "",
    case_study_links: product.caseStudyLinks ?? { github: "", playStore: "", appStore: "", liveDemo: "", caseStudyPdf: "" },
  };
}

async function queryPublishedProducts(locale: Locale): Promise<LocalizedProduct[]> {
  const supabase = createSupabaseReadClient();

  if (supabase) {
    const { data, error } = await supabase.rpc("get_published_products", {
      requested_slug: null,
    });

    if (error) throw new Error(`Could not load published products: ${error.message}`);
    const rows = Array.isArray(data) ? data : [];
    return rows.map((row) => toLocalizedProduct(normalizeProductRow(row as ProductRow), locale));
  }

  return SEED_PRODUCTS.filter((product) => product.status === "published")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((product) => toLocalizedProduct(product, locale));
}

async function queryProductBySlug(slug: string, locale: Locale): Promise<LocalizedProduct | null> {
  const supabase = createSupabaseReadClient();

  if (supabase) {
    const { data, error } = await supabase.rpc("get_published_products", {
      requested_slug: slug,
    });

    if (error) throw new Error(`Could not load product: ${error.message}`);
    const row = Array.isArray(data) ? data[0] : null;
    return row ? toLocalizedProduct(normalizeProductRow(row as ProductRow), locale) : null;
  }

  const product = SEED_PRODUCTS.find((item) => item.slug === slug && item.status === "published");
  return product ? toLocalizedProduct(product, locale) : null;
}

const getPublishedProductsCached = unstable_cache(
  queryPublishedProducts,
  ["published-products-v2"],
  { tags: ["products"], revalidate: 300 },
);

const getProductBySlugCached = unstable_cache(
  queryProductBySlug,
  ["published-product-v2"],
  { tags: ["products"], revalidate: 300 },
);

export function getPublishedProducts(locale: Locale = DEFAULT_LOCALE) {
  return getPublishedProductsCached(locale);
}

export function getProductBySlug(slug: string, locale: Locale = DEFAULT_LOCALE) {
  return getProductBySlugCached(slug, locale);
}
