import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1️⃣ BỎ QUA TOÀN BỘ STATIC FILES
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/donate") ||
    pathname.startsWith("/lottie") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.match(/\.(png|jpg|jpeg|svg|webp|gif)$/)
  ) {
    return NextResponse.next();
  }

  // 2️⃣ ĐÃ CÓ LOCALE → CHO QUA
  if (pathname.startsWith("/vi") || pathname.startsWith("/en")) {
    return NextResponse.next();
  }

  // 3️⃣ REDIRECT MẶC ĐỊNH → /vi
  const url = request.nextUrl.clone();
  url.pathname = `/vi${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/:path*"],
};