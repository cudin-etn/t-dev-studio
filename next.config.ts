import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "48mb",
    },
  },
  images: {
    remotePatterns: supabaseHostname
      ? [{
          protocol: "https",
          hostname: supabaseHostname,
          pathname: "/storage/v1/object/public/product-assets/**",
        }]
      : [],
  },
};

export default withNextIntl(nextConfig);
