export type LocaleString = {
  vi: string;
  en: string;
};

export type Feature = {
  key: string;
  label: LocaleString;
};

export type Product = {
  key: string;
  slug: string;
  name: string;
  tagline: LocaleString;
  description: LocaleString;
  features: Feature[];
  accent: "blue" | "purple" | "green" | "indigo";
  accentColor: string;
  image: string;
  platforms: readonly string[];
  download: string;
};

export const PRODUCTS: Record<string, Product> = {
  flashflow: {
    key: "flashflow",
    slug: "flashflow",
    name: "FlashFlow",
    tagline: {
      vi: "Công cụ Android đa năng cho người dùng nâng cao.",
      en: "An advanced all-in-one Android tool."
    },
    description: {
      vi: "FlashFlow là công cụ đa nền tảng dành cho Android power users. Hỗ trợ Pixel, OnePlus, Xiaomi với các tác vụ unlock / lock bootloader, flash ROM stock, OTA, factory ROM, AOSP, Super.img và cài recovery tùy biến như TWRP, OrangeFox. Hoạt động ổn định trên Windows, macOS và Linux.",
      en: "FlashFlow is a cross-platform tool for Android power users. It supports Pixel, OnePlus and Xiaomi devices with bootloader unlock/lock, flashing stock ROMs, OTA, factory images, AOSP, Super.img, and installing custom recoveries like TWRP and OrangeFox. Available on Windows, macOS and Linux."
    },
    features: [
      { key: "fast", label: { vi: "Nhanh & ổn định", en: "High performance and low latency" } },
      { key: "powerful", label: { vi: "Mạnh mẽ, xử lý tác vụ phức tạp", en: "Powerful features designed for advanced users" } },
      { key: "safe", label: { vi: "An toàn cho thiết bị", en: "Stable, secure, and reliable" } },
      { key: "crossPlatform", label: { vi: "Hoạt động trên Windows, macOS và Linux", en: "Runs seamlessly on Windows, macOS, and Linux" } }
    ],
    accent: "blue",
    accentColor: "#06b6d4",
    image: "/products/flashflow.png",
    platforms: ["windows", "macos", "linux"],
    download: "https://github.com/cudin-etn/t-dev-studio/releases/download/flashflow/FlashFlow_Setup.exe"
  },

  fboard: {
    key: "fboard",
    slug: "fboard",
    name: "FBoard",
    tagline: {
      vi: "Bàn phím Android tối giản, siêu nhanh.",
      en: "A minimal, ultra-fast Android keyboard."
    },
    description: {
      vi: "FBoard là bàn phím Android với giao diện hiện đại, sạch sẽ, tập trung tuyệt đối vào tốc độ gõ. Độ trễ gần như bằng 0 (~0.01ms), nhanh hơn đáng kể so với Gboard và Laban Key. Không tích hợp các tính năng rườm rà, chỉ giữ lại những gì cần thiết cho trải nghiệm gõ mượt mà.",
      en: "FBoard is a modern and clean Android keyboard focused purely on typing speed. With near-zero latency (~0.01ms), it outperforms popular keyboards like Gboard and Laban Key. No bloated features — only what matters for a smooth typing experience."
    },
    features: [
      { key: "ultraFast", label: { vi: "Siêu nhanh, độ trễ gần như bằng 0", en: "Ultra-fast response with near-zero latency" } },
      { key: "minimal", label: { vi: "Thiết kế tối giản, tập trung vào cốt lõi", en: "Minimal design focused on core functionality" } },
      { key: "privacy", label: { vi: "Không thu thập dữ liệu, tôn trọng quyền riêng tư", en: "No tracking, no data collection, privacy-first by design" } }
    ],
    accent: "purple",
    accentColor: "#a855f7",
    image: "/products/fboard.png",
    platforms: ["android"],
    download: "https://github.com/cudin-etn/t-dev-studio/releases/download/Fboard/Fboard_v2.1.1.apk"
  },

  "macos-flasher": {
    key: "macos-flasher",
    slug: "macos-flasher",
    name: "macOS Flasher",
    tagline: {
      vi: "Công cụ flash ROM tối ưu cho macOS.",
      en: "A macOS-optimized flasher for OnePlus devices."
    },
    description: {
      vi: "macOS Flasher được thiết kế riêng cho hệ sinh thái Apple, chuyên flash các loại ROM cho OnePlus trên macOS. Hỗ trợ Full OTA, Super.img, AOSP, debloat hệ thống và các thao tác unlock / lock bootloader với giao diện trực quan, thao tác nhanh và an toàn.",
      en: "macOS Flasher is built specifically for the Apple ecosystem, focusing on flashing all types of ROMs for OnePlus devices on macOS. It supports Full OTA, Super.img, AOSP, system debloating, and bootloader unlock/lock with a clean and safe workflow."
    },
    features: [
      { key: "oneplus", label: { vi: "Hỗ trợ chuyên sâu thiết bị OnePlus", en: "Full support for OnePlus devices" } },
      { key: "macOptimized", label: { vi: "Tối ưu chuyên sâu cho macOS", en: "Optimized specifically for macOS workflows" } },
      { key: "safe", label: { vi: "An toàn cho thiết bị", en: "Stable, secure, and reliable" } }
    ],
    accent: "green",
    accentColor: "#10b981",
    image: "/products/macos-flasher.png",
    platforms: ["macos"],
    download: "https://github.com/cudin-etn/t-dev-studio/releases/download/macos-flasher-v1/MacOSFlasher.dmg"
  },

  ddrop: {
    key: "ddrop",
    slug: "ddrop",
    name: "Ddrop",
    tagline: {
      vi: "Truyền file tốc độ cao giữa Android và macOS.",
      en: "High-speed file transfer between Android and macOS."
    },
    description: {
      vi: "Ddrop là giải pháp truyền file giữa Android và macOS với trải nghiệm tương tự AirDrop. Giao diện trực quan, kết nối nhanh và tốc độ gửi nhận file không thua kém AirDrop, giúp việc chia sẻ dữ liệu giữa hai nền tảng trở nên liền mạch.",
      en: "Ddrop is an AirDrop-like solution for Android and macOS. It offers a clean interface, fast discovery and transfer speeds comparable to AirDrop, making cross-platform file sharing seamless."
    },
    features: [
      { key: "fast", label: { vi: "Nhanh & ổn định", en: "High performance and low latency" } },
      { key: "wireless", label: { vi: "Kết nối không dây nhanh và ổn định", en: "Fast and stable wireless connectivity" } },
      { key: "simple", label: { vi: "Đơn giản, dễ dùng", en: "Clean, focused, and distraction-free" } }
    ],
    accent: "indigo",
    accentColor: "#6366f1",
    image: "/products/ddrop.png",
    platforms: ["android", "macos"],
    download: "#"
  }
} as const;