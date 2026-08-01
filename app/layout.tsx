import type { Metadata } from "next";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "T-Dev Studio — Software, Done Right",
  description:
    "T-Dev Studio builds cross-platform tools and apps for Android, macOS, Windows, and Linux. Clean UI, solid engineering, software done right.",
  applicationName: SITE_NAME,
  openGraph: {
    title: "T-Dev Studio — Software, Done Right",
    description:
      "Cross-platform tools and apps for Android, macOS, Windows, and Linux.",
    url: siteUrl,
    siteName: SITE_NAME,
    images: [
      {
        url: "/og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "T-Dev Studio",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "T-Dev Studio — Software, Done Right",
    description:
      "Cross-platform tools and apps for Android, macOS, Windows, and Linux.",
    images: ["/og-banner.jpg"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
